from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate
from motor.motor_asyncio import AsyncIOMotorDatabase


class NotificationService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = NotificationRepository(db)
        self.db = db

    async def create_notification(self, org_id: str, user_id: str, data: NotificationCreate) -> dict:
        notification_data = {
            "org_id": org_id,
            "user_id": user_id,
            "is_read": False,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(notification_data)

    async def list_notifications(self, org_id: str, user_id: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if user_id:
            filter["user_id"] = user_id
        return await self.repo.list(filter, page, page_size)

    async def mark_read(self, notification_id: str) -> dict:
        return await self.repo.update(notification_id, {"is_read": True})

    async def mark_all_read(self, org_id: str, user_id: str) -> int:
        return await self.repo.mark_all_read(org_id, user_id)
