"""
Payments for trips (TEST MODE ONLY, no real money).

A trip is a lift request that a rider accepted. Its price is the fixed
fuel-split saved on the trip (`accepted_match.fare`, whole rupees). The lift
taker pays it; the payment's state lives on the same document under
`payment`:

    { status: pending | paid | failed | refunded,
      provider: sandbox | stripe, session_id, amount, currency, paid_at, ... }

No `payment` field means "unpaid". See app/utils/payments.py for the providers.
"""

from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from app.database import get_lift_requests_collection, get_users_collection
from app.models.payment import (
    CheckoutResponse,
    PaymentStatus,
    ReceivedPayment,
    ReceivedPayments,
    SandboxOutcome,
    SandboxSession,
    SeenPayments,
)
from app.models.user import MessageResponse
from app.routes.rides import _first_name
from app.utils import payments as provider
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

# A trip can be paid for once a rider has accepted it
PAYABLE_STATES = ("matched", "completed")


# ---------------------------------------------------------------------------
#  Helpers
# ---------------------------------------------------------------------------

def _object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )


def _require_lift_taker(user: dict) -> None:
    if user.get("role") != "lift":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lift takers pay for a trip",
        )


def _status_of(doc: dict) -> PaymentStatus:
    payment = doc.get("payment") or {}
    return PaymentStatus(
        trip_id=str(doc["_id"]),
        status=payment.get("status", "unpaid"),
        amount=int(doc["accepted_match"]["fare"]),
        provider=payment.get("provider", provider.provider_name()),
        paid_at=payment.get("paid_at"),
    )


async def _my_trip(request_id: str, user: dict) -> dict:
    """The signed-in lift taker's own accepted trip."""
    doc = await get_lift_requests_collection().find_one(
        {"_id": _object_id(request_id), "user_id": user["_id"]}
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        )
    if doc.get("status") not in PAYABLE_STATES or not doc.get("accepted_match"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You can pay once a rider has accepted your request",
        )
    return doc


# ---------------------------------------------------------------------------
#  POST /api/payments/trips/{request_id}/checkout
# ---------------------------------------------------------------------------

@router.post(
    "/trips/{request_id}/checkout",
    response_model=CheckoutResponse,
    summary="Start paying for a trip: returns the page to send the lift taker to",
)
async def start_checkout(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    _require_lift_taker(current_user)
    doc = await _my_trip(request_id, current_user)

    if (doc.get("payment") or {}).get("status") == "paid":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This trip is already paid",
        )

    amount = int(doc["accepted_match"]["fare"])
    title = f"FriendRide lift: {doc['pickup']} to {doc['destination']}"
    session_id, checkout_url = await provider.create_checkout(
        str(doc["_id"]), amount, title
    )

    # Only record the attempt if the trip didn't get paid in the meantime
    result = await get_lift_requests_collection().update_one(
        {"_id": doc["_id"], "payment.status": {"$ne": "paid"}},
        {
            "$set": {
                "payment": {
                    "status": "pending",
                    "provider": provider.provider_name(),
                    "session_id": session_id,
                    "amount": amount,
                    "currency": "INR",
                    "started_at": datetime.now(timezone.utc),
                }
            }
        },
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This trip is already paid",
        )

    return CheckoutResponse(
        checkout_url=checkout_url, provider=provider.provider_name()
    )


# ---------------------------------------------------------------------------
#  POST /api/payments/trips/{request_id}/confirm
# ---------------------------------------------------------------------------

