from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.offer_service import OfferService
from app.schemas.offer import OfferCreate, OfferUpdate
import math

router = APIRouter(prefix="/offers", tags=["offers"])

@router.get("")
async def list_offers(
    status: str = None,
    candidate_id: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = OfferService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    items, total = await service.list_offers(org_id, status, candidate_id, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_offer(
    data: OfferCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = OfferService(db)
    org_id = "org1"
    offer = await service.create_offer(org_id, data, token.get("uid", ""))
    return {"success": True, "data": offer}

@router.get("/{offer_id}")
async def get_offer(
    offer_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = OfferService(db)
    offer = await service.get_offer(offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.patch("/{offer_id}")
async def update_offer(
    offer_id: str,
    data: OfferUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = OfferService(db)
    offer = await service.update_offer(offer_id, data)
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"success": True, "data": offer}

@router.delete("/{offer_id}")
async def delete_offer(
    offer_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = OfferService(db)
    deleted = await service.delete_offer(offer_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"success": True}
