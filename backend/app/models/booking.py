import enum
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.db.base import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    expired = "expired"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_profile_id = Column(Integer, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    discount_id = Column(Integer, ForeignKey("discounts.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(SAEnum(BookingStatus, name="booking_status"), nullable=False, server_default=BookingStatus.pending.value)

    quantity = Column(Integer, nullable=False, server_default="1")

    reserved_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    expires_at  = Column(DateTime(timezone=True), nullable=True)

    # relationships (по желанию, можно раскомментировать, если уже используете)
    # user_profile = relationship("UserProfile", back_populates="bookings")
    # discount = relationship("Discount", back_populates="bookings")
