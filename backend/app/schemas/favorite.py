from pydantic import BaseModel, ConfigDict

class FavoriteCreate(BaseModel):
    discount_id: int

class FavoriteOut(BaseModel):
    id: int
    discount_id: int
    model_config = ConfigDict(from_attributes=True)
