from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: str
    kind: str  # request_received | request_accepted | trip_cancelled | payment_received
    title: str
    message: str
    link: Optional[str] = None  # the screen where the person can act on it
    read: bool
    created_at: datetime


class NotificationsResponse(BaseModel):
    notifications: list[NotificationOut]
    unread_count: int


class MarkRead(BaseModel):
    """Which notifications were seen. Leave `ids` out to mark them all."""

    ids: Optional[list[str]] = None
