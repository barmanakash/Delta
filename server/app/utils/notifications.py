"""
In-app notifications (the bell in every header).

Each notification belongs to one person and links to the screen where they can
act on it. Saving one must never break the action that caused it (sending a
request, accepting, paying...), so a failure is only logged.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

from app.database import get_notifications_collection

logger = logging.getLogger("uvicorn.error")


def clock12(hhmm: str) -> str:
    """Turns 13:05 into 1:05 PM, for messages people read."""
    try:
        return datetime.strptime(hhmm, "%H:%M").strftime("%I:%M %p").lstrip("0")
    except (TypeError, ValueError):
        return hhmm or ""


async def notify(
    user_id,
    kind: str,
    title: str,
    message: str,
    link: Optional[str] = None,
) -> None:
    try:
        await get_notifications_collection().insert_one(
            {
                "user_id": user_id,
                "kind": kind,
                "title": title,
                "message": message,
                "link": link,
                "read": False,
                "created_at": datetime.now(timezone.utc),
            }
        )
    except Exception:
        logger.exception("Couldn't save a notification (%s)", kind)
