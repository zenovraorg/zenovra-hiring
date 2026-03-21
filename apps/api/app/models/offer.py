from pydantic import BaseModel, Field
from typing import Optional
from app.models.base import MongoBaseModel

class OfferApproval(BaseModel):
    approver_id: str
    status: str = "pending"
    comment: Optional[str] = None
    decided_at: Optional[str] = None

class Offer(MongoBaseModel):
    application_id: str
    org_id: str
    status: str = "draft"
    title: str
    department: str
    start_date: str
    base_salary: int
    currency: str = "USD"
    bonus: Optional[int] = None
    equity: Optional[str] = None
    benefits: list[str] = Field(default_factory=list)
    notes: Optional[str] = None
    approvals: list[OfferApproval] = Field(default_factory=list)
    version: int = 1
    expires_at: Optional[str] = None
