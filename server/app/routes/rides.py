import uuid
from datetime import date, datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from app.config import settings
from app.database import (
    get_lift_requests_collection,
    get_ride_offers_collection,
    get_users_collection,
)
from app.models.ride import (
    CommuteCreate,
    CommuteResponse,
    IncomingRequest,
    IncomingRequestsResponse,
    RideOfferCreate,
    RideOfferResponse,
    RideStop,
)
from app.models.user import MessageResponse
from app.utils.matching import build_match
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/rides", tags=["Ride offers"])


def _to_response(doc: dict) -> RideOfferResponse:
    return RideOfferResponse(
        id=str(doc["_id"]),
        stops=[RideStop(**s) for s in doc["stops"]],
        depart_time=doc["depart_time"],
        travel_date=doc.get("travel_date"),
        repeat_daily=doc.get("repeat_daily", False),
        seats_available=doc["seats_available"],
        vehicle_type=doc["vehicle_type"],
        vehicle_model=doc["vehicle_model"],
        vehicle_plate=doc["vehicle_plate"],
        corridor=doc.get("corridor"),
        status=doc["status"],
        created_at=doc["created_at"],
    )


def _display_name(full_name: str) -> str:
    """'Rahul Mehta' -> 'Rahul M.' (riders are shown by first name + initial)."""
    parts = full_name.split()
    if len(parts) > 1:
        return f"{parts[0]} {parts[-1][0].upper()}."
    return parts[0] if parts else "Rider"


def _verification_label(user: dict) -> str:
    doc = user.get("id_document")
    if doc and doc.get("status") == "verified":
        return "Aadhaar Verified"
    return "ID under review"


# ---------------------------------------------------------------------------
#  POST /api/rides/offers
# ---------------------------------------------------------------------------

