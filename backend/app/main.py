from fastapi import FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import text  # 👈 импортим text
from app.db import SessionLocal

app = FastAPI()

@app.get("/ping")
def ping():
    return {"message": "pong"}

@app.get("/users")
def get_users():
    db: Session = SessionLocal()
    users = db.execute(text("SELECT id, username, email FROM users")).mappings().all()
    return users
