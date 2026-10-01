from datetime import date, datetime, timedelta, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo import ReturnDocument

from app.database import get_lift_requests_collection, get_ride_offers_collection
from app.models.lift import (
    LiftMatchesResponse,
    LiftRequestCreate,
    LiftRequestResponse,
)
from app.models.ride import RideMatch
from app.utils.matching import build_match
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/lifts", tags=["Lift requests"])

# How far ahead a lift can be scheduled ("Schedule Ahead")
MAX_DAYS_AHEAD = 30


# ---------------------------------------------------------------------------
#  Helpers
# ---------------------------------------------------------------------------

def _window_has_passed(doc: dict) -> bool:
    """True once the end of the requested time window is in the past."""
    end = datetime.strptime(
        f"{doc['travel_date']} {doc['window_end']}", "%Y-%m-%d %H:%M"
    )
    return end <= datetime.now()


def _to_response(doc: dict) -> LiftRequestResponse:
    # A request still "searching" after its window ended is shown as expired,
    # so there is no background job to keep in sync.
    state = doc["status"]
    if state == "searching" and _window_has_passed(doc):
        state = "expired"

    return LiftRequestResponse(
        id=str(doc["_id"]),
        pickup=doc["pickup"],
        destination=doc["destination"],
        travel_date=doc["travel_date"],
        window_start=doc["window_start"],
        window_end=doc["window_end"],
        same_gender_only=doc.get("same_gender_only", False),
        two_wheeler_only=doc.get("two_wheeler_only", True),
        zero_detour_only=doc.get("zero_detour_only", False),
        flexible_pickup=doc.get("flexible_pickup", False),
        status=state,
        created_at=doc["created_at"],
    )


def _parse_travel_date(value: str) -> date:
    """Parse YYYY-MM-DD and make sure it is today or within the next 30 days."""
    try:
        travel = datetime.strptime(value.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Commute date must be a valid date in YYYY-MM-DD format",
        )

    today = date.today()
    if travel < today:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Commute date cannot be in the past",
        )
    if travel > today + timedelta(days=MAX_DAYS_AHEAD):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"You can schedule up to {MAX_DAYS_AHEAD} days ahead",
        )
    return travel


def _object_id(value: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lift request not found",
        )


# Flexible pickup widens the search to this many minutes either side of the
# requested start time ("Within 30 minutes, +/-15 mins buffer").
FLEX_BUFFER_MINUTES = 15


def _to_minutes(t: str) -> int:
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def _from_minutes(mins: int) -> str:
    mins = max(0, min(mins, 23 * 60 + 59))
    return f"{mins // 60:02d}:{mins % 60:02d}"


def _search_window(start: str, end: str, flexible: bool) -> tuple[str, str]:
    """The time range matching will actually search (wider when flexible)."""
    if not flexible:
        return start, end
    s, e = _to_minutes(start), _to_minutes(end)
    return (
        _from_minutes(min(s, s - FLEX_BUFFER_MINUTES)),
        _from_minutes(max(e, s + FLEX_BUFFER_MINUTES)),
    )


# ---------------------------------------------------------------------------
#  POST /api/lifts/requests
# ---------------------------------------------------------------------------