@router.post(
    "/offers",
    response_model=RideOfferResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Publish a route a rider can offer a lift along",
)
async def create_ride_offer(
    payload: RideOfferCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Lift takers searching on a matching route will see this rider on their
    Compatible Riders screen. Only users whose role is `rider` can publish.
    """
    if current_user.get("role") != "rider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only riders can offer a lift",
        )

    if payload.travel_date and (
        datetime.strptime(payload.travel_date, "%Y-%m-%d").date() < date.today()
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Travel date cannot be in the past",
        )

    photo = current_user.get("profile_photo")
    doc = {
        "user_id": current_user["_id"],
        # Snapshot of how the rider is shown to lift takers
        "rider_name": _display_name(current_user.get("full_name", "")),
        "rider_photo_url": (
            f"/uploads/{settings.PROFILE_PHOTO_SUBDIR}/{photo}" if photo else None
        ),
        "rider_gender": current_user.get("gender"),
        "rider_verification": _verification_label(current_user),
        "stops": [s.model_dump() for s in payload.stops],
        "depart_time": payload.depart_time,
        "travel_date": payload.travel_date,
        "repeat_daily": payload.repeat_daily,
        "seats_available": payload.seats_available,
        "vehicle_type": payload.vehicle_type,
        "vehicle_model": payload.vehicle_model,
        "vehicle_plate": payload.vehicle_plate,
        "corridor": payload.corridor,
        "rate_per_min": payload.rate_per_min,
        "helmet_note": payload.helmet_note,
        "walk_note": payload.walk_note,
        "route_note": payload.route_note,
        "status": "active",
        "created_at": datetime.now(timezone.utc),
    }
    result = await get_ride_offers_collection().insert_one(doc)
    doc["_id"] = result.inserted_id
    return _to_response(doc)


# ---------------------------------------------------------------------------
#  GET /api/rides/offers/mine
# ---------------------------------------------------------------------------

@router.get(
    "/offers/mine",
    response_model=list[RideOfferResponse],
    summary="The signed-in rider's published routes (newest first)",
)
async def list_my_offers(current_user: dict = Depends(get_current_user)):
    cursor = (
        get_ride_offers_collection()
        .find({"user_id": current_user["_id"]})
        .sort("created_at", -1)
        .limit(50)
    )
    return [_to_response(doc) for doc in await cursor.to_list(length=50)]


# ---------------------------------------------------------------------------
#  Commutes: the rider's "Create Your Commute" screen
# ---------------------------------------------------------------------------

# Same defaults a one-off offer gets, so both kinds of offer look alike
_OFFER_DEFAULTS = {
    key: RideOfferCreate.model_fields[key].default
    for key in ("rate_per_min", "helmet_note", "walk_note", "route_note")
}


def _rider_snapshot(user: dict) -> dict:
    """How the rider is shown to lift takers, frozen at publish time."""
    photo = user.get("profile_photo")
    return {
        "rider_name": _display_name(user.get("full_name", "")),
        "rider_photo_url": (
            f"/uploads/{settings.PROFILE_PHOTO_SUBDIR}/{photo}" if photo else None
        ),
        "rider_gender": user.get("gender"),
        "rider_verification": _verification_label(user),
    }


@router.post(
    "/commutes",
    response_model=CommuteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Publish a repeating commute (outbound and optional return trip)",
)
async def create_commute(
    payload: CommuteCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Saves the commute as ride offers that repeat on the chosen weekdays: one
    for the outbound trip and, when the return trip is on, one for the way
    back along the same stops in reverse. A rider has one active commute at a
    time, so publishing a new one replaces the previous one.
    """
    if current_user.get("role") != "rider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only riders can offer a lift",
        )

    offers = get_ride_offers_collection()
    now = datetime.now(timezone.utc)
    commute_id = uuid.uuid4().hex

    # Stops on the way out, with minutes after departure at each. The map
    # point is kept so lift takers can see the rider's real route.
    outbound_stops = [
        {
            "name": payload.pickup,
            "offset_min": 0,
            "lat": payload.pickup_lat,
            "lng": payload.pickup_lng,
        }
    ]
    if payload.stop:
        outbound_stops.append(
            {
                "name": payload.stop,
                "offset_min": payload.stop_offset_min or max(1, payload.duration_min // 2),
                "lat": payload.stop_lat,
                "lng": payload.stop_lng,
            }
        )
    outbound_stops.append(
        {
            "name": payload.destination,
            "offset_min": payload.duration_min,
            "lat": payload.destination_lat,
            "lng": payload.destination_lng,
        }
    )

    # The way back visits the same stops in reverse
    return_stops = [
        {
            "name": s["name"],
            "offset_min": payload.duration_min - s["offset_min"],
            "lat": s["lat"],
            "lng": s["lng"],
        }
        for s in reversed(outbound_stops)
    ]

    common = {
        "user_id": current_user["_id"],
        **_rider_snapshot(current_user),
        "travel_date": None,
        "repeat_daily": True,  # repeats ...
        "repeat_days": payload.days,  # ... but only on these weekdays
        "seats_available": payload.seats,
        "vehicle_type": payload.vehicle_type,
        "vehicle_model": payload.vehicle_model,
        "vehicle_plate": payload.vehicle_plate,
        "corridor": f"Via {payload.stop}" if payload.stop else None,
        **_OFFER_DEFAULTS,
        "status": "active",
        "commute_id": commute_id,
        "created_at": now,
    }

    docs = [
        {
            **common,
            "direction": "outbound",
            "stops": outbound_stops,
            "depart_time": payload.outbound_time,
            # Kept so the form can be pre-filled when the rider edits it
            "commute_form": payload.model_dump(),
        }
    ]
    if payload.return_enabled:
        docs.append(
            {
                **common,
                "direction": "return",
                "stops": return_stops,
                "depart_time": payload.return_time,
            }
        )

    # One active commute at a time
    await offers.update_many(
        {
            "user_id": current_user["_id"],
            "commute_id": {"$exists": True},
            "status": "active",
        },
        {"$set": {"status": "replaced", "replaced_at": now}},
    )
    await offers.insert_many(docs)

    return CommuteResponse(
        id=commute_id, status="active", created_at=now, **payload.model_dump()
    )


@router.get(
    "/commutes/active",
    response_model=Optional[CommuteResponse],
    summary="The signed-in rider's active commute (null if none)",
)
async def get_active_commute(current_user: dict = Depends(get_current_user)):
    doc = await get_ride_offers_collection().find_one(
        {
            "user_id": current_user["_id"],
            "commute_id": {"$exists": True},
            "direction": "outbound",
            "status": "active",
        },
        sort=[("created_at", -1)],
    )
    if not doc or not doc.get("commute_form"):
        return None
    return CommuteResponse(
        id=doc["commute_id"],
        status=doc["status"],
        created_at=doc["created_at"],
        **doc["commute_form"],
    )


# ---------------------------------------------------------------------------
#  Incoming lift requests: the rider's "Lift Requests" screens
# ---------------------------------------------------------------------------
#
# A lift taker's request is shown to a rider when it fits one of the rider's
# active commutes (the same test lift takers' results use, so both sides agree).
# Accepting reserves the pillion seat: the request becomes "matched" and the
# lift taker sees who accepted. Declining only hides it from this rider.


def _require_rider(user: dict) -> None:
    if user.get("role") != "rider":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only riders can see lift requests",
        )


