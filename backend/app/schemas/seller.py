from pydantic import BaseModel

class SellerBase(BaseModel):
    name: str
    url: str  # ✅ добавляем сюда

class SellerCreate(SellerBase):
    pass

class Seller(SellerBase):
    id: int

    class Config:
        orm_mode = True
