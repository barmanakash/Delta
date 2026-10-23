from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.ride import RoutePoint


class TripPerson(BaseModel):
    """The other person on a trip, from the signed-in user's point of view."""

    name: str  # a rider's "Rahul M." or a lift taker's first name
    photo_url: Optional[str] = None
    verification: str  # e.g. "Aadhaar Verified"
    gender: Optional[str] = None
    member_since: Optional[str] = None  # "Oct '26"


class Trip(BaseModel):
    """
    A lift that has been agreed: a rider accepted a lift taker's request.
    Riders and lift takers each see their own trips through this one shape.
    """

    id: str  # the lift request's id
    role: str  # whose view this is: "rider" | "lift"
    phase: str  # upcoming | past
    status: str  # matched | completed

    # the other person on the trip
    counterpart: TripPerson
    vehicle_model: str
    vehicle_plate: str

    pickup: str
    destination: str
    pickup_point: str  # the stop the rider picks up at
    arrival_point: str  # the stop the lift taker is dropped at
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None

    travel_date: str  # YYYY-MM-DD
    pickup_time: str  # HH:MM
    arrival_time: str  # HH:MM
    duration_min: int

    overlap_pct: int
    fare: int  # fixed fuel-split, rupees
    helmet_note: str
    walk_note: str
    route_note: str

    # The rider's stops, for drawing the route (empty when stops were typed)
    route: list[RoutePoint] = []
    board_index: Optional[int] = None
    alight_index: Optional[int] = None

    matched_at: Optional[datetime] = None


class TripsResponse(BaseModel):
    role: str
    trips: list[Trip]  # upcoming (soonest first), then past (latest first)
    upcoming_count: int
    past_count: int
    fare_total: int  # fuel-split across past trips: received (rider) / paid (lift taker)
