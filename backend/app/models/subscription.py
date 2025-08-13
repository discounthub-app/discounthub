from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, Numeric, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    user_profile_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    # Фильтры подписок — опционально привязка к магазину/категории
    store_id    = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"), nullable=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)

    # Гео-подписка (опционально)
    geofence_lat = Column(Numeric(8, 6), nullable=True)
    geofence_lon = Column(Numeric(9, 6), nullable=True)
    geofence_radius_km = Column(Numeric(5, 2), nullable=True)  # например, 5.00 км

    is_active  = Column(Boolean, nullable=False, server_default="true")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
