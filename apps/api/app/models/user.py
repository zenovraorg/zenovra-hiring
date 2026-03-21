from pydantic import Field
from typing import Optional
from app.models.base import MongoBaseModel

class User(MongoBaseModel):
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    firebase_uid: str
    is_active: bool = True

class Membership(MongoBaseModel):
    user_id: str
    org_id: str
    role: str = "recruiter"  # super_admin, org_admin, recruiter, hiring_manager, interviewer, finance_approver, executive_viewer
    department_id: Optional[str] = None
    is_active: bool = True
    joined_at: Optional[str] = None
