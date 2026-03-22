from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.feedback_service import FeedbackService
from app.schemas.feedback import FeedbackCreate
import math

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.get("")
async def list_feedback(
    candidate_id: str = None,
    job_id: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = FeedbackService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    items, total = await service.list_feedback(org_id, candidate_id, job_id, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_feedback(
    data: FeedbackCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = FeedbackService(db)
    org_id = "org1"
    feedback = await service.create_feedback(org_id, data, token.get("uid", ""))
    return {"success": True, "data": feedback}

@router.get("/{feedback_id}")
async def get_feedback(
    feedback_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = FeedbackService(db)
    feedback = await service.get_feedback(feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback
