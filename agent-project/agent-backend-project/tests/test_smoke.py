"""基础冒烟测试：健康检查 + 用户 CRUD。"""

from __future__ import annotations

from app.routers import health as health_router


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


async def test_user_crud_smoke(client):
    """用户增删改查主路径冒烟。"""
    create_resp = await client.post(
        "/users",
        json={"username": "smoke_user", "password": "pass123"},
    )
    assert create_resp.status_code == 201
    created = create_resp.json()
    assert created["username"] == "smoke_user"
    user_id = created["id"]

    list_resp = await client.get("/users")
    assert list_resp.status_code == 200
    assert any(u["id"] == user_id for u in list_resp.json())

    get_resp = await client.get(f"/users/{user_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["username"] == "smoke_user"

    update_resp = await client.put(
        f"/users/{user_id}",
        json={"username": "smoke_user_2"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["username"] == "smoke_user_2"

    delete_resp = await client.delete(f"/users/{user_id}")
    assert delete_resp.status_code == 204

    missing = await client.get(f"/users/{user_id}")
    assert missing.status_code == 404
    assert missing.json()["code"] == 40401


async def test_create_user_validation_error(client):
    """密码过短时返回统一校验错误结构。"""
    resp = await client.post(
        "/users",
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
    payload = {"username": "dup_user", "password": "pass123"}
    assert (await client.post("/users", json=payload)).status_code == 201
    resp = await client.post("/users", json=payload)
    assert resp.status_code == 400
    body = resp.json()
    assert body["code"] == 40001
    assert body["message"] == "用户名已存在"
