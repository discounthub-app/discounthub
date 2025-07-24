from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # ✅ Связь с таблицей user_profiles
    profile = relationship("UserProfile", back_populates="user", uselist=False)
