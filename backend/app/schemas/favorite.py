from pydantic import BaseModel, ConfigDict

# Только discount_id для создания избранного!
class FavoriteCreate(BaseModel):
    discount_id: int

class FavoriteOut(BaseModel):
    id: int
    discount_id: int
    # user_id: int — опционально, но фронту обычно не нужен
    model_config = ConfigDict(from_attributes=True)
