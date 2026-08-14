"""注册接口相关测试。"""

from __future__ import annotations

import pytest

from app.core.rate_limit import register_rate_limiter


@pytest.fixture(autouse=True)
def _reset_register_limiter():
    register_rate_limiter.reset()
    yield
    register_rate_limiter.reset()


async def test_register_success(client):
    resp = await client.post(
        "/auth/register",
        json={"username": "reg_user", "password": "okPass1"},
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["username"] == "reg_user"
    assert "password" not in body


async def test_register_blacklist_password(client):
    resp = await client.post(
        "/auth/register",
        json={"username": "reg_user2", "password": "123456"},
    )
    assert resp.status_code == 400
    assert resp.json()["code"] == 400


async def test_register_password_must_have_letter_and_digit(client):
    resp = await client.post(
        "/auth/register",
        json={"username": "reg_user3", "password": "abcdef"},
    )
    assert resp.status_code == 400
    assert resp.json()["code"] == 400


async def test_register_password_cannot_contain_username(client):
    resp = await client.post(
        "/auth/register",
        json={"username": "alice", "password": "alice123"},
    )
    assert resp.status_code == 400
    assert resp.json()["code"] == 400


async def test_register_rate_limit_5_per_minute(client):
    payload = {"username": "rate_user", "password": "okPass1"}
    # 前 5 次：第 1 次成功创建，后 4 次因用户名已存在仍计限流
    first = await client.post("/auth/register", json=payload)
    assert first.status_code == 201
    for i in range(4):
        resp = await client.post(
            "/auth/register",
            json={"username": f"rate_user_{i}", "password": "okPass1"},
        )
        assert resp.status_code == 201

    limited = await client.post(
        "/auth/register",
        json={"username": "rate_user_x", "password": "okPass1"},
    )
    assert limited.status_code == 429
    assert limited.json()["code"] == 429
