"""应用入口：创建 FastAPI 实例并挂载路由。"""

from fastapi import FastAPI

from app.core.exception_handlers import register_exception_handlers
from app.core.logging import setup_logging
from app.routers import user

setup_logging()

app = FastAPI(title="用户管理 API", version="1.0.0")
register_exception_handlers(app)

app.include_router(user.router)


@app.get("/")
def root():
    return {"message": "用户管理 API 运行中"}
