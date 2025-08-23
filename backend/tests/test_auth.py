import uuid
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
    # используем уникальный email и username, чтобы тест не падал при повторном запуске
    unique = uuid.uuid4().hex[:8]
    email = f"test_{unique}@example.com"
    username = f"testuser_{unique}"

    response = client.post("/auth/register", json={
        "email": email,
        "username": username,
        "password": "testpass"
    })
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["email"] == email
    assert data["username"] == username
    assert data["id"] > 0


def test_login_user():
    # создаём нового пользователя для логина
    unique = uuid.uuid4().hex[:8]
    email = f"login_{unique}@example.com"
    username = f"loginuser_{unique}"
    password = "mypassword"

    # регистрация
    reg = client.post("/auth/register", json={
        "email": email,
        "username": username,
        "password": password
    })
    assert reg.status_code == 200, reg.text

    # логин
    res = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_get_current_user():
    # создаём пользователя
    unique = uuid.uuid4().hex[:8]
    email = f"me_{unique}@example.com"
    username = f"meuser_{unique}"
    password = "passme"

    reg = client.post("/auth/register", json={
        "email": email,
        "username": username,
        "password": password
    })
    assert reg.status_code == 200, reg.text

    # получаем токен
    res = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]

    # проверяем /auth/me
    me = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me.status_code == 200, me.text
    data = me.json()
    assert data["email"] == email
    assert data["username"] == username
