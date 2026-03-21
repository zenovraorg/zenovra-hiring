from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorDatabase

class CandidateRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "candidates")

    async def search(self, org_id: str, query: str, page: int = 1, page_size: int = 20):
        filter = {
            "org_id": org_id,
            "$text": {"$search": query},
            "is_deleted": {"$ne": True},
        }
        return await self.list(filter, page, page_size)

    async def find_by_email(self, org_id: str, email: str):
        return await self.collection.find_one({"org_id": org_id, "email": email, "is_deleted": {"$ne": True}})

class ApplicationRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "applications")

    async def get_by_job(self, org_id: str, job_id: str, stage_id: str = None):
        filter = {"org_id": org_id, "job_id": job_id}
        if stage_id:
            filter["stage_id"] = stage_id
        return await self.list(filter, page_size=100)

    async def get_by_candidate(self, org_id: str, candidate_id: str):
        filter = {"org_id": org_id, "candidate_id": candidate_id}
        return await self.list(filter, page_size=50)
