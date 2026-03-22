from app.repositories.feedback_repository import FeedbackRepository
from app.schemas.feedback import FeedbackCreate
from motor.motor_asyncio import AsyncIOMotorDatabase


class FeedbackService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = FeedbackRepository(db)
        self.db = db

    async def create_feedback(self, org_id: str, data: FeedbackCreate, created_by: str) -> dict:
        feedback_data = {
            "org_id": org_id,
            "created_by": created_by,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(feedback_data)

    async def list_feedback(self, org_id: str, candidate_id: str = None, job_id: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if candidate_id:
            filter["candidate_id"] = candidate_id
        if job_id:
            filter["job_id"] = job_id
        return await self.repo.list(filter, page, page_size)

    async def get_feedback(self, feedback_id: str) -> dict:
        return await self.repo.get_by_id(feedback_id)
