"""统一错误响应模型。"""

from typing import Any

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """标准化错误体：前端看 message，后端靠 detail/code 定位。"""

    code: int = Field(description="业务/系统错误码")
    message: str = Field(description="前端可读中文说明")
    detail: Any = Field(default=None, description="后端定位或校验细节")
