from pydantic import BaseModel, Field
from typing import Optional


class FeedbackCreate(BaseModel):
    candidate_id: str
    job_id: str
    interviewer_id: str = ""
    interview_id: str = ""
    overall_rating: int = 0  # 1-5
    recommendation: str = "no_decision"  # strong_yes, yes, no_decision, no, strong_no
    strengths: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)
    notes: str = ""


class FeedbackUpdate(BaseModel):
    overall_rating: Optional[int] = None
    recommendation: Optional[str] = None
    strengths: Optional[list[str]] = None
    concerns: Optional[list[str]] = None
    notes: Optional[str] = None
