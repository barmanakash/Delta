import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.ride import RideMatch

_TIME_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


# ---------------------------------------------------------------------------
#  Request Models
# ---------------------------------------------------------------------------

class LiftRequestCreate(BaseModel):
    """What a lift taker submits from the 'Plan Your Commute' card."""

    pickup: str
    destination: str
    # Only set when the user used the "Current GPS" button
    pickup_lat: Optional[float] = Field(default=None, ge=-90, le=90)
    pickup_lng: Optional[float] = Field(default=None, ge=-180, le=180)

    travel_date: str  # ISO format: YYYY-MM-DD
    window_start: str  # 24h "HH:MM"
    window_end: str  # 24h "HH:MM"

    same_gender_only: bool = False
    two_wheeler_only: bool = True
    zero_detour_only: bool = False
    # "Flexible pickup time": widen the search to +/-15 min around window_start
    flexible_pickup: bool = False

    @field_validator("pickup", "destination")
    @classmethod
    def validate_place(cls, v: str) -> str:
        v = " ".join(v.split())  # trim + collapse inner whitespace
        if len(v) < 3:
            raise ValueError("Enter at least 3 characters for the location")
        if len(v) > 200:
            raise ValueError("Location must be 200 characters or fewer")
        return v

    @field_validator("window_start", "window_end")
    @classmethod
    def validate_time(cls, v: str) -> str:
        v = v.strip()
        if not _TIME_RE.match(v):
            raise ValueError("Time must be in 24-hour HH:MM format")
        return v

    @model_validator(mode="after")
    def validate_window(self):
        if self.window_end <= self.window_start:
            raise ValueError("The end of the time window must be after its start")
        return self


# ---------------------------------------------------------------------------
#  Response Models
# ---------------------------------------------------------------------------

class LiftRequestResponse(BaseModel):
    """A lift request as returned by the API."""

    id: str
    pickup: str
    destination: str
    travel_date: str
    window_start: str
    window_end: str
    same_gender_only: bool
    two_wheeler_only: bool
    zero_detour_only: bool
    flexible_pickup: bool = False
    # searching | cancelled | expired  (matched / completed arrive with matching)
    status: str
    created_at: datetime


class LiftMatchesResponse(BaseModel):
    """A lift request together with the riders compatible with it."""

    request: LiftRequestResponse
    # The time range actually searched (wider than the window when flexible)
    search_window_start: str
    search_window_end: str
    matches: list[RideMatch]
