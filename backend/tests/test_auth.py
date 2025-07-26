import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/register", json={
            "email": "testuser@example.com",
            "username": "testuser",
            "password": "testpass123"
        })
    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"


@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "testpass123"
        })
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_get_current_user():
    # Сначала получаем токен
    async with AsyncClient(app=app, base_url="http://test") as ac:
        login = await ac.post("/auth/login", data={
            "username": "testuser@example.com",
            "password": "testpass123"
        })
        token = login.json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        response = await ac.get("/auth/me", headers=headers)

    assert response.status_code == 200
    assert response.json()["email"] == "testuser@example.com"
