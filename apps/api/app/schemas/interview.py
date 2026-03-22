from pydantic import BaseModel, Field
from typing import Optional


class InterviewCreate(BaseModel):
    title: str
    candidate_id: str = ""
    job_id: str = ""
    interview_type: str = "technical"  # technical, behavioral, phone_screen, onsite, culture_fit
    scheduled_at: str = ""  # ISO datetime string
    duration_minutes: int = 60
    interviewer_ids: list[str] = Field(default_factory=list)
    location: str = ""
    notes: str = ""
    status: str = "scheduled"  # scheduled, completed, cancelled, no_show


class InterviewUpdate(BaseModel):
    title: Optional[str] = None
    candidate_id: Optional[str] = None
    job_id: Optional[str] = None
    interview_type: Optional[str] = None
    scheduled_at: Optional[str] = None
    duration_minutes: Optional[int] = None
    interviewer_ids: Optional[list[str]] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
