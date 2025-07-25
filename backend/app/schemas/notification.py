from pydantic import BaseModel, ConfigDict


class NotificationBase(BaseModel):
    user_id: int
    message: str


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
