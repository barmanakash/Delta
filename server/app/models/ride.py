import re
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

_TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# ---------------------------------------------------------------------------
#  Ride offers (published by riders, searched by lift takers)
# ---------------------------------------------------------------------------

class RideStop(BaseModel):
    """A named stop along the rider's route, in order of travel."""

    name: str
    # Minutes after the rider departs that they reach this stop
    offset_min: int = Field(ge=0, le=300)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = " ".join(v.split())
        if len(v) < 2 or len(v) > 100:
            raise ValueError("Stop names must be 2 to 100 characters")
        return v


class RideOfferCreate(BaseModel):
    """What a rider submits to offer a lift along their commute."""

    stops: list[RideStop] = Field(min_length=2, max_length=12)
    depart_time: str  # 24h "HH:MM" - when the rider leaves the first stop

    # Either a one-off date or a daily commute
    travel_date: Optional[str] = None  # YYYY-MM-DD
    repeat_daily: bool = False

    seats_available: int = Field(default=1, ge=1, le=2)
    vehicle_type: Literal["bike", "scooter"] = "bike"
    vehicle_model: str
    vehicle_plate: str

    corridor: Optional[str] = None
    # Fuel-split rate: rupees per minute of the lift taker's ride
    rate_per_min: float = Field(default=1.65, ge=0.5, le=5)

    helmet_note: str = "Dual Helmets Provided"
    walk_note: str = "Zero Detour (<200m walk)"
    route_note: str = "Direct Safe Corridor"

    @field_validator("depart_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        v = v.strip()
        if not _TIME_RE.match(v):
            raise ValueError("Departure time must be in 24-hour HH:MM format")
        return v

    @field_validator("vehicle_model", "vehicle_plate")
    @classmethod
    def validate_vehicle(cls, v: str) -> str:
        v = " ".join(v.split())
        if len(v) < 2 or len(v) > 40:
            raise ValueError("Vehicle details must be 2 to 40 characters")
        return v

    @model_validator(mode="after")
    def validate_offer(self):
        if self.stops[0].offset_min != 0:
            raise ValueError("The first stop must have offset_min 0")
        offsets = [s.offset_min for s in self.stops]
        if any(b <= a for a, b in zip(offsets, offsets[1:])):
            raise ValueError("Stops must be in travel order with increasing offsets")

        if self.repeat_daily:
            self.travel_date = None
        elif not self.travel_date or not _DATE_RE.match(self.travel_date):
            raise ValueError("Provide a travel_date (YYYY-MM-DD) or set repeat_daily")
        else:
            datetime.strptime(self.travel_date, "%Y-%m-%d")  # real calendar date
        return self


class RideOfferResponse(BaseModel):
    id: str
    stops: list[RideStop]
    depart_time: str
    travel_date: Optional[str] = None
    repeat_daily: bool
    seats_available: int
    vehicle_type: str
    vehicle_model: str
    vehicle_plate: str
    corridor: Optional[str] = None
    status: str
    created_at: datetime


# ---------------------------------------------------------------------------
#  Matches (what a lift taker sees on the Compatible Riders screen)
# ---------------------------------------------------------------------------

class RideMatch(BaseModel):
    """One rider whose route fits a lift request."""

    offer_id: str
    rider_name: str  # "Rahul M."
    rider_photo_url: Optional[str] = None
    rider_verification: str  # e.g. "Aadhaar & Co. Verified"
    vehicle_type: str
    vehicle_model: str
    vehicle_plate: str
    seats_available: int

    overlap_pct: int
    pickup_time: str  # HH:MM at the lift taker's pickup stop
    pickup_point: str
    arrival_time: str  # HH:MM at the lift taker's drop stop
    arrival_point: str
    duration_min: int

    fare: int  # fixed fuel-split, rupees
    helmet_note: str
    walk_note: str
    route_note: str
    corridor: Optional[str] = None
    is_demo: bool = False
