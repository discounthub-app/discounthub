from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate


def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(**notification.model_dump())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_notifications(db: Session, user_id: int):
    return db.query(Notification).filter(Notification.user_id == user_id).all()


def mark_notification_as_read(db: Session, notification_id: int):
    notification = db.query(Notification).get(notification_id)
    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)
    return notification
