"""JWT 签发与校验（PyJWT）。"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any, Literal
from uuid import uuid4

import jwt

from app.core.config import get_settings
from app.core.error_codes import CODE_UNAUTHORIZED
from app.core.exceptions import BusinessException

TokenType = Literal["access", "refresh"]


def create_token(
    *,
    user_id: int,
    username: str,
    token_type: TokenType,
    expires_delta: timedelta | None = None,
) -> str:
    """签发 access / refresh token；密钥来自环境变量配置。"""
    settings = get_settings()
    now = datetime.now(UTC)
    if expires_delta is None:
        if token_type == "access":
            expires_delta = timedelta(
                minutes=settings.jwt_access_token_expire_minutes
            )
        else:
            expires_delta = timedelta(days=settings.jwt_refresh_token_expire_days)

    payload: dict[str, Any] = {
        "sub": str(user_id),
        "username": username,
        "type": token_type,
        "jti": uuid4().hex,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(
        payload,
        settings.resolved_jwt_secret,
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str, *, expected_type: TokenType) -> dict[str, Any]:
    """解码并校验 token 类型；失败抛出 401 业务异常。"""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.resolved_jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except jwt.ExpiredSignatureError as exc:
        raise BusinessException(
            "令牌已过期",
            code=CODE_UNAUTHORIZED,
            detail=str(exc),
            status_code=401,
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise BusinessException(
            "无效的令牌",
            code=CODE_UNAUTHORIZED,
            detail=str(exc),
            status_code=401,
        ) from exc

    if payload.get("type") != expected_type:
        raise BusinessException(
            "令牌类型不匹配",
            code=CODE_UNAUTHORIZED,
            detail=f"expected={expected_type} actual={payload.get('type')}",
            status_code=401,
        )
    return payload


def create_token_pair(*, user_id: int, username: str) -> dict[str, str]:
    """同时签发 access + refresh。"""
    return {
        "access_token": create_token(
            user_id=user_id, username=username, token_type="access"
        ),
        "refresh_token": create_token(
            user_id=user_id, username=username, token_type="refresh"
        ),
        "token_type": "bearer",
    }
