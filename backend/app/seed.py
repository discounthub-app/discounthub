from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.user import User

def seed():
    db: Session = SessionLocal()
    try:
        user = User(
            email="test@example.com",
            username="testuser",
            hashed_password="hashed_test"
        )
        db.add(user)
        db.commit()
        print("✅ Seed завершён: пользователь добавлен.")
    except Exception as e:
        db.rollback()
        print(f"❌ Ошибка при seed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
