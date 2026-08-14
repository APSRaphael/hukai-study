"""健康检查：服务存活 + 数据库连通性。"""

from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.db.session import engine

router = APIRouter(tags=["健康检查"])


def ping_database() -> None:
    """探测数据库；失败时抛出异常供上层转成 503。"""
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


@router.get("/health")
def health() -> JSONResponse:
    """
    存活与依赖检查。
    - 200：服务正常且数据库可连通
    - 503：数据库不可用
    """
    try:
        ping_database()
    except Exception as exc:  # noqa: BLE001 - 健康检查需兜住所有连库失败
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "service": "up",
                "database": "down",
                "detail": f"{type(exc).__name__}: {exc}",
            },
        )

    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "service": "up",
            "database": "up",
        },
    )
