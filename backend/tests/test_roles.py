import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db import SessionLocal
from app.models.user import User
from app.services.auth import hash_password

client = TestClient(app)


@pytest.fixture(scope="module")
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _unique_email(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"


@pytest.fixture(scope="module")
def normal_user(db):
    email = _unique_email("normal_user")
    user = User(
        username=f"normal_user_{uuid.uuid4().hex[:4]}",
        email=email,
        hashed_password=hash_password("user1234"),
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="module")
def admin_user(db):
    email = _unique_email("admin_user")
    user = User(
        username=f"admin_user_{uuid.uuid4().hex[:4]}",
        email=email,
        hashed_password=hash_password("admin1234"),
        is_admin=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_token(email, password):
    res = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


def test_normal_user_cannot_create_category(normal_user):
    token = get_token(normal_user.email, "user1234")
    res = client.post(
        "/categories/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "User Category"},
    )
    assert res.status_code == 403
    assert res.json()["detail"] == "Admin access required"


def test_admin_can_create_category(admin_user):
    token = get_token(admin_user.email, "admin1234")
    res = client.post(
        "/categories/",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Admin Category"},
    )
    assert res.status_code == 201
    assert res.json()["name"] == "Admin Category"
