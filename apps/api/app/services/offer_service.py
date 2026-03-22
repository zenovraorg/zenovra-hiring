from app.repositories.offer_repository import OfferRepository
from app.schemas.offer import OfferCreate, OfferUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase


class OfferService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.repo = OfferRepository(db)
        self.db = db

    async def create_offer(self, org_id: str, data: OfferCreate, created_by: str) -> dict:
        offer_data = {
            "org_id": org_id,
            "created_by": created_by,
            "is_deleted": False,
            **data.model_dump(),
        }
        return await self.repo.create(offer_data)

    async def update_offer(self, offer_id: str, data: OfferUpdate) -> dict:
        update_data = data.model_dump(exclude_unset=True)
        return await self.repo.update(offer_id, update_data)

    async def list_offers(self, org_id: str, status: str = None, candidate_id: str = None, page: int = 1, page_size: int = 20):
        filter = {"org_id": org_id}
        if status:
            filter["status"] = status
        if candidate_id:
            filter["candidate_id"] = candidate_id
        return await self.repo.list(filter, page, page_size)

    async def get_offer(self, offer_id: str) -> dict:
        return await self.repo.get_by_id(offer_id)

    async def delete_offer(self, offer_id: str) -> bool:
        return await self.repo.soft_delete(offer_id)
