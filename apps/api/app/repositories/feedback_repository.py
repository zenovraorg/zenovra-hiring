from app.repositories.base import BaseRepository
from motor.motor_asyncio import AsyncIOMotorDatabase


class FeedbackRepository(BaseRepository):
    def __init__(self, db: AsyncIOMotorDatabase):
        super().__init__(db, "feedback")

    async def get_by_candidate(self, org_id: str, candidate_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "candidate_id": candidate_id}
        return await self.list(filter, page, page_size)

    async def get_by_job(self, org_id: str, job_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "job_id": job_id}
        return await self.list(filter, page, page_size)

    async def get_by_interview(self, org_id: str, interview_id: str, page: int = 1, page_size: int = 50):
        filter = {"org_id": org_id, "interview_id": interview_id}
        return await self.list(filter, page, page_size)
