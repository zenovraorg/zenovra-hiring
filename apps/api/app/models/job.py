from pydantic import BaseModel, Field
from typing import Optional
from app.models.base import MongoBaseModel

class PipelineStage(BaseModel):
    id: str
    name: str
    order: int
    type: str = "custom"
    color: str = "#6366f1"

class Compensation(BaseModel):
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    currency: str = "USD"
    equity: Optional[str] = None
    bonus: Optional[str] = None

class JobRequisition(MongoBaseModel):
    org_id: str
    title: str
    slug: str
    department_id: str
    location_id: str
    hiring_manager_id: str
    recruiter_id: Optional[str] = None
    status: str = "draft"
    employment_type: str = "full_time"
    experience_level: str = "mid"
    description: str = ""
    requirements: list[str] = Field(default_factory=list)
    nice_to_haves: list[str] = Field(default_factory=list)
    compensation: Compensation = Field(default_factory=Compensation)
    pipeline_stages: list[PipelineStage] = Field(default_factory=list)
    headcount: int = 1
    filled_count: int = 0
    candidate_count: int = 0
    is_remote: bool = False
    is_published: bool = False
    published_at: Optional[str] = None
    closes_at: Optional[str] = None
    is_deleted: bool = False
