from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.schemas.auth import UserRegister
from app.schemas.user import UserOut
from app.models.user import User
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.dependencies.auth import get_current_user
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


# 🔐 Регистрация нового пользователя
@router.post("/register", response_model=UserOut)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    hashed_pwd = hash_password(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pwd,  # ✅ правильное имя поля
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# 🔐 Авторизация и выдача JWT
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == form_data.username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Пользователь не найден")

        if not verify_password(form_data.password, user.hashed_password):  # ✅ исправлено
            raise HTTPException(status_code=401, detail="Неверный пароль")

        access_token = create_access_token(data={"sub": str(user.id)})
        return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})

    except Exception as e:
        import traceback
        traceback.print_exc()  # для логов в контейнер
        raise HTTPException(status_code=500, detail="Internal server error")


# 🔐 Получение информации о текущем пользователе
@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
