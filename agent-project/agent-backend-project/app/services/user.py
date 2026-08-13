"""业务层：用户增删改查。"""

from __future__ import annotations

from app.core.exceptions import BusinessException
from app.core.security import hash_password
from app.db import user as user_db
from app.schemas.user import UserCreate, UserOut, UserUpdate


def create_user(payload: UserCreate) -> UserOut:
    """创建用户：用户名唯一，密码只存哈希。"""
    if user_db.get_user_by_username(payload.username):
        raise BusinessException(
            "用户名已存在",
            code=40001,
            detail=f"username={payload.username} 已存在",
            status_code=400,
        )
    user = user_db.create_user(
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    return UserOut(id=user["id"], username=user["username"])


def list_users() -> list[UserOut]:
    """查询全部用户。"""
    return [UserOut(id=u["id"], username=u["username"]) for u in user_db.list_users()]


def get_user(user_id: int) -> UserOut:
    """按 id 查询用户。"""
    user = user_db.get_user(user_id)
    if user is None:
        raise BusinessException(
            "用户不存在",
            code=40401,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )
    return UserOut(id=user["id"], username=user["username"])


def update_user(user_id: int, payload: UserUpdate) -> UserOut:
    """更新用户名和/或密码。"""
    if user_db.get_user(user_id) is None:
        raise BusinessException(
            "用户不存在",
            code=40401,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )

    # 用户名变更时检查唯一性
    if payload.username is not None:
        existing = user_db.get_user_by_username(payload.username)
        if existing and existing["id"] != user_id:
            raise BusinessException(
                "用户名已存在",
                code=40001,
                detail=(
                    f"username={payload.username} "
                    f"已被 user_id={existing['id']} 占用"
                ),
                status_code=400,
            )

    password_hash = (
        hash_password(payload.password) if payload.password is not None else None
    )
    user = user_db.update_user(
        user_id,
        username=payload.username,
        password_hash=password_hash,
    )
    assert user is not None
    return UserOut(id=user["id"], username=user["username"])


def delete_user(user_id: int) -> None:
    """删除用户。"""
    if not user_db.delete_user(user_id):
        raise BusinessException(
            "用户不存在",
            code=40401,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )
