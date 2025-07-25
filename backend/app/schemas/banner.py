from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional
from pydantic import ConfigDict

class BannerBase(BaseModel):
    title: str
    image_url: HttpUrl
    link: Optional[HttpUrl] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class BannerCreate(BannerBase):
    pass

class BannerOut(BannerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
