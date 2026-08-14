"""登录 / 刷新 / 自动续期相关测试。"""

from __future__ import annotations

from datetime import timedelta

from app.clients.auto_refresh import AutoRefreshClient
from app.core.jwt_tokens import create_token


async def _register(client, username: str, password: str = "okPass1"):
    resp = await client.post(
        "/auth/register",
        json={"username": username, "password": password},
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


async def test_login_success(client):
    await _register(client, "login_user")
    resp = await client.post(
        "/auth/login",
        json={"username": "login_user", "password": "okPass1"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


async def test_login_wrong_password(client):
    await _register(client, "login_bad")
    resp = await client.post(
        "/auth/login",
        json={"username": "login_bad", "password": "wrongPass1"},
    )
    assert resp.status_code == 401
    assert resp.json()["code"] == 401


async def test_refresh_rotates_tokens(client):
    await _register(client, "refresh_user")
    login = await client.post(
        "/auth/login",
        json={"username": "refresh_user", "password": "okPass1"},
    )
    refresh_token = login.json()["refresh_token"]
    resp = await client.post(
        "/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["refresh_token"] != refresh_token


async def test_auto_refresh_retries_original_request(client):
    """access 过期后，客户端用 refresh 换新令牌并自动重试原请求。"""
    user = await _register(client, "auto_user")
    login = await client.post(
        "/auth/login",
        json={"username": "auto_user", "password": "okPass1"},
    )
    tokens = login.json()

    expired_access = create_token(
        user_id=user["id"],
        username="auto_user",
        token_type="access",
        expires_delta=timedelta(seconds=-1),
    )
    auth_client = AutoRefreshClient(
        client,
        access_token=expired_access,
        refresh_token=tokens["refresh_token"],
    )

    resp = await auth_client.get("/users")
    assert resp.status_code == 200
    assert any(u["username"] == "auto_user" for u in resp.json())
    assert auth_client.access_token != expired_access


async def test_refresh_rejects_access_token(client):
    await _register(client, "type_user")
    login = await client.post(
        "/auth/login",
        json={"username": "type_user", "password": "okPass1"},
    )
    access = login.json()["access_token"]
    resp = await client.post("/auth/refresh", json={"refresh_token": access})
    assert resp.status_code == 401
