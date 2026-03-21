from pydantic import BaseModel, Field
from typing import Optional

class JobCreate(BaseModel):
    title: str
    department_id: str
    location_id: str
    hiring_manager_id: str
    recruiter_id: Optional[str] = None
    employment_type: str = "full_time"
    experience_level: str = "mid"
    description: str = ""
    requirements: list[str] = Field(default_factory=list)
    nice_to_haves: list[str] = Field(default_factory=list)
    compensation: dict = Field(default_factory=dict)
    headcount: int = 1
    is_remote: bool = False

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department_id: Optional[str] = None
    location_id: Optional[str] = None
    hiring_manager_id: Optional[str] = None
    recruiter_id: Optional[str] = None
    status: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[list[str]] = None
    nice_to_haves: Optional[list[str]] = None
    compensation: Optional[dict] = None
    headcount: Optional[int] = None
    is_remote: Optional[bool] = None
    is_published: Optional[bool] = None

class JobFilter(BaseModel):
    status: Optional[str] = None
    department_id: Optional[str] = None
    location_id: Optional[str] = None
    employment_type: Optional[str] = None
    search: Optional[str] = None
