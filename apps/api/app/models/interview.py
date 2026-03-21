from pydantic import BaseModel, Field
from typing import Optional
from app.models.base import MongoBaseModel

class InterviewParticipant(BaseModel):
    user_id: str
    role: str = "participant"
    feedback_submitted: bool = False

class Interview(MongoBaseModel):
    application_id: str
    org_id: str
    title: str
    type: str = "other"
    status: str = "scheduled"
    scheduled_at: str
    duration_minutes: int = 60
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    interviewers: list[InterviewParticipant] = Field(default_factory=list)
    notes: Optional[str] = None

class ScorecardCriteria(BaseModel):
    name: str
    rating: int
    notes: Optional[str] = None

class Scorecard(MongoBaseModel):
    interview_id: str
    interviewer_id: str
    overall_rating: int
    recommendation: str = "neutral"
    criteria: list[ScorecardCriteria] = Field(default_factory=list)
    summary: str = ""
    submitted_at: Optional[str] = None
