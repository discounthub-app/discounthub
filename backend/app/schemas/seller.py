from pydantic import BaseModel


class SellerBase(BaseModel):
    name: str


class SellerCreate(SellerBase):
    pass


class SellerOut(SellerBase):
    id: int

    class Config:
        orm_mode = True
