"""数据库层：用内存字典模拟用户表，不连接真实数据库。"""

from __future__ import annotations

from typing import Any

# 内存“表”：key=用户 id，value=用户记录
_users: dict[int, dict[str, Any]] = {}
_next_id = 1


def list_users() -> list[dict[str, Any]]:
    """返回全部用户（按 id 升序）。"""
    return [dict(_users[i]) for i in sorted(_users)]


def get_user(user_id: int) -> dict[str, Any] | None:
    """按 id 查询；不存在返回 None。"""
    user = _users.get(user_id)
    return dict(user) if user else None


def get_user_by_username(username: str) -> dict[str, Any] | None:
    """按用户名查询；用于唯一性校验。"""
    for user in _users.values():
        if user["username"] == username:
            return dict(user)
    return None


def create_user(username: str, password_hash: str) -> dict[str, Any]:
    """插入用户，自动分配自增 id。"""
    global _next_id
    user = {
        "id": _next_id,
        "username": username,
        "password": password_hash,  # 仅存哈希，不存明文
    }
    _users[_next_id] = user
    _next_id += 1
    return dict(user)


def update_user(
    user_id: int,
    *,
    username: str | None = None,
    password_hash: str | None = None,
) -> dict[str, Any] | None:
    """更新用户；不存在返回 None。"""
    user = _users.get(user_id)
    if user is None:
        return None
    if username is not None:
        user["username"] = username
    if password_hash is not None:
        user["password"] = password_hash
    return dict(user)


def delete_user(user_id: int) -> bool:
    """删除用户；成功 True，不存在 False。"""
    if user_id not in _users:
        return False
    del _users[user_id]
    return True
