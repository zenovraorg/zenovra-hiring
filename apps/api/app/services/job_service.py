from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
import re

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

class JobService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = JobRepository(db)
        self.db = db

    async def create_job(self, org_id: str, data: JobCreate, created_by: str) -> dict:
        slug = slugify(data.title)
        existing = await self.repo.get_by_slug(org_id, slug)
        if existing:
            slug = f"{slug}-{str(ObjectId())[:6]}"

        default_stages = [
            {"id": str(ObjectId()), "name": "Applied", "order": 0, "type": "sourced", "color": "#6366f1"},
            {"id": str(ObjectId()), "name": "Phone Screen", "order": 1, "type": "screening", "color": "#8b5cf6"},
            {"id": str(ObjectId()), "name": "Technical Interview", "order": 2, "type": "interview", "color": "#0ea5e9"},
            {"id": str(ObjectId()), "name": "Onsite", "order": 3, "type": "interview", "color": "#06b6d4"},
            {"id": str(ObjectId()), "name": "Offer", "order": 4, "type": "offer", "color": "#10b981"},
            {"id": str(ObjectId()), "name": "Hired", "order": 5, "type": "hired", "color": "#22c55e"},
        ]

        job_data = {
            "org_id": org_id,
            "slug": slug,
            "pipeline_stages": default_stages,
            "candidate_count": 0,
            "filled_count": 0,
            "is_published": False,
            "is_deleted": False,
            **data.model_dump(),
        }

        return await self.repo.create(job_data)

    async def update_job(self, job_id: str, data: JobUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        return await self.repo.update(job_id, update_data)

    async def list_jobs(self, org_id: str, status: str = None, department_id: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if status:
            filter["status"] = status
        if department_id:
            filter["department_id"] = department_id
        return await self.repo.list(filter, page, page_size)

    async def get_job(self, job_id: str) -> dict:
        return await self.repo.get_by_id(job_id)

    async def delete_job(self, job_id: str) -> bool:
        return await self.repo.soft_delete(job_id)
