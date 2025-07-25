from pydantic import BaseModel, ConfigDict
from datetime import datetime


class NotificationBase(BaseModel):
    user_id: int
    message: str
    is_read: bool = False


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
