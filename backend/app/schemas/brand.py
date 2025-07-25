from pydantic import BaseModel, ConfigDict


class BrandBase(BaseModel):
    name: str


class BrandCreate(BrandBase):
    pass


class BrandOut(BrandBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
