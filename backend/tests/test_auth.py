import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/register", json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpass"
        })
        assert response.status_code == 200
        assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/auth/login", data={
            "username": "test@example.com",
            "password": "testpass"
        })
        assert response.status_code == 200
        assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_get_current_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        login_response = await ac.post("/auth/login", data={
            "username": "test@example.com",
            "password": "testpass"
        })
        token = login_response.json()["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        response = await ac.get("/auth/me", headers=headers)

        assert response.status_code == 200
        assert response.json()["username"] == "testuser"
