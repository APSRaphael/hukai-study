"""FastAPI 鉴权依赖：从 Bearer Token 解析当前用户。"""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.error_codes import CODE_UNAUTHORIZED
from app.core.exceptions import BusinessException
from app.core.jwt_tokens import decode_token
from app.db import user as user_db
from app.db.session import get_db
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer)
    ],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """校验 Access Token，返回当前登录用户。"""
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise BusinessException(
            "未提供访问令牌",
            code=CODE_UNAUTHORIZED,
            detail="Authorization: Bearer <access_token> 缺失",
            status_code=401,
        )

    payload = decode_token(credentials.credentials, expected_type="access")
    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError) as exc:
        raise BusinessException(
            "无效的令牌",
            code=CODE_UNAUTHORIZED,
            detail="token.sub 非法",
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
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
