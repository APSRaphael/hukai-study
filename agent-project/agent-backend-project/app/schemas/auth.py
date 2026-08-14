"""认证相关请求/响应模型。"""

from pydantic import BaseModel, Field

from app.schemas.user import UserCreate

# 登录请求体与注册相同：username + password
LoginRequest = UserCreate


class RefreshRequest(BaseModel):
    """刷新访问令牌。"""

    refresh_token: str = Field(min_length=1, description="刷新令牌")


class TokenResponse(BaseModel):
    """登录 / 刷新成功返回的双令牌。"""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
