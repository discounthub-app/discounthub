from pydantic import BaseModel, ConfigDict
from typing import Optional


class DiscountBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    old_price: Optional[float] = None
    seller_id: int
    product_id: int  # ✅ Добавлено


class DiscountCreate(DiscountBase):
    pass


class DiscountOut(DiscountBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
