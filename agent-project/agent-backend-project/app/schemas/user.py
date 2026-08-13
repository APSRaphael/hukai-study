"""校验层：Pydantic v2 请求/响应模型。"""

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    """创建用户请求体。"""

    username: str = Field(min_length=2, max_length=32, description="用户名")
    password: str = Field(
        min_length=6, max_length=64, description="明文密码（仅传输用）"
    )


class UserUpdate(BaseModel):
    """更新用户请求体：字段均可选。"""

    username: str | None = Field(
        default=None, min_length=2, max_length=32, description="用户名"
    )
    password: str | None = Field(
        default=None, min_length=6, max_length=64, description="新密码（明文）"
    )


class UserOut(BaseModel):
    """对外响应：不返回密码。"""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
