import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_user():
    unique = uuid.uuid4().hex[:8]
    email = f"test_{unique}@example.com"

    response = client.post("/auth/register", json={
        "email": email,
        "username": f"testuser_{unique}",
        "password": "testpass"
    })
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == email
    assert data["username"].startswith("testuser_")
    assert data["id"] > 0

def test_login_user():
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_get_current_user():
    # Сначала логинимся
    login_response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "testpass"
    })
    token = login_response.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/auth/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
