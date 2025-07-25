from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    discounts = relationship("DiscountTag", back_populates="tag")
