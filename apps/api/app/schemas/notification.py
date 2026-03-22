from pydantic import BaseModel
from typing import Optional


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, success, warning, interview, offer, application
    link: str = ""


class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None
