"""应用入口：创建 FastAPI 实例并挂载路由。"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import get_settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import setup_logging
from app.routers import auth, health, upload, user

settings = get_settings()
setup_logging(settings)

app = FastAPI(
    title="用户管理 API",
    version="1.0.0",
    # 生产环境默认不暴露交互文档，减少面与噪音
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# 允许前端跨域（如 Vite :5173 直连 :8000）；开发也可用前端代理规避
if settings.cors_origin_list:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

register_exception_handlers(app)

# 确保上传目录存在后再挂载静态访问
settings.resolved_upload_dir.mkdir(parents=True, exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory=str(settings.resolved_upload_dir)),
    name="uploads",
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "用户管理 API 运行中", "env": settings.app_env}
