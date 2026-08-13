"""统一错误响应模型。"""

from typing import Any

from pydantic import BaseModel, Field


class ValidationErrorItem(BaseModel):
    """单条参数校验错误。"""

    field: str = Field(description="出错字段名")
    message: str = Field(description="前端可读中文说明")
    type: str = Field(description="校验错误类型")


class ValidationErrorDetail(BaseModel):
    """参数校验失败时的 detail 结构。"""

    errors: list[ValidationErrorItem] = Field(description="字段级错误列表")
    path: str = Field(description="请求路径")
    method: str = Field(description="HTTP 方法")


class ErrorResponse(BaseModel):
    """标准化错误体：前端看 message，后端靠 detail/code 定位。"""

    code: int = Field(description="业务/系统错误码")
    message: str = Field(description="前端可读中文说明")
    detail: Any = Field(default=None, description="后端定位或校验细节")
