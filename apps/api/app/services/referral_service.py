from app.repositories.referral_repository import ReferralRepository
from app.schemas.referral import ReferralCreate
from motor.motor_asyncio import AsyncIOMotorDatabase


class ReferralService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = ReferralRepository(db)
        self.db = db

    async def create_referral(self, org_id: str, data: ReferralCreate, created_by: str) -> dict:
        referral_data = {
            "org_id": org_id,
            "created_by": created_by,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(referral_data)

    async def list_referrals(self, org_id: str, status: str = None, job_id: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if status:
            filter["status"] = status
        if job_id:
            filter["job_id"] = job_id
        return await self.repo.list(filter, page, page_size)

    async def get_referral(self, referral_id: str) -> dict:
        return await self.repo.get_by_id(referral_id)
