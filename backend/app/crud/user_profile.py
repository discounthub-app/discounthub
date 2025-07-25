from sqlalchemy.orm import Session
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate


def create_user_profile(db: Session, profile: UserProfileCreate):
    db_profile = UserProfile(**profile.model_dump())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def get_user_profile(db: Session, user_id: int):
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def update_user_profile(db: Session, user_id: int, updates: UserProfileUpdate):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not db_profile:
        return None
    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile


def delete_user_profile(db: Session, user_id: int):
    db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if db_profile:
        db.delete(db_profile)
        db.commit()
    return db_profile
