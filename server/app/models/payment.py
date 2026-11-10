from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PaymentStatus(BaseModel):
    """Where the payment for one trip stands."""

    trip_id: str  # the lift request's id (a trip is an accepted lift request)
    status: str  # unpaid | pending | paid | failed | refunded
    amount: int  # rupees: the trip's fixed fuel-split
    currency: str = "INR"
    provider: str  # stripe
    paid_at: Optional[datetime] = None


class CheckoutResponse(BaseModel):
    """Where to send the lift taker to pay."""

    checkout_url: str
    provider: str


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
