from fastapi import APIRouter
from app.api.v1.routers import (
    auth,
    dashboard,
    jobs,
    candidates,
    pipeline,
    interviews,
    offers,
    notifications,
    feedback,
    referrals,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(jobs.router)
api_router.include_router(candidates.router)
api_router.include_router(pipeline.router)
api_router.include_router(interviews.router)
api_router.include_router(offers.router)
api_router.include_router(notifications.router)
api_router.include_router(feedback.router)
api_router.include_router(referrals.router)
