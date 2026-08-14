"""认证相关路由：注册等。"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.rate_limit import rate_limit_dependency, register_rate_limiter
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut
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
