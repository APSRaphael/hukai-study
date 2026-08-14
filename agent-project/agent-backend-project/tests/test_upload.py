"""上传接口测试。"""

from __future__ import annotations

from io import BytesIO
from types import SimpleNamespace

from app.core.rate_limit import register_rate_limiter


async def _register_login(client, username: str = "up_user"):
    register_rate_limiter.reset()
    reg = await client.post(
        "/auth/register",
        json={"username": username, "password": "okPass1"},
    )
    assert reg.status_code == 201, reg.text
    login = await client.post(
        "/auth/login",
        json={"username": username, "password": "okPass1"},
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]
    return reg.json(), {"Authorization": f"Bearer {token}"}


async def test_upload_image_updates_avatar(client, tmp_path, monkeypatch):
    monkeypatch.setattr(
        "app.services.upload.get_settings",
        lambda: SimpleNamespace(resolved_upload_dir=tmp_path),
    )

    user, headers = await _register_login(client, "avatar_user")
    png = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
        b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0c"
        b"IDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00"
        b"\x00IEND\xaeB`\x82"
    )
    resp = await client.post(
        "/upload/file",
        headers=headers,
        files={"file": ("a.png", BytesIO(png), "image/png")},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["file_type"] == "image"
    assert body["avatar"]
    assert body["avatar"].startswith(f"/uploads/{user['id']}/")

    me = await client.get("/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["avatar"] == body["avatar"]


async def test_upload_requires_auth(client):
    resp = await client.post(
        "/upload/file",
        files={"file": ("a.txt", BytesIO(b"hi"), "text/plain")},
    )
    assert resp.status_code == 401
