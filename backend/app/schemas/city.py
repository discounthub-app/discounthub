from pydantic import BaseModel, ConfigDict

class CityBase(BaseModel):
    name: str
    region_id: int

class CityCreate(CityBase):
    pass

class CityOut(CityBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
