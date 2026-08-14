"""业务层：用户增删改查。"""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.error_codes import CODE_USER_NOT_FOUND, CODE_USERNAME_EXISTS
from app.core.exceptions import BusinessException
from app.core.password_policy import validate_password_strength
from app.core.security import hash_password
from app.db import user as user_db
from app.schemas.user import UserCreate, UserOut, UserUpdate


def create_user(db: Session, payload: UserCreate) -> UserOut:
    """创建用户：弱密码校验 + 用户名唯一，密码只存哈希。"""
    validate_password_strength(payload.username, payload.password)
    if user_db.get_user_by_username(db, payload.username):
        raise BusinessException(
            "用户名已存在",
            code=CODE_USERNAME_EXISTS,
            detail=f"username={payload.username} 已存在",
            status_code=400,
        )
    user = user_db.create_user(
        db,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    return UserOut(id=user.id, username=user.username)


def list_users(db: Session) -> list[UserOut]:
    """查询全部用户。"""
    return [
        UserOut(id=u.id, username=u.username) for u in user_db.list_users(db)
    ]


def get_user(db: Session, user_id: int) -> UserOut:
    """按 id 查询用户。"""
    user = user_db.get_user(db, user_id)
    if user is None:
        raise BusinessException(
            "用户不存在",
            code=CODE_USER_NOT_FOUND,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )
    return UserOut(id=user.id, username=user.username)


def update_user(db: Session, user_id: int, payload: UserUpdate) -> UserOut:
    """更新用户名和/或密码。"""
    if user_db.get_user(db, user_id) is None:
        raise BusinessException(
            "用户不存在",
            code=CODE_USER_NOT_FOUND,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )

    # 用户名变更时检查唯一性
    if payload.username is not None:
        existing = user_db.get_user_by_username(db, payload.username)
        if existing and existing.id != user_id:
            raise BusinessException(
                "用户名已存在",
                code=CODE_USERNAME_EXISTS,
                detail=(
                    f"username={payload.username} "
                    f"已被 user_id={existing.id} 占用"
                ),
                status_code=400,
            )

    password_hash = None
    if payload.password is not None:
        current = user_db.get_user(db, user_id)
        assert current is not None
        final_username = (
            payload.username if payload.username is not None else current.username
        )
        validate_password_strength(final_username, payload.password)
        password_hash = hash_password(payload.password)
    user = user_db.update_user(
        db,
        user_id,
        username=payload.username,
        password_hash=password_hash,
    )
    assert user is not None
    return UserOut(id=user.id, username=user.username)


def delete_user(db: Session, user_id: int) -> None:
    """删除用户。"""
    if not user_db.delete_user(db, user_id):
        raise BusinessException(
            "用户不存在",
            code=CODE_USER_NOT_FOUND,
            detail=f"user_id={user_id} 不存在",
            status_code=404,
        )
