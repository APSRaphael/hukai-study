"""认证业务：登录与刷新令牌。"""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.error_codes import CODE_UNAUTHORIZED
from app.core.exceptions import BusinessException
from app.core.jwt_tokens import create_token_pair, decode_token
from app.core.security import verify_password
from app.db import user as user_db
from app.schemas.auth import TokenResponse


def login(db: Session, *, username: str, password: str) -> TokenResponse:
    """校验账号密码，签发 access + refresh。"""
    user = user_db.get_user_by_username(db, username)
    if user is None or not verify_password(password, user.password):
        raise BusinessException(
            "用户名或密码错误",
            code=CODE_UNAUTHORIZED,
            detail=f"login failed username={username}",
            status_code=401,
        )
    tokens = create_token_pair(user_id=user.id, username=user.username)
    return TokenResponse(**tokens)


def refresh_tokens(db: Session, *, refresh_token: str) -> TokenResponse:
    """用 refresh token 换取新的双令牌（旋转刷新）。"""
    payload = decode_token(refresh_token, expected_type="refresh")
    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError) as exc:
        raise BusinessException(
            "无效的刷新令牌",
            code=CODE_UNAUTHORIZED,
            detail="refresh.sub 非法",
            status_code=401,
        ) from exc

    user = user_db.get_user(db, user_id)
    if user is None:
        raise BusinessException(
            "用户不存在或已被删除",
            code=CODE_UNAUTHORIZED,
            detail=f"user_id={user_id}",
            status_code=401,
        )
    tokens = create_token_pair(user_id=user.id, username=user.username)
    return TokenResponse(**tokens)
