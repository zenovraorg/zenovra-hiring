from pydantic import Field
from typing import Optional
from app.models.base import MongoBaseModel

class Candidate(MongoBaseModel):
    org_id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    source: str = "direct"
    source_detail: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    experience_years: Optional[int] = None
    current_company: Optional[str] = None
    current_title: Optional[str] = None
    resume_url: Optional[str] = None
    owner_id: Optional[str] = None
    is_deleted: bool = False

class Application(MongoBaseModel):
    candidate_id: str
    job_id: str
    org_id: str
    stage_id: str
    status: str = "new"
    applied_at: Optional[str] = None
    moved_at: Optional[str] = None
    rejected_reason: Optional[str] = None
    source: str = "direct"
