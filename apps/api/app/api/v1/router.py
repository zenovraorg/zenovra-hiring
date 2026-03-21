from fastapi import APIRouter
from app.api.v1.routers import auth, dashboard, jobs, candidates, pipeline

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(jobs.router)
api_router.include_router(candidates.router)
api_router.include_router(pipeline.router)
