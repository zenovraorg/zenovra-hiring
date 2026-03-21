from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MongoBaseModel(BaseModel):
    id: str = Field(default="", alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
