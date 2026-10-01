from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.database import get_ride_offers_collection
from app.models.ride import RideOfferCreate, RideOfferResponse, RideStop
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
