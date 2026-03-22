from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/apply", tags=["public-apply"])


class PublicApplicationCreate(BaseModel):
    job_id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    cover_letter: Optional[str] = None
    source: str = "careers_page"


@router.post("")
async def public_apply(
    data: PublicApplicationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Public endpoint — no auth required. Creates candidate + application."""
    org_id = "org1"

    # Check job exists
    job = await db.job_requisitions.find_one({"_id": data.job_id})
    if not job:
        # Try ObjectId
        try:
            job = await db.job_requisitions.find_one({"_id": ObjectId(data.job_id)})
        except Exception:
            pass
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Find or create candidate by email
    existing = await db.candidates.find_one({"email": data.email, "org_id": org_id})
    if existing:
        candidate_id = str(existing["_id"])
    else:
        candidate = {
            "_id": str(ObjectId()),
            "org_id": org_id,
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
            "phone": data.phone,
            "linkedin_url": data.linkedin_url,
            "portfolio_url": data.portfolio_url,
            "headline": "",
            "location": "",
            "source": data.source,
            "tags": [],
            "skills": [],
            "is_deleted": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.candidates.insert_one(candidate)
        candidate_id = candidate["_id"]

    # Check if already applied to this job
    existing_app = await db.applications.find_one({
        "candidate_id": candidate_id,
        "job_id": data.job_id,
    })
    if existing_app:
        return {"success": True, "message": "Already applied", "data": {"application_id": str(existing_app["_id"])}}

    # Get first pipeline stage
    stages = job.get("pipeline_stages", [])
    first_stage_id = stages[0]["id"] if stages else "applied"

    # Create application
    application = {
        "_id": str(ObjectId()),
        "org_id": org_id,
        "candidate_id": candidate_id,
        "job_id": data.job_id,
        "stage_id": first_stage_id,
        "status": "active",
        "source": data.source,
        "cover_letter": data.cover_letter,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.applications.insert_one(application)

    # Increment candidate count on job
    job_filter = {"_id": data.job_id}
    try:
        job_filter_oid = {"_id": ObjectId(data.job_id)}
        await db.job_requisitions.update_one(job_filter_oid, {"$inc": {"candidate_count": 1}})
    except Exception:
        await db.job_requisitions.update_one(job_filter, {"$inc": {"candidate_count": 1}})

    return {"success": True, "data": {"application_id": application["_id"], "candidate_id": candidate_id}}


@router.get("/my-applications")
async def get_my_applications(
    email: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Get applications for a candidate by email — for the candidate portal."""
    org_id = "org1"
    candidate = await db.candidates.find_one({"email": email, "org_id": org_id})
    if not candidate:
        return {"items": []}

    candidate_id = str(candidate["_id"])
    cursor = db.applications.find({"candidate_id": candidate_id, "is_deleted": False}).sort("created_at", -1)
    applications = await cursor.to_list(50)

    # Enrich with job data
    result = []
    for app in applications:
        job = await db.job_requisitions.find_one({"_id": app["job_id"]})
        if not job:
            try:
                job = await db.job_requisitions.find_one({"_id": ObjectId(app["job_id"])})
            except Exception:
                pass

        result.append({
            **app,
            "job_title": job.get("title", "Unknown") if job else "Unknown",
            "department": job.get("department_id", "") if job else "",
            "location": job.get("location_id", "") if job else "",
            "is_remote": job.get("is_remote", False) if job else False,
            "stages": [s["name"] for s in job.get("pipeline_stages", [])] if job else [],
            "current_stage_index": next(
                (i for i, s in enumerate(job.get("pipeline_stages", [])) if s["id"] == app.get("stage_id")),
                0
            ) if job else 0,
        })

    return {"items": result}
