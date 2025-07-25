from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class FeedbackBase(BaseModel):
    user_id: int
    discount_id: int
    text: str
    rating: int


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackOut(FeedbackBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
