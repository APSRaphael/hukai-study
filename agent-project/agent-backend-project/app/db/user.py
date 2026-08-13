"""数据库层：基于 SQLAlchemy Session 的用户表访问。"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


def list_users(db: Session) -> list[User]:
    """返回全部用户（按 id 升序）。"""
    return list(db.scalars(select(User).order_by(User.id)).all())


def get_user(db: Session, user_id: int) -> User | None:
    """按 id 查询；不存在返回 None。"""
    return db.get(User, user_id)


def get_user_by_username(db: Session, username: str) -> User | None:
    """按用户名查询；用于唯一性校验。"""
    stmt = select(User).where(User.username == username)
    return db.scalars(stmt).first()


def create_user(db: Session, username: str, password_hash: str) -> User:
    """插入用户，id / create_time 由数据库生成。"""
    user = User(username=username, password=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(
    db: Session,
    user_id: int,
    *,
    username: str | None = None,
    password_hash: str | None = None,
) -> User | None:
    """更新用户；不存在返回 None。"""
    user = db.get(User, user_id)
    if user is None:
        return None
    if username is not None:
        user.username = username
    if password_hash is not None:
        user.password = password_hash
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> bool:
    """删除用户；成功 True，不存在 False。"""
    user = db.get(User, user_id)
    if user is None:
        return False
    db.delete(user)
    db.commit()
    return True
