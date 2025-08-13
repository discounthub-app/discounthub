import enum
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Enum as SAEnum
from app.db import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    expired = "expired"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_profile_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    discount_id     = Column(Integer, ForeignKey("discounts.id", ondelete="CASCADE"),     nullable=False, index=True)

    status   = Column(SAEnum(BookingStatus, name="booking_status"), nullable=False, default=BookingStatus.pending)
    quantity = Column(Integer, nullable=False, default=1)

    reserved_at = Column(DateTime, nullable=False, server_default=func.now())
    expires_at  = Column(DateTime, nullable=True)