@router.post(
    "/trips/{request_id}/confirm",
    response_model=PaymentStatus,
    summary="Check a trip's payment (asks Stripe when a Stripe payment is pending)",
)
async def confirm_payment(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Called when the lift taker comes back from the payment page. The server
    asks the provider itself, so a payment is never marked paid just because
    the browser said so.
    """
    _require_lift_taker(current_user)
    doc = await _my_trip(request_id, current_user)
    payment = doc.get("payment") or {}

    if (
        payment.get("status") == "pending"
        and payment.get("provider") == "stripe"
        and payment.get("session_id")
    ):
        paid, intent = await provider.fetch_paid_state(payment["session_id"])
        if paid:
            lifts = get_lift_requests_collection()
            await lifts.update_one(
                {"_id": doc["_id"], "payment.status": "pending"},
                {
                    "$set": {
                        "payment.status": "paid",
                        "payment.paid_at": datetime.now(timezone.utc),
                        "payment.payment_intent": intent,
                    }
                },
            )
            doc = await lifts.find_one({"_id": doc["_id"]})

    return _status_of(doc)


# ---------------------------------------------------------------------------
#  Rider side: "you received a payment" notices
# ---------------------------------------------------------------------------

@router.get(
    "/received",
    response_model=ReceivedPayments,
    summary="Payments a rider has received but hasn't been told about yet",
)
async def list_received_payments(current_user: dict = Depends(get_current_user)):
    """
    The rider's app asks this every few seconds. A paid trip shows up here
    until the rider has seen its notice (see /received/seen), so a payment
    made while the rider was offline is still announced next time they open
    the app.
    """
    if current_user.get("role") != "rider":
        return ReceivedPayments(payments=[])

    docs = (
        await get_lift_requests_collection()
        .find(
            {
                "accepted_rider_id": current_user["_id"],
                "payment.status": "paid",
                "payment.rider_seen_at": {"$exists": False},
            }
        )
        .sort("payment.paid_at", -1)
        .to_list(length=20)
    )
    docs = [d for d in docs if d.get("accepted_match")]
    if not docs:
        return ReceivedPayments(payments=[])

    user_ids = list({d["user_id"] for d in docs})
    users = await get_users_collection().find({"_id": {"$in": user_ids}}).to_list(
        length=len(user_ids)
    )
    names = {u["_id"]: _first_name(u.get("full_name")) for u in users}

    return ReceivedPayments(
        payments=[
            ReceivedPayment(
                trip_id=str(d["_id"]),
                amount=int(d["payment"].get("amount") or d["accepted_match"]["fare"]),
                from_name=names.get(d["user_id"]) or "A lift taker",
                pickup=d["pickup"],
                destination=d["destination"],
                paid_at=d["payment"].get("paid_at"),
            )
            for d in docs
        ]
    )


@router.post(
    "/received/seen",
    response_model=MessageResponse,
    summary="The rider has seen these payment notices: stop announcing them",
)
async def mark_received_seen(
    payload: SeenPayments,
    current_user: dict = Depends(get_current_user),
):
    ids = [ObjectId(t) for t in payload.trip_ids if ObjectId.is_valid(t)]
    if ids and current_user.get("role") == "rider":
        await get_lift_requests_collection().update_many(
            {
                "_id": {"$in": ids},
                "accepted_rider_id": current_user["_id"],
                "payment.status": "paid",
            },
            {"$set": {"payment.rider_seen_at": datetime.now(timezone.utc)}},
        )
    return MessageResponse(message="OK")


# ---------------------------------------------------------------------------
#  Sandbox checkout (the built-in test payment page)
# ---------------------------------------------------------------------------

def _sandbox_query(session_id: str, user: dict) -> dict:
    return {
        "payment.session_id": session_id,
        "payment.provider": "sandbox",
        "user_id": user["_id"],
    }


@router.get(
    "/sandbox/{session_id}",
    response_model=SandboxSession,
    summary="What the test checkout page shows for one payment",
)
async def get_sandbox_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    _require_lift_taker(current_user)
    doc = await get_lift_requests_collection().find_one(
        _sandbox_query(session_id, current_user)
    )
    if not doc or not doc.get("accepted_match"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment session not found",
        )

    match, payment = doc["accepted_match"], doc["payment"]
    return SandboxSession(
        session_id=session_id,
        trip_id=str(doc["_id"]),
        status=payment["status"],
        amount=int(payment["amount"]),
        pickup=doc["pickup"],
        destination=doc["destination"],
        rider_name=match["rider_name"],
        travel_date=doc["travel_date"],
        pickup_time=match["pickup_time"],
    )


@router.post(
    "/sandbox/{session_id}/complete",
    response_model=PaymentStatus,
    summary="Finish a test payment as paid or failed",
)
async def complete_sandbox_payment(
    session_id: str,
    payload: SandboxOutcome,
    current_user: dict = Depends(get_current_user),
):
    _require_lift_taker(current_user)
    lifts = get_lift_requests_collection()
    query = _sandbox_query(session_id, current_user)

    doc = await lifts.find_one(query)
    if not doc or not doc.get("accepted_match"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment session not found",
        )
    if doc["payment"]["status"] != "pending":
        return _status_of(doc)  # already settled: pressing twice is harmless

    now = datetime.now(timezone.utc)
    changes = (
        {"payment.status": "paid", "payment.paid_at": now}
        if payload.outcome == "success"
        else {"payment.status": "failed", "payment.failed_at": now}
    )
    updated = await lifts.find_one_and_update(
        {**query, "payment.status": "pending"},
        {"$set": changes},
        return_document=ReturnDocument.AFTER,
    )
    return _status_of(updated or doc)
