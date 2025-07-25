from pydantic import BaseModel, ConfigDict

class CityRegionBase(BaseModel):
    city_id: int
    region_id: int

class CityRegionCreate(CityRegionBase):
    pass

class CityRegionOut(CityRegionBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
