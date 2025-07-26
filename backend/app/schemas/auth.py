from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str  # будет использоваться в OAuth2PasswordRequestForm
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
