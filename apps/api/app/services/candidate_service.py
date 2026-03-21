from app.repositories.candidate_repository import CandidateRepository, ApplicationRepository
from app.schemas.candidate import CandidateCreate, CandidateUpdate, ApplicationCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

class CandidateService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = CandidateRepository(db)
        self.app_repo = ApplicationRepository(db)
        self.db = db

    async def create_candidate(self, org_id: str, data: CandidateCreate) -> dict:
        existing = await self.repo.find_by_email(org_id, data.email)
        if existing:
            raise ValueError(f"Candidate with email {data.email} already exists")

        candidate_data = {
            "org_id": org_id,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(candidate_data)

    async def update_candidate(self, candidate_id: str, data: CandidateUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        return await self.repo.update(candidate_id, update_data)

    async def list_candidates(self, org_id: str, search: str = None, page: int = 1, page_size: int = 20):
        if search:
            return await self.repo.search(org_id, search, page, page_size)
        filter = {"org_id": org_id}
        return await self.repo.list(filter, page, page_size)

    async def get_candidate(self, candidate_id: str) -> dict:
        return await self.repo.get_by_id(candidate_id)

    async def create_application(self, org_id: str, data: ApplicationCreate) -> dict:
        app_data = {
            "org_id": org_id,
            "status": "new",
            "applied_at": datetime.utcnow().isoformat(),
            "moved_at": datetime.utcnow().isoformat(),
            **data.model_dump(),
        }
        app = await self.app_repo.create(app_data)
        # Increment candidate count on the job
        await self.db.job_requisitions.update_one(
            {"_id": data.job_id},
            {"$inc": {"candidate_count": 1}},
        )
        return app

    async def move_application_stage(self, application_id: str, stage_id: str) -> dict:
        return await self.app_repo.update(application_id, {
            "stage_id": stage_id,
            "moved_at": datetime.utcnow().isoformat(),
        })

    async def get_pipeline(self, org_id: str, job_id: str):
        items, total = await self.app_repo.get_by_job(org_id, job_id)
        return items
