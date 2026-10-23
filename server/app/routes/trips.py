"""
Trips: lifts that have been agreed (a rider accepted a lift taker's request).

Riders and lift takers call the same endpoint and each get their own side of
every trip: a rider sees the lift taker they are carrying, a lift taker sees
the rider and vehicle they will travel with.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.database import get_lift_requests_collection, get_users_collection
from app.models.trip import Trip, TripPerson, TripsResponse
from app.routes.rides import _first_name, _verification_label
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])

# A request is a trip once a rider has accepted it
TRIP_STATES = ["matched", "completed"]


def _photo_url(filename: Optional[str]) -> Optional[str]:
    return f"/uploads/{settings.PROFILE_PHOTO_SUBDIR}/{filename}" if filename else None


def _trip_span(doc: dict, match: dict) -> tuple[datetime, datetime]:
    """When the trip starts (lift taker's pickup) and ends (their drop)."""
    day = doc["travel_date"]
    start = datetime.strptime(f"{day} {match['pickup_time']}", "%Y-%m-%d %H:%M")
    end = datetime.strptime(f"{day} {match['arrival_time']}", "%Y-%m-%d %H:%M")
    if end < start:  # crossed midnight
        end += timedelta(days=1)
    return start, end


def _build_trip(
    doc: dict, role: str, requester: Optional[dict], now: datetime
) -> tuple[Trip, datetime]:
    match = doc["accepted_match"]
    start, end = _trip_span(doc, match)

    route = match.get("route") or []
    board, alight = match.get("board_index"), match.get("alight_index")

    # Points the lift taker picked; otherwise the rider's stops they were matched to
    pickup_lat, pickup_lng = doc.get("pickup_lat"), doc.get("pickup_lng")
    if pickup_lat is None and route and board is not None:
        pickup_lat, pickup_lng = route[board]["lat"], route[board]["lng"]
    dest_lat, dest_lng = doc.get("destination_lat"), doc.get("destination_lng")
    if dest_lat is None and route and alight is not None:
        dest_lat, dest_lng = route[alight]["lat"], route[alight]["lng"]

    if role == "rider":
        # The rider sees the lift taker by first name only
        r = requester or {}
        created = r.get("created_at")
        counterpart = TripPerson(
            name=_first_name(r.get("full_name")),
            photo_url=_photo_url(r.get("profile_photo")),
            verification=_verification_label(r),
            gender=r.get("gender") or doc.get("requester_gender"),
            member_since=created.strftime("%b '%y") if created else None,
        )
    else:
        counterpart = TripPerson(
            name=match["rider_name"],
            photo_url=match.get("rider_photo_url"),
            verification=match["rider_verification"],
        )

    trip = Trip(
        id=str(doc["_id"]),
        role=role,
        phase="past" if end < now else "upcoming",
        status=doc["status"],
        counterpart=counterpart,
        vehicle_model=match["vehicle_model"],
        vehicle_plate=match["vehicle_plate"],
        pickup=doc["pickup"],
        destination=doc["destination"],
        pickup_point=match["pickup_point"],
        arrival_point=match["arrival_point"],
        pickup_lat=pickup_lat,
        pickup_lng=pickup_lng,
        destination_lat=dest_lat,
        destination_lng=dest_lng,
        travel_date=doc["travel_date"],
        pickup_time=match["pickup_time"],
        arrival_time=match["arrival_time"],
        duration_min=match["duration_min"],
        overlap_pct=match["overlap_pct"],
        fare=match["fare"],
        helmet_note=match["helmet_note"],
        walk_note=match["walk_note"],
        route_note=match["route_note"],
        route=route,
        board_index=board,
        alight_index=alight,
        matched_at=doc.get("matched_at"),
    )
    return trip, start


@router.get(
    "",
    response_model=TripsResponse,
    summary="All of the signed-in user's trips (riders and lift takers)",
)
async def list_trips(current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role == "rider":
        query = {"accepted_rider_id": current_user["_id"]}
    elif role == "lift":
        query = {"user_id": current_user["_id"]}
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Choose a role to see your trips",
        )
    query["status"] = {"$in": TRIP_STATES}

    docs = await get_lift_requests_collection().find(query).to_list(length=300)
    docs = [d for d in docs if d.get("accepted_match")]

    # A rider needs the lift takers' profiles; a lift taker's trip already
    # carries the rider's details from the moment it was accepted
    requesters: dict = {}
    if role == "rider" and docs:
        ids = list({d["user_id"] for d in docs})
        users = await get_users_collection().find({"_id": {"$in": ids}}).to_list(length=len(ids))
        requesters = {u["_id"]: u for u in users}

    now = datetime.now()
    upcoming: list[tuple[datetime, Trip]] = []
    past: list[tuple[datetime, Trip]] = []
    for doc in docs:
        trip, start = _build_trip(doc, role, requesters.get(doc["user_id"]), now)
        (past if trip.phase == "past" else upcoming).append((start, trip))

    upcoming.sort(key=lambda pair: pair[0])  # soonest first
    past.sort(key=lambda pair: pair[0], reverse=True)  # most recent first

    return TripsResponse(
        role=role,
        trips=[t for _, t in upcoming] + [t for _, t in past],
        upcoming_count=len(upcoming),
        past_count=len(past),
        fare_total=sum(t.fare for _, t in past),
    )
