from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    user_id: int


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfileOut(UserProfileBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
