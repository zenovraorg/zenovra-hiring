from pydantic import BaseModel
from typing import Optional


class ReferralCreate(BaseModel):
    candidate_name: str
    candidate_email: str
    job_id: str = ""
    referrer_id: str = ""
    relationship: str = ""
    notes: str = ""
    status: str = "submitted"  # submitted, reviewing, interviewed, hired, rejected


class ReferralUpdate(BaseModel):
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    job_id: Optional[str] = None
    referrer_id: Optional[str] = None
    relationship: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
