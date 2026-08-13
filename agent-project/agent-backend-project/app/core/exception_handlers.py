"""全局异常处理器：统一输出 code/message/detail。"""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import AppException, BusinessException, SystemException
from app.schemas.response import ErrorResponse

logger = logging.getLogger(__name__)


def _json_error(
    *,
    status_code: int,
    code: int,
    message: str,
    detail: object = None,
) -> JSONResponse:
    body = ErrorResponse(code=code, message=message, detail=detail)
    return JSONResponse(status_code=status_code, content=body.model_dump())


def register_exception_handlers(app: FastAPI) -> None:
    """向 FastAPI 应用注册全局异常处理。"""

    @app.exception_handler(BusinessException)
    async def business_exception_handler(
        request: Request, exc: BusinessException
    ) -> JSONResponse:
        # 业务错误：前端可读，detail 便于后端定位
        logger.warning(
            "业务异常 path=%s code=%s detail=%s",
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
        logger.error(
            "系统异常 path=%s code=%s detail=%s",
            request.url.path,
            exc.code,
            exc.detail,
            exc_info=True,
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
            "应用异常 path=%s code=%s detail=%s",
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
        logger.info("参数校验失败 path=%s errors=%s", request.url.path, exc.errors())
        return _json_error(
            status_code=422,
            code=42200,
            message="请求参数校验失败",
            detail=exc.errors(),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        # 兼容未改造的 HTTPException
        message = exc.detail if isinstance(exc.detail, str) else "请求失败"
        logger.warning(
            "HTTP异常 path=%s status=%s detail=%s",
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
        logger.exception("未处理异常 path=%s", request.url.path)
        return _json_error(
            status_code=500,
            code=50000,
            message="系统内部错误",
            detail=f"{type(exc).__name__}: {exc}",
        )
