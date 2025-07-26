from fastapi import APIRouter, HTTPException
from passlib.hash import bcrypt

from app.schemas.auth import UserRegister

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserRegister):
    # Здесь будет регистрация в БД — пока просто заглушка
    hashed_password = bcrypt.hash(user.password)
    return {
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password
    }
