from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorDatabase


class ReferralRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "referrals")

    async def get_by_referrer(self, org_id: str, referrer_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "referrer_id": referrer_id}
        return await self.list(filter, page, page_size)

    async def get_by_job(self, org_id: str, job_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "job_id": job_id}
        return await self.list(filter, page, page_size)
