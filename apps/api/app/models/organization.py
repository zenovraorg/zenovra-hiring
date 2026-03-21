from pydantic import BaseModel, Field
from typing import Optional
from app.models.base import MongoBaseModel

class BrandingSettings(BaseModel):
    primary_color: str = "#6366f1"
    logo_url: Optional[str] = None
    careers_page_title: Optional[str] = None

class HiringSettings(BaseModel):
    default_pipeline_id: Optional[str] = None
    require_job_approval: bool = True
    require_offer_approval: bool = True

class OrgSettings(BaseModel):
    branding: BrandingSettings = Field(default_factory=BrandingSettings)
    hiring: HiringSettings = Field(default_factory=HiringSettings)

class Organization(MongoBaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None
    domain: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    settings: OrgSettings = Field(default_factory=OrgSettings)
