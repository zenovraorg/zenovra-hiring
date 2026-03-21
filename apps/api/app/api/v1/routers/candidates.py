from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.candidate_service import CandidateService
from app.schemas.candidate import CandidateCreate, CandidateUpdate, ApplicationCreate, StageMove
import math

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.get("")
async def list_candidates(
    search: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    org_id = "org1"
    items, total = await service.list_candidates(org_id, search, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_candidate(
    data: CandidateCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    org_id = "org1"
    try:
        candidate = await service.create_candidate(org_id, data)
        return {"success": True, "data": candidate}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/{candidate_id}")
async def get_candidate(
    candidate_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    candidate = await service.get_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.patch("/{candidate_id}")
async def update_candidate(
    candidate_id: str,
    data: CandidateUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    candidate = await service.update_candidate(candidate_id, data)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"success": True, "data": candidate}

@router.post("/applications")
async def create_application(
    data: ApplicationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    org_id = "org1"
    app = await service.create_application(org_id, data)
    return {"success": True, "data": app}

@router.patch("/applications/{application_id}/move")
async def move_application(
    application_id: str,
    data: StageMove,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = CandidateService(db)
    app = await service.move_application_stage(application_id, data.stage_id)
    return {"success": True, "data": app}
