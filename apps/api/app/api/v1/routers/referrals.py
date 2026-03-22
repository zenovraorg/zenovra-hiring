from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.referral_service import ReferralService
from app.schemas.referral import ReferralCreate
import math

router = APIRouter(prefix="/referrals", tags=["referrals"])

@router.get("")
async def list_referrals(
    status: str = None,
    job_id: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = ReferralService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    items, total = await service.list_referrals(org_id, status, job_id, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_referral(
    data: ReferralCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = ReferralService(db)
    org_id = "org1"
    referral = await service.create_referral(org_id, data, token.get("uid", ""))
    return {"success": True, "data": referral}

@router.get("/{referral_id}")
async def get_referral(
    referral_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = ReferralService(db)
    referral = await service.get_referral(referral_id)
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")
    return referral