def _request_object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lift request not found",
        )


def _first_name(full_name: Optional[str]) -> str:
    """Lift takers are only ever shown to riders by first name."""
    parts = (full_name or "").split()
    return parts[0] if parts else "Commuter"


def _minutes_until(day: str, clock: str) -> int:
    end = datetime.strptime(f"{day} {clock}", "%Y-%m-%d %H:%M")
    return max(0, int((end - datetime.now()).total_seconds() // 60))


def _incoming_from(
    doc: dict, requester: Optional[dict], rider: dict, match: dict, state: str
) -> IncomingRequest:
    """One lift request as the rider sees it."""
    route = match.get("route") or []
    board, alight = match.get("board_index"), match.get("alight_index")

    # Use the points the lift taker picked; otherwise the rider's own stops
    # that the request was matched to (a rider's stops are always located)
    pickup_lat, pickup_lng = doc.get("pickup_lat"), doc.get("pickup_lng")
    if pickup_lat is None and route and board is not None:
        pickup_lat, pickup_lng = route[board]["lat"], route[board]["lng"]
    dest_lat, dest_lng = doc.get("destination_lat"), doc.get("destination_lng")
    if dest_lat is None and route and alight is not None:
        dest_lat, dest_lng = route[alight]["lat"], route[alight]["lng"]

    gender = (requester or {}).get("gender") or doc.get("requester_gender")
    photo = (requester or {}).get("profile_photo")
    created = (requester or {}).get("created_at")

    return IncomingRequest(
        id=str(doc["_id"]),
        offer_id=match["offer_id"],
        status=state,
        requester_name=_first_name((requester or {}).get("full_name")),
        requester_photo_url=(
            f"/uploads/{settings.PROFILE_PHOTO_SUBDIR}/{photo}" if photo else None
        ),
        requester_gender=gender,
        same_gender=bool(gender and gender == rider.get("gender")),
        requester_verification=_verification_label(requester or {}),
        member_since=created.strftime("%b '%y") if created else None,
        pickup=doc["pickup"],
        destination=doc["destination"],
        pickup_lat=pickup_lat,
        pickup_lng=pickup_lng,
        destination_lat=dest_lat,
        destination_lng=dest_lng,
        travel_date=doc["travel_date"],
        window_start=doc["window_start"],
        window_end=doc["window_end"],
        expires_in_min=(
            _minutes_until(doc["travel_date"], doc["window_end"]) if state == "pending" else 0
        ),
        created_at=doc["created_at"],
        overlap_pct=match["overlap_pct"],
        pickup_time=match["pickup_time"],
        arrival_time=match["arrival_time"],
        duration_min=match["duration_min"],
        fare=match["fare"],
        walk_note=match["walk_note"],
        route_note=match["route_note"],
    )


async def _collect_incoming(
    rider: dict,
) -> tuple[list[tuple[IncomingRequest, dict]], int]:
    """
    Every lift request this rider can act on, as (request, match details)
    pairs: pending ones first (best route overlap first), then accepted ones.
    Also returns the rider's earnings from completed lifts.
    """
    offers_col = get_ride_offers_collection()
    lifts = get_lift_requests_collection()
    now = datetime.now()

    offers = await offers_col.find(
        {"user_id": rider["_id"], "status": "active", "seats_available": {"$gte": 1}}
    ).to_list(length=20)

    # A route published before the gender was saved has none on it; these are
    # the rider's own routes, so use the rider's current gender (otherwise the
    # same-gender filter hides every request from them)
    for offer in offers:
        if not offer.get("rider_gender"):
            offer["rider_gender"] = rider.get("gender")

    pairs: list[tuple[dict, dict, str]] = []

    if offers:
        pending = await lifts.find(
            {
                "status": "searching",
                "travel_date": {"$gte": date.today().isoformat()},
                "declined_by": {"$ne": rider["_id"]},
            }
        ).to_list(length=300)

        for doc in pending:
            end = datetime.strptime(
                f"{doc['travel_date']} {doc['window_end']}", "%Y-%m-%d %H:%M"
            )
            if end <= now:
                continue  # the lift taker's window has passed

            best: Optional[dict] = None
            for offer in offers:
                # A one-off ride only fits its own day; commutes repeat
                if not (offer.get("repeat_daily") or offer.get("travel_date") == doc["travel_date"]):
                    continue
                found = build_match(offer, doc, now)
                if found and (best is None or found["overlap_pct"] > best["overlap_pct"]):
                    best = found
            if best:
                pairs.append((doc, best, "pending"))

    accepted = (
        await lifts.find({"status": "matched", "accepted_rider_id": rider["_id"]})
        .sort("matched_at", -1)
        .to_list(length=50)
    )
    for doc in accepted:
        if doc.get("accepted_match"):
            pairs.append((doc, doc["accepted_match"], "accepted"))

    requester_ids = list({doc["user_id"] for doc, _, _ in pairs})
    requesters: dict = {}
    if requester_ids:
        users = await get_users_collection().find({"_id": {"$in": requester_ids}}).to_list(
            length=len(requester_ids)
        )
        requesters = {u["_id"]: u for u in users}

    items = [
        (_incoming_from(doc, requesters.get(doc["user_id"]), rider, match, state), match)
        for doc, match, state in pairs
    ]
    items.sort(
        key=lambda pair: (
            pair[0].status != "pending",  # pending first
            -pair[0].overlap_pct,
            pair[0].travel_date,
            pair[0].pickup_time,
        )
    )

    completed = await lifts.find(
        {"status": "completed", "accepted_rider_id": rider["_id"]}
    ).to_list(length=500)
    earnings = sum(int((d.get("accepted_match") or {}).get("fare", 0)) for d in completed)

    return items, earnings


@router.get(
    "/requests/incoming",
    response_model=IncomingRequestsResponse,
    summary="Lift requests that fit the signed-in rider's commutes",
)
async def list_incoming_requests(current_user: dict = Depends(get_current_user)):
    _require_rider(current_user)
    items, earnings = await _collect_incoming(current_user)
    requests = [incoming for incoming, _ in items]
    return IncomingRequestsResponse(
        requests=requests,
        pending_count=sum(1 for r in requests if r.status == "pending"),
        accepted_count=sum(1 for r in requests if r.status == "accepted"),
        earnings=earnings,
    )


@router.get(
    "/requests/{request_id}",
    response_model=IncomingRequest,
    summary="One incoming lift request, with the details to review it",
)
async def get_incoming_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    _require_rider(current_user)
    _request_object_id(request_id)
    items, _ = await _collect_incoming(current_user)
    for incoming, _match in items:
        if incoming.id == request_id:
            return incoming
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="This request is no longer available",
    )


@router.post(
    "/requests/{request_id}/accept",
    response_model=IncomingRequest,
    summary="Accept a lift request and reserve the pillion seat",
)
async def accept_incoming_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    _require_rider(current_user)
    oid = _request_object_id(request_id)

    items, _ = await _collect_incoming(current_user)
    entry = next(((i, m) for i, m in items if i.id == request_id), None)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This request is no longer available",
        )
    incoming, match = entry
    if incoming.status == "accepted":
        return incoming  # accepting twice is harmless

    lifts = get_lift_requests_collection()

    # One pillion seat per trip: don't double-book the same ride on the same day
    already = await lifts.count_documents(
        {
            "status": "matched",
            "accepted_offer_id": ObjectId(match["offer_id"]),
            "travel_date": incoming.travel_date,
        }
    )
    if already >= match["seats_available"]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Your pillion seat is already booked for that trip",
        )

    # Only succeeds while the lift taker is still searching (not cancelled,
    # and not taken by another rider a moment ago)
    updated = await lifts.find_one_and_update(
        {"_id": oid, "status": "searching"},
        {
            "$set": {
                "status": "matched",
                "accepted_rider_id": current_user["_id"],
                "accepted_offer_id": ObjectId(match["offer_id"]),
                "accepted_match": match,
                "matched_at": datetime.now(timezone.utc),
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This request was cancelled or already taken by another rider",
        )

    incoming.status = "accepted"
    incoming.expires_in_min = 0
    return incoming


@router.post(
    "/requests/{request_id}/decline",
    response_model=MessageResponse,
    summary="Decline a lift request (it stays open for other riders)",
)
async def decline_incoming_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    _require_rider(current_user)
    result = await get_lift_requests_collection().update_one(
        {"_id": _request_object_id(request_id), "status": "searching"},
        {"$addToSet": {"declined_by": current_user["_id"]}},
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This request is no longer available",
        )
    return MessageResponse(message="Request declined")
