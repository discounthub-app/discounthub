from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field


BookingStatus = Literal["pending", "confirmed", "canceled", "expired"]


class BookingBase(BaseModel):
    user_profile_id: int = Field(..., ge=1)
    discount_id: int = Field(..., ge=1)
    status: BookingStatus = "pending"
    quantity: int = Field(1, ge=1)
    expires_at: Optional[datetime] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    quantity: Optional[int] = Field(None, ge=1)
    expires_at: Optional[datetime] = None


class BookingOut(BookingBase):
    id: int
    reserved_at: datetime

    class Config:
        from_attributes = True
