from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime


class NotificationRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "notifications")

    async def get_by_user(self, org_id: str, user_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "user_id": user_id}
        return await self.list(filter, page, page_size)

    async def mark_all_read(self, org_id: str, user_id: str) -> int:
        result = await self.collection.update_many(
            {"org_id": org_id, "user_id": user_id, "is_read": False},
            {"$set": {"is_read": True, "updated_at": datetime.utcnow().isoformat()}},
        )
        return result.modified_count
