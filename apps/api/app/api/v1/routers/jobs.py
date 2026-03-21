from fastapi import APIRouter, Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token
from app.services.job_service import JobService
from app.schemas.job import JobCreate, JobUpdate
import math

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("")
async def list_jobs(
    status: str = None,
    department_id: str = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = JobService(db)
    org_id = "org1"  # TODO: resolve from token/membership
    items, total = await service.list_jobs(org_id, status, department_id, page, page_size)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total > 0 else 0,
    }

@router.post("")
async def create_job(
    data: JobCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = JobService(db)
    org_id = "org1"
    job = await service.create_job(org_id, data, token.get("uid", ""))
    return {"success": True, "data": job}

@router.get("/{job_id}")
async def get_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = JobService(db)
    job = await service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.patch("/{job_id}")
async def update_job(
    job_id: str,
    data: JobUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = JobService(db)
    job = await service.update_job(job_id, data)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True, "data": job}

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    service = JobService(db)
    deleted = await service.delete_job(job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True}
