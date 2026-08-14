"""认证相关路由：注册、登录、刷新令牌。"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import CurrentUser
from app.core.rate_limit import rate_limit_dependency, register_rate_limiter
from app.db.session import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse
from app.schemas.user import UserCreate, UserOut
from app.services import auth as auth_service
from app.services import user as user_service

router = APIRouter(prefix="/auth", tags=["认证"])

DbSession = Annotated[Session, Depends(get_db)]
RegisterRateLimit = Annotated[
    None,
    Depends(rate_limit_dependency(register_rate_limiter, prefix="register")),
]


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserCreate,
    db: DbSession,
    _: RegisterRateLimit,
):
    """用户注册：限流后复用创建用户（含弱密码校验与 bcrypt）。"""
    return user_service.create_user(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DbSession):
    """登录：校验密码后签发 access + refresh token。"""
    return auth_service.login(
        db, username=payload.username, password=payload.password
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(payload: RefreshRequest, db: DbSession):
    """用 refresh token 换取新的 access / refresh（供客户端自动续期）。"""
    return auth_service.refresh_tokens(db, refresh_token=payload.refresh_token)


@router.get("/me", response_model=UserOut)
def me(current_user: CurrentUser):
    """当前登录用户信息。"""
    return user_service.to_user_out(current_user)
