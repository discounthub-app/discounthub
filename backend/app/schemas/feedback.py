from pydantic import BaseModel, ConfigDict
from typing import Optional


class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    user_id: int
    discount_id: int


class FeedbackOut(FeedbackBase):
    id: int
    user_id: int
    discount_id: int

    model_config = ConfigDict(from_attributes=True)
