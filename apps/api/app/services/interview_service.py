from app.repositories.interview_repository import InterviewRepository
from app.schemas.interview import InterviewCreate, InterviewUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase


class InterviewService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = InterviewRepository(db)
        self.db = db

    async def create_interview(self, org_id: str, data: InterviewCreate, created_by: str) -> dict:
        interview_data = {
            "org_id": org_id,
            "created_by": created_by,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(interview_data)

    async def update_interview(self, interview_id: str, data: InterviewUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        return await self.repo.update(interview_id, update_data)

    async def list_interviews(self, org_id: str, job_id: str = None, status: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if job_id:
            filter["job_id"] = job_id
        if status:
            filter["status"] = status
        return await self.repo.list(filter, page, page_size)

    async def get_interview(self, interview_id: str) -> dict:
        return await self.repo.get_by_id(interview_id)

    async def delete_interview(self, interview_id: str) -> bool:
        return await self.repo.soft_delete(interview_id)
