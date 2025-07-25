from pydantic import BaseModel, ConfigDict
from typing import Optional


class StoreBase(BaseModel):
    name: str
    website: Optional[str] = None


class StoreCreate(StoreBase):
    pass


class StoreUpdate(StoreBase):
    pass


class StoreOut(StoreBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
