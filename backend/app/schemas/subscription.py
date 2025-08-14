from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class SubscriptionBase(BaseModel):
    user_profile_id: int = Field(..., ge=1)
    store_id: Optional[int] = Field(None, ge=1)
    category_id: Optional[int] = Field(None, ge=1)

    geofence_lat: Optional[float] = Field(None, ge=-90, le=90)
    geofence_lon: Optional[float] = Field(None, ge=-180, le=180)
    geofence_radius_km: Optional[float] = Field(None, ge=0)

    is_active: bool = True


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    store_id: Optional[int] = Field(None, ge=1)
    category_id: Optional[int] = Field(None, ge=1)
    geofence_lat: Optional[float] = Field(None, ge=-90, le=90)
    geofence_lon: Optional[float] = Field(None, ge=-180, le=180)
    geofence_radius_km: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None


class SubscriptionOut(SubscriptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
