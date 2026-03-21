from pydantic import BaseModel, Field
from typing import Optional

class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
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

class CandidateUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    tags: Optional[list[str]] = None
    skills: Optional[list[str]] = None
    experience_years: Optional[int] = None
    current_company: Optional[str] = None
    current_title: Optional[str] = None

class ApplicationCreate(BaseModel):
    candidate_id: str
    job_id: str
    stage_id: str
    source: str = "direct"

class StageMove(BaseModel):
    stage_id: str
