from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    # связи на будущее
    # discounts = relationship("Discount", back_populates="brand")
    products = relationship("Product", back_populates="brand")
