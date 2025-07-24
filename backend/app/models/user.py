from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship  # ✅ добавлено
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # ✅ Добавлена связь
    discounts = relationship("Discount", back_populates="seller")
