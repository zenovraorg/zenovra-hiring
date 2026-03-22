from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationCreate
import math

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("")
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = NotificationService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    user_id = token.get("uid", "")
    items, total = await service.list_notifications(org_id, user_id, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_notification(
    data: NotificationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = NotificationService(db)
    org_id = "org1"
    user_id = token.get("uid", "")
    notification = await service.create_notification(org_id, user_id, data)
    return {"success": True, "data": notification}

@router.patch("/read-all")
async def mark_all_notifications_read(
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = NotificationService(db)
    org_id = "org1"
    user_id = token.get("uid", "")
    count = await service.mark_all_read(org_id, user_id)
    return {"success": True, "updated_count": count}

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = NotificationService(db)
    notification = await service.mark_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True, "data": notification}
