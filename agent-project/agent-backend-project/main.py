"""应用入口：创建 FastAPI 实例并挂载路由。"""

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import setup_logging
from app.routers import health, user

settings = get_settings()
setup_logging(settings)

app = FastAPI(
    title="用户管理 API",
    version="1.0.0",
    # 生产环境默认不暴露交互文档，减少面与噪音
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)
register_exception_handlers(app)

app.include_router(health.router)
app.include_router(user.router)


@app.get("/")
def root():
    return {"message": "用户管理 API 运行中", "env": settings.app_env}
