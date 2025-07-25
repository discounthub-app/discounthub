from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.notification import NotificationCreate, NotificationOut
from app.crud import notification as crud

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

@router.post("/", response_model=NotificationOut, status_code=201)
def create_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    return crud.create_notification(db, notification)

@router.get("/user/{user_id}", response_model=list[NotificationOut])
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    return crud.get_notifications(db, user_id)

@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_as_read(notification_id: int, db: Session = Depends(get_db)):
    notification = crud.mark_notification_as_read(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification
