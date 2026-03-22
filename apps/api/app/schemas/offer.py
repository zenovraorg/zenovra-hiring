from pydantic import BaseModel, Field
from typing import Optional


class OfferCreate(BaseModel):
    candidate_id: str
    job_id: str
    base_salary: float = 0
    bonus: float = 0
    equity: str = ""
    start_date: str = ""
    expiry_date: str = ""
    benefits: list[str] = Field(default_factory=list)
    notes: str = ""
    status: str = "draft"  # draft, pending_approval, approved, sent, accepted, declined, expired


class OfferUpdate(BaseModel):
    candidate_id: Optional[str] = None
    job_id: Optional[str] = None
    base_salary: Optional[float] = None
    bonus: Optional[float] = None
    equity: Optional[str] = None
    start_date: Optional[str] = None
    expiry_date: Optional[str] = None
    benefits: Optional[list[str]] = None
    notes: Optional[str] = None
    status: Optional[str] = None
