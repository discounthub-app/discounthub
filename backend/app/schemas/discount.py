from typing import Optional
from pydantic import BaseModel, Field


class DiscountBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    old_price: Optional[float] = None

    seller_id: Optional[int] = Field(None, ge=1)
    product_id: Optional[int] = Field(None, ge=1)

    # Новые геополя
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)


class DiscountCreate(DiscountBase):
    pass


class DiscountUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    seller_id: Optional[int] = Field(None, ge=1)
    product_id: Optional[int] = Field(None, ge=1)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)


class DiscountOut(DiscountBase):
    id: int

    class Config:
        from_attributes = True
