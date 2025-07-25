from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # связи на будущее
    # stores = relationship("Store", back_populates="city")
    # users = relationship("UserProfile", back_populates="city")
