import uuid
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.database import get_ride_offers_collection
from app.models.ride import (
    CommuteCreate,
    CommuteResponse,
    RideOfferCreate,
    RideOfferResponse,
    RideStop,
)
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

    # Stops on the way out, with minutes after departure at each
    outbound_stops = [{"name": payload.pickup, "offset_min": 0}]
    if payload.stop:
        outbound_stops.append(
            {
                "name": payload.stop,
                "offset_min": payload.stop_offset_min or max(1, payload.duration_min // 2),
            }
        )
    outbound_stops.append({"name": payload.destination, "offset_min": payload.duration_min})

    # The way back visits the same stops in reverse
    return_stops = [
        {"name": s["name"], "offset_min": payload.duration_min - s["offset_min"]}
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
