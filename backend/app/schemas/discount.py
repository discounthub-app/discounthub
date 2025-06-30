from pydantic import BaseModel

class DiscountBase(BaseModel):
    title: str
    description: str
    price: float
    original_price: float
    seller_id: int
    url: str
    image_url: str

class DiscountCreate(DiscountBase):
    pass

class DiscountOut(DiscountBase):
    id: int

    class Config:
        orm_mode = True
