from sqlalchemy import Column, Integer, ForeignKey
from app.db import Base

class CityRegion(Base):
    __tablename__ = "city_region"

    id = Column(Integer, primary_key=True, index=True)
    city_id = Column(Integer, ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"), nullable=False)
