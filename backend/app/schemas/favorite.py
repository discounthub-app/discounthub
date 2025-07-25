from pydantic import BaseModel, ConfigDict


class FavoriteBase(BaseModel):
    user_id: int
    discount_id: int


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteOut(FavoriteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
