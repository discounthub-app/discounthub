from pydantic import BaseModel, ConfigDict
from typing import Optional


class DiscountBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    seller_id: int


class DiscountCreate(DiscountBase):
    pass


class DiscountOut(DiscountBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
