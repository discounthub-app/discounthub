from pydantic import BaseModel, ConfigDict

class RegionBase(BaseModel):
    name: str

class RegionCreate(RegionBase):
    pass

class RegionOut(RegionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
