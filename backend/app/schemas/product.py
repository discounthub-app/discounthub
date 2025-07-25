from pydantic import BaseModel, ConfigDict
from typing import Optional


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    store_id: int
    category_id: int
    brand_id: int


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
