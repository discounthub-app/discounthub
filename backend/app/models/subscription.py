from sqlalchemy import Column, Integer, ForeignKey, Boolean, DateTime, Float, func
from app.db import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)

    user_profile_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    # Фильтры подписки (опционально)
    store_id    = Column(Integer, ForeignKey("stores.id", ondelete="SET NULL"),     nullable=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)

    # Гео-подписка (опционально)
    geofence_lat       = Column(Float, nullable=True)
    geofence_lon       = Column(Float, nullable=True)
    geofence_radius_km = Column(Float, nullable=True)  # например, 5.0 км

    is_active  = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
