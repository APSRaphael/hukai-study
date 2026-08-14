"""基础冒烟测试：健康检查 + 鉴权用户 CRUD。"""

from __future__ import annotations

from app.routers import health as health_router


async def _register_and_login(client, username: str, password: str = "okPass1"):
    """注册并登录，返回 (user_id, auth_headers)。"""
    reg = await client.post(
        "/auth/register",
        json={"username": username, "password": password},
    )
    assert reg.status_code == 201, reg.text
    user_id = reg.json()["id"]
    login = await client.post(
        "/auth/login",
        json={"username": username, "password": password},
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    return user_id, {"Authorization": f"Bearer {token}"}


async def test_health_ok(client, monkeypatch):
    """数据库正常时 /health 返回 200。"""

    def _ok() -> None:
        return None

    monkeypatch.setattr(health_router, "ping_database", _ok)
    resp = await client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "healthy"
    assert body["service"] == "up"
    assert body["database"] == "up"


async def test_health_db_down_returns_503(client, monkeypatch):
    """数据库不可用时 /health 返回 503。"""

    def _fail() -> None:
        raise RuntimeError("db down")

    monkeypatch.setattr(health_router, "ping_database", _fail)
    resp = await client.get("/health")
    assert resp.status_code == 503
    body = resp.json()
    assert body["status"] == "unhealthy"
    assert body["service"] == "up"
    assert body["database"] == "down"


async def test_users_require_auth(client):
    """未带 Token 访问受保护接口返回 401。"""
    resp = await client.get("/users")
    assert resp.status_code == 401
    assert resp.json()["code"] == 401


async def test_user_crud_smoke(client):
    """用户增删改查主路径冒烟（需鉴权）。"""
    _, headers = await _register_and_login(client, "smoke_admin")

    create_resp = await client.post(
        "/users",
        headers=headers,
        json={"username": "smoke_user", "password": "okPass1"},
    )
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["username"] == "smoke_user"
    user_id = created["id"]

    list_resp = await client.get("/users", headers=headers)
    assert list_resp.status_code == 200
    assert any(u["id"] == user_id for u in list_resp.json())

    get_resp = await client.get(f"/users/{user_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["username"] == "smoke_user"

    update_resp = await client.put(
        f"/users/{user_id}",
        headers=headers,
        json={"username": "smoke_user_2"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["username"] == "smoke_user_2"

    delete_resp = await client.delete(f"/users/{user_id}", headers=headers)
    assert delete_resp.status_code == 204

    missing = await client.get(f"/users/{user_id}", headers=headers)
    assert missing.status_code == 404
    assert missing.json()["code"] == 404


async def test_create_user_validation_error(client):
    """密码过短时返回统一校验错误结构。"""
    _, headers = await _register_and_login(client, "valid_admin")
    resp = await client.post(
        "/users",
        headers=headers,
        json={"username": "ab", "password": "12"},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["code"] == 422
    assert body["message"] == "请求参数校验失败"
    assert "errors" in body["detail"]
    fields = {item["field"] for item in body["detail"]["errors"]}
    assert "password" in fields


async def test_create_duplicate_username(client):
    """重复用户名返回业务错误。"""
    _, headers = await _register_and_login(client, "dup_admin")
    payload = {"username": "dup_user", "password": "okPass1"}
    assert (
        await client.post("/users", headers=headers, json=payload)
    ).status_code == 201
    resp = await client.post("/users", headers=headers, json=payload)
    assert resp.status_code == 400
    body = resp.json()
    assert body["code"] == 400
    assert body["message"] == "用户名已存在"


async def test_create_user_rejects_weak_password(client):
    """/users 创建同样复用弱密码策略。"""
    _, headers = await _register_and_login(client, "weak_admin")
    resp = await client.post(
        "/users",
        headers=headers,
        json={"username": "weak_user", "password": "123456"},
    )
    assert resp.status_code == 400
    assert resp.json()["code"] == 400
