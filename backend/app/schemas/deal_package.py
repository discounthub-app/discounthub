from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# Базовые поля для чтения
class DealPackageBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    is_active: bool = True


# При создании
class DealPackageCreate(DealPackageBase):
    pass


# При обновлении — все поля опциональны
class DealPackageUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None


# Ответ наружу
class DealPackageOut(DealPackageBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2: позволяет собирать из ORM
