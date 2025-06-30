from fastapi import APIRouter
from app.schemas.users import UserCreate, UserOut

router = APIRouter()

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate):
    return {"id": 1, "email": user.email}
