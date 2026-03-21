from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.candidate_service import CandidateService

router = APIRouter(prefix="/pipeline", tags=["pipeline"])

@router.get("/{job_id}")
async def get_pipeline(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    org_id = "org1"
    applications = await service.get_pipeline(org_id, job_id)
    return {"items": applications}