@router.post(
    "/requests",
    response_model=LiftRequestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Request a lift along a commute route",
)
async def create_lift_request(
    payload: LiftRequestCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Save a new lift request for the signed-in lift taker.

    - Only users whose role is `lift` can request a lift.
    - The date must be today or within the next 30 days, and a window that has
      already ended today is rejected.
    - A lift taker has one active search at a time: submitting a new request
      cancels any earlier request that is still searching.
    """
    if current_user.get("role") != "lift":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lift takers can request a lift",
        )

    if payload.pickup.casefold() == payload.destination.casefold():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pickup and destination must be different",
        )

    if payload.same_gender_only and not current_user.get("gender"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Add your gender in your profile to use the same-gender filter",
        )

    travel = _parse_travel_date(payload.travel_date)
    if travel == date.today():
        window_end = datetime.strptime(
            f"{travel.isoformat()} {payload.window_end}", "%Y-%m-%d %H:%M"
        )
        if window_end <= datetime.now():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="That time window has already passed. Pick a later one.",
            )

    requests = get_lift_requests_collection()
    now = datetime.now(timezone.utc)
    search_start, search_end = _search_window(
        payload.window_start, payload.window_end, payload.flexible_pickup
    )

    # One active search at a time
    await requests.update_many(
        {"user_id": current_user["_id"], "status": "searching"},
        {"$set": {"status": "cancelled", "cancelled_at": now, "cancel_reason": "replaced"}},
    )

    doc = {
        "user_id": current_user["_id"],
        "pickup": payload.pickup,
        "pickup_lat": payload.pickup_lat,
        "pickup_lng": payload.pickup_lng,
        "destination": payload.destination,
        "travel_date": travel.isoformat(),
        "window_start": payload.window_start,
        "window_end": payload.window_end,
        "same_gender_only": payload.same_gender_only,
        "two_wheeler_only": payload.two_wheeler_only,
        "zero_detour_only": payload.zero_detour_only,
        "flexible_pickup": payload.flexible_pickup,
        # The range matching searches (equals the window unless flexible)
        "search_window_start": search_start,
        "search_window_end": search_end,
        # Snapshot of the requester's gender, used later by same-gender matching
        "requester_gender": current_user.get("gender"),
        "status": "searching",
        "created_at": now,
    }
    result = await requests.insert_one(doc)
    doc["_id"] = result.inserted_id

    return _to_response(doc)


# ---------------------------------------------------------------------------
#  GET /api/lifts/requests
# ---------------------------------------------------------------------------

@router.get(
    "/requests",
    response_model=list[LiftRequestResponse],
    summary="The signed-in lift taker's recent requests (newest first)",
)
async def list_lift_requests(
    limit: int = Query(5, ge=1, le=50),
    current_user: dict = Depends(get_current_user),
):
    """Powers the 'Recent Activity' card and the active-request banner."""
    requests = get_lift_requests_collection()
    cursor = (
        requests.find({"user_id": current_user["_id"]})
        .sort("created_at", -1)
        .limit(limit)
    )
    docs = await cursor.to_list(length=limit)
    return [_to_response(doc) for doc in docs]


# ---------------------------------------------------------------------------
#  POST /api/lifts/requests/{request_id}/cancel
# ---------------------------------------------------------------------------

@router.post(
    "/requests/{request_id}/cancel",
    response_model=LiftRequestResponse,
    summary="Cancel a lift request that is still searching",
)
async def cancel_lift_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    requests = get_lift_requests_collection()

    doc = await requests.find_one_and_update(
        {
            "_id": _object_id(request_id),
            "user_id": current_user["_id"],  # users can only cancel their own
            "status": "searching",
        },
        {
            "$set": {
                "status": "cancelled",
                "cancelled_at": datetime.now(timezone.utc),
                "cancel_reason": "user",
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active lift request found",
        )
    return _to_response(doc)


# ---------------------------------------------------------------------------
#  GET /api/lifts/requests/{request_id}/matches
# ---------------------------------------------------------------------------

@router.get(
    "/requests/{request_id}/matches",
    response_model=LiftMatchesResponse,
    summary="Riders whose routes fit this lift request",
)
async def get_request_matches(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Powers the Compatible Riders screen. Matches are only computed while the
    request is still searching; a cancelled or expired request returns none.
    Riders are ranked by route overlap, then by earliest pickup.
    """
    doc = await get_lift_requests_collection().find_one(
        {"_id": _object_id(request_id), "user_id": current_user["_id"]}
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lift request not found",
        )

    response = _to_response(doc)
    matches: list[RideMatch] = []

    if response.status == "searching":
        cursor = get_ride_offers_collection().find(
            {
                "status": "active",
                "seats_available": {"$gte": 1},
                "$or": [
                    {"travel_date": doc["travel_date"]},
                    {"repeat_daily": True},
                ],
            }
        )
        now = datetime.now()
        for offer in await cursor.to_list(length=200):
            found = build_match(offer, doc, now)
            if found:
                matches.append(RideMatch(**found))
        matches.sort(key=lambda m: (-m.overlap_pct, m.pickup_time))

    return LiftMatchesResponse(
        request=response,
        search_window_start=doc.get("search_window_start", doc["window_start"]),
        search_window_end=doc.get("search_window_end", doc["window_end"]),
        matches=matches,
    )
