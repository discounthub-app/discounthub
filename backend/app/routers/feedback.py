from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackOut

router = APIRouter(prefix="/feedbacks", tags=["feedbacks"])


@router.post("/", response_model=FeedbackOut, status_code=201)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = Feedback(**feedback.model_dump())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback


@router.get("/", response_model=list[FeedbackOut])
def get_feedbacks(db: Session = Depends(get_db)):
    return db.query(Feedback).all()


@router.get("/{feedback_id}", response_model=FeedbackOut)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).get(feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback


@router.delete("/{feedback_id}", status_code=204)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).get(feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(feedback)
    db.commit()
