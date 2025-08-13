from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, DateTime, func
from sqlalchemy.orm import relationship
# ⚠️ ВАЖНО: импорт Base должен совпадать с тем, как он сделан в других моделях проекта
# Пример: from app.db.base import Base
from app.db.base import Base


class DealPackage(Base):
    __tablename__ = "deal_packages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False, default=0)  # в рублях
    is_active = Column(Boolean, nullable=False, server_default="true")

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
