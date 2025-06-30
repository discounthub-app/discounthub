from pydantic import BaseModel

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    discount_price: float
