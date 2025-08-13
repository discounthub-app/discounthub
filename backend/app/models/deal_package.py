from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, func
from app.db import Base


class DealPackage(Base):
    __tablename__ = "deal_packages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False, default=0.0)  # рубли
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
