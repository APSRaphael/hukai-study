"""自定义异常：业务异常（可预期）与系统异常（不可预期）。"""

from __future__ import annotations


class AppException(Exception):
    """应用异常基类。"""

    def __init__(
        self,
        message: str,
        *,
        code: int,
        detail: str | None = None,
        status_code: int = 400,
    ) -> None:
        self.message = message  # 前端可读中文
        self.code = code  # 业务/系统错误码
        self.detail = detail or message  # 后端定位信息
        self.status_code = status_code  # HTTP 状态码
        super().__init__(message)


class BusinessException(AppException):
    """业务异常：参数不合法、资源不存在、规则冲突等。"""

    def __init__(
        self,
        message: str,
        *,
        code: int = 40000,
        detail: str | None = None,
        status_code: int = 400,
    ) -> None:
        super().__init__(
            message, code=code, detail=detail, status_code=status_code
        )


class SystemException(AppException):
    """系统异常：内部错误，需日志排查。"""

    def __init__(
        self,
        message: str = "系统内部错误",
        *,
        code: int = 50000,
        detail: str | None = None,
        status_code: int = 500,
    ) -> None:
        super().__init__(
            message, code=code, detail=detail, status_code=status_code
        )
