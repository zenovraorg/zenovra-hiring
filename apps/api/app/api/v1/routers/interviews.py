from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.interview_service import InterviewService
from app.schemas.interview import InterviewCreate, InterviewUpdate
import math

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.get("")
async def list_interviews(
    job_id: str = None,
    status: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = InterviewService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    items, total = await service.list_interviews(org_id, job_id, status, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_interview(
    data: InterviewCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = InterviewService(db)
    org_id = "org1"
    interview = await service.create_interview(org_id, data, token.get("uid", ""))
    return {"success": True, "data": interview}

@router.get("/{interview_id}")
async def get_interview(
    interview_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = InterviewService(db)
    interview = await service.get_interview(interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.patch("/{interview_id}")
async def update_interview(
    interview_id: str,
    data: InterviewUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = InterviewService(db)
    interview = await service.update_interview(interview_id, data)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"success": True, "data": interview}

@router.delete("/{interview_id}")
async def delete_interview(
    interview_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = InterviewService(db)
    deleted = await service.delete_interview(interview_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interview not found")
    return {"success": True}
