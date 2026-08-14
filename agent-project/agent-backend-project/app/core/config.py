"""应用配置：按 APP_ENV 分层加载，敏感信息只来自环境变量 / .env。"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import quote_plus

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

AppEnv = Literal["development", "production"]

# 先读进程环境，决定叠加哪份分层文件；未设置时默认 development
_APP_ENV = os.getenv("APP_ENV", "development")
_BASE_DIR = Path(__file__).resolve().parents[2]
_ENV_FILES = (
    _BASE_DIR / ".env",
    _BASE_DIR / f".env.{_APP_ENV}",
)


class Settings(BaseSettings):
    """运行时配置：业务代码只通过 get_settings() 取值。"""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILES,
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )

    app_env: AppEnv = Field(default="development", alias="APP_ENV")

    # ---- 日志 ----
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_dir: str = Field(default="logs", alias="LOG_DIR")
    log_max_bytes: int = Field(default=10 * 1024 * 1024, alias="LOG_MAX_BYTES")
    log_backup_count: int = Field(default=5, alias="LOG_BACKUP_COUNT")

    # ---- MySQL（敏感：密码 / 完整 URL 只走环境变量）----
    mysql_url: str | None = Field(default=None, alias="MYSQL_URL")
    mysql_host: str = Field(default="127.0.0.1", alias="MYSQL_HOST")
    mysql_port: int = Field(default=3306, alias="MYSQL_PORT")
    mysql_user: str = Field(default="root", alias="MYSQL_USER")
    mysql_password: str = Field(default="", alias="MYSQL_PASSWORD")
    mysql_database: str = Field(default="agent_backend", alias="MYSQL_DATABASE")
    mysql_charset: str = Field(default="utf8mb4", alias="MYSQL_CHARSET")

    # ---- JWT（密钥必须来自环境变量 / .env，禁止写死进仓库）----
    jwt_secret_key: str = Field(default="", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_access_token_expire_minutes: int = Field(
        default=15, alias="JWT_ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    jwt_refresh_token_expire_days: int = Field(
        default=7, alias="JWT_REFRESH_TOKEN_EXPIRE_DAYS"
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def is_development(self) -> bool:
        return self.app_env == "development"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        """SQLAlchemy 使用的 MySQL 连接串。"""
        if self.mysql_url:
            return self.mysql_url
        user = quote_plus(self.mysql_user)
        password = quote_plus(self.mysql_password)
        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
            f"?charset={self.mysql_charset}"
        )

    @property
    def resolved_log_dir(self) -> Path:
        path = Path(self.log_dir)
        if not path.is_absolute():
            path = _BASE_DIR / path
        return path

    @property
    def resolved_jwt_secret(self) -> str:
        """生产必须配置 JWT_SECRET_KEY；开发未配置时用占位密钥便于本地启动。"""
        if self.jwt_secret_key:
            return self.jwt_secret_key
        if self.is_production:
            raise RuntimeError("生产环境必须设置环境变量 JWT_SECRET_KEY")
        return "dev-only-insecure-jwt-secret-change-me"


@lru_cache
def get_settings() -> Settings:
    return Settings()
