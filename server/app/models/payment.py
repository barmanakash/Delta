from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class PaymentStatus(BaseModel):
    """Where the payment for one trip stands."""

    trip_id: str  # the lift request's id (a trip is an accepted lift request)
    status: str  # unpaid | pending | paid | failed | refunded
    amount: int  # rupees: the trip's fixed fuel-split
    currency: str = "INR"
    provider: str  # sandbox | stripe
    paid_at: Optional[datetime] = None


class CheckoutResponse(BaseModel):
    """Where to send the lift taker to pay."""

    checkout_url: str
    provider: str


class SandboxSession(BaseModel):
    """What the built-in test checkout page shows."""

    session_id: str
    trip_id: str
    status: str
    amount: int
    currency: str = "INR"
    pickup: str
    destination: str
    rider_name: str
    travel_date: str
    pickup_time: str


class SandboxOutcome(BaseModel):
    """Which result the test checkout should simulate."""

    outcome: Literal["success", "failed"]


class ReceivedPayment(BaseModel):
    """A trip payment a rider has received and hasn't been told about yet."""

    trip_id: str
    amount: int  # rupees
    currency: str = "INR"
    from_name: str  # the lift taker's first name
    pickup: str
    destination: str
    paid_at: Optional[datetime] = None


class ReceivedPayments(BaseModel):
    payments: list[ReceivedPayment]


class SeenPayments(BaseModel):
    """Trips whose "payment received" notice the rider has now seen."""

    trip_ids: list[str]
