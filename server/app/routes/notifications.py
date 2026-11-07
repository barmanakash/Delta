"""
Notifications API: what the bell in the header shows.

  GET  /api/notifications        the latest notifications + how many are unread
  POST /api/notifications/read   mark some (or all) of them as read
"""

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends

from app.database import get_notifications_collection
from app.models.notification import MarkRead, NotificationOut, NotificationsResponse
from app.models.user import MessageResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get(
    "",
    response_model=NotificationsResponse,
    summary="The signed-in user's latest notifications",
)
async def list_notifications(current_user: dict = Depends(get_current_user)):
    col = get_notifications_collection()
    docs = (
        await col.find({"user_id": current_user["_id"]})
        .sort("created_at", -1)
        .to_list(length=30)
    )
    unread = await col.count_documents({"user_id": current_user["_id"], "read": False})
    return NotificationsResponse(
        notifications=[
            NotificationOut(
                id=str(d["_id"]),
                kind=d["kind"],
                title=d["title"],
                message=d["message"],
                link=d.get("link"),
                read=bool(d.get("read")),
                created_at=d["created_at"],
            )
            for d in docs
        ],
        unread_count=unread,
    )


@router.post(
    "/read",
    response_model=MessageResponse,
    summary="Mark notifications as read (all of them when no ids are given)",
)
async def mark_read(payload: MarkRead, current_user: dict = Depends(get_current_user)):
    query: dict = {"user_id": current_user["_id"], "read": False}
    if payload.ids is not None:
        query["_id"] = {"$in": [ObjectId(i) for i in payload.ids if ObjectId.is_valid(i)]}
    await get_notifications_collection().update_many(
        query, {"$set": {"read": True, "read_at": datetime.now(timezone.utc)}}
    )
    return MessageResponse(message="OK")
