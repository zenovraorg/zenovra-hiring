from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorDatabase

class JobRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "job_requisitions")

    async def search(self, org_id: str, query: str, page: int = 1, page_size: int = 20):
        filter = {
            "org_id": org_id,
            "$text": {"$search": query},
            "is_deleted": {"$ne": True},
        }
        return await self.list(filter, page, page_size)

    async def get_by_slug(self, org_id: str, slug: str):
        return await self.collection.find_one({"org_id": org_id, "slug": slug, "is_deleted": {"$ne": True}})

    async def get_published(self, org_id: str, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id, "is_published": True, "status": "open", "is_deleted": {"$ne": True}}
        return await self.list(filter, page, page_size)
