from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.security import verify_firebase_token

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncIOMotorDatabase = Depends(get_database),
    token: dict = Depends(verify_firebase_token),
):
    org_id = "org1"

    open_jobs = await db.job_requisitions.count_documents({"org_id": org_id, "status": "open", "is_deleted": {"$ne": True}})
    active_candidates = await db.candidates.count_documents({"org_id": org_id, "is_deleted": {"$ne": True}})
    total_applications = await db.applications.count_documents({"org_id": org_id})
    pending_offers = await db.offers.count_documents({"org_id": org_id, "status": {"$in": ["pending_approval", "sent"]}})

    pipeline = []
    if open_jobs > 0:
        pipeline_agg = db.applications.aggregate([
            {"$match": {"org_id": org_id}},
            {"$group": {"_id": "$stage_id", "count": {"$sum": 1}}},
        ])
        async for doc in pipeline_agg:
            pipeline.append({"stage": doc["_id"], "count": doc["count"]})

    return {
        "open_jobs": open_jobs,
        "active_candidates": active_candidates,
        "total_applications": total_applications,
        "offers_pending": pending_offers,
        "interviews_this_week": 0,
        "time_to_hire_avg": 32,
        "acceptance_rate": 87,
        "pipeline_by_stage": pipeline,
        "hires_by_month": [],
        "source_breakdown": [],
        "department_metrics": [],
        "recent_activity": [],
    }
