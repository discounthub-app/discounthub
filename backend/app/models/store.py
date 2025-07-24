from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # В будущем можно добавить связь: discounts = relationship("Discount", back_populates="store")
