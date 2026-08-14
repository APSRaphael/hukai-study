"""全局异常处理器：统一输出 code/message/detail。"""

from __future__ import annotations

from collections.abc import Sequence
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from loguru import logger
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AppException, BusinessException, SystemException
from app.schemas.response import (
    ErrorResponse,
    ValidationErrorDetail,
    ValidationErrorItem,
)

# Pydantic / FastAPI 常见校验类型 → 前端可读中文
_VALIDATION_TYPE_MESSAGES: dict[str, str] = {
    "string_too_short": "长度太短",
    "string_too_long": "长度太长",
    "missing": "缺少必填字段",
    "int_parsing": "必须是整数",
    "float_parsing": "必须是数字",
    "bool_parsing": "必须是布尔值",
    "json_invalid": "JSON 格式无效",
    "extra_forbidden": "包含不允许的字段",
    "value_error": "值不合法",
    "type_error": "类型不正确",
    "enum": "不在允许的取值范围内",
    "greater_than": "数值过小",
    "greater_than_equal": "数值过小",
    "less_than": "数值过大",
    "less_than_equal": "数值过大",
}

_LOC_PREFIXES = frozenset({"body", "query", "path", "header", "cookie"})


def _json_error(
    *,
    status_code: int,
    code: int,
    message: str,
    detail: object = None,
) -> JSONResponse:
    body = ErrorResponse(code=code, message=message, detail=detail)
    return JSONResponse(status_code=status_code, content=body.model_dump())


def _field_from_loc(loc: Sequence[Any]) -> str:
    """从 loc 提取字段名，如 ['body', 'password'] → 'password'。"""
    parts = [str(part) for part in loc]
    if parts and parts[0] in _LOC_PREFIXES:
        parts = parts[1:]
    return ".".join(parts) if parts else ""


def _validation_message(error: dict[str, Any]) -> str:
    error_type = str(error.get("type") or "")
    if error_type in _VALIDATION_TYPE_MESSAGES:
        return _VALIDATION_TYPE_MESSAGES[error_type]
    # 未知类型时尽量用简短中文，避免直接吐英文原文
    return "参数不合法"


def _build_validation_detail(
    request: Request, exc: RequestValidationError
) -> dict[str, Any]:
    items = [
        ValidationErrorItem(
            field=_field_from_loc(error.get("loc") or ()),
            message=_validation_message(error),
            type=str(error.get("type") or "value_error"),
        )
        for error in exc.errors()
    ]
    detail = ValidationErrorDetail(
        errors=items,
        path=request.url.path,
        method=request.method.upper(),
    )
    return detail.model_dump()


def register_exception_handlers(app: FastAPI) -> None:
    """向 FastAPI 应用注册全局异常处理。"""

    @app.exception_handler(BusinessException)
    async def business_exception_handler(
        request: Request, exc: BusinessException
    ) -> JSONResponse:
        # 业务错误：前端可读，detail 便于后端定位
        logger.warning(
            "业务异常 path={} code={} detail={}",
            request.url.path,
            exc.code,
            exc.detail,
        )
        return _json_error(
            status_code=exc.status_code,
            code=exc.code,
            message=exc.message,
            detail=exc.detail,
        )

    @app.exception_handler(SystemException)
    async def system_exception_handler(
        request: Request, exc: SystemException
    ) -> JSONResponse:
        logger.opt(exception=True).error(
            "系统异常 path={} code={} detail={}",
            request.url.path,
            exc.code,
            exc.detail,
        )
        return _json_error(
            status_code=exc.status_code,
            code=exc.code,
            message=exc.message,
            detail=exc.detail,
        )

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request, exc: AppException
    ) -> JSONResponse:
        logger.warning(
            "应用异常 path={} code={} detail={}",
            request.url.path,
            exc.code,
            exc.detail,
        )
        return _json_error(
            status_code=exc.status_code,
            code=exc.code,
            message=exc.message,
            detail=exc.detail,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        logger.info("参数校验失败 path={} errors={}", request.url.path, exc.errors())
        return _json_error(
            status_code=422,
            code=422,
            message="请求参数校验失败",
            detail=_build_validation_detail(request, exc),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        # 兼容未改造的 HTTPException
        message = exc.detail if isinstance(exc.detail, str) else "请求失败"
        logger.warning(
            "HTTP异常 path={} status={} detail={}",
            request.url.path,
            exc.status_code,
            exc.detail,
        )
        return _json_error(
            status_code=exc.status_code,
            code=exc.status_code * 100,
            message=message,
            detail=exc.detail,
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        # 未捕获异常：前端给通用文案，detail 写异常类型便于定位
        logger.opt(exception=True).error("未处理异常 path={}", request.url.path)
        return _json_error(
            status_code=500,
            code=50000,
            message="系统内部错误",
            detail=f"{type(exc).__name__}: {exc}",
        )
