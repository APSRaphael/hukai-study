"""日志体系：控制台便于开发，文件用于留痕与排障。"""

from __future__ import annotations

import logging
import sys
from logging.handlers import RotatingFileHandler

from app.core.config import Settings, get_settings

# 业务关注的 logger；第三方默认收敛，避免刷屏
_NOISY_LOGGERS = (
    "uvicorn.access",
    "sqlalchemy.engine",
    "sqlalchemy.pool",
    "alembic",
)


def setup_logging(settings: Settings | None = None) -> None:
    """按环境初始化日志（可重复调用以刷新配置）。"""
    settings = settings or get_settings()
    level = _parse_level(settings.log_level)

    root = logging.getLogger()
    root.handlers.clear()
    root.setLevel(level)

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # 控制台：开发看 INFO+，生产只看 WARNING+，减少噪音
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(formatter)
    console.setLevel(logging.INFO if settings.is_development else logging.WARNING)
    root.addHandler(console)

    # 文件：全量业务日志留痕
    log_dir = settings.resolved_log_dir
    log_dir.mkdir(parents=True, exist_ok=True)

    app_file = RotatingFileHandler(
        log_dir / "app.log",
        maxBytes=settings.log_max_bytes,
        backupCount=settings.log_backup_count,
        encoding="utf-8",
    )
    app_file.setFormatter(formatter)
    app_file.setLevel(level)
    root.addHandler(app_file)

    # 错误单独落盘，方便排障
    error_file = RotatingFileHandler(
        log_dir / "error.log",
        maxBytes=settings.log_max_bytes,
        backupCount=settings.log_backup_count,
        encoding="utf-8",
    )
    error_file.setFormatter(formatter)
    error_file.setLevel(logging.ERROR)
    root.addHandler(error_file)

    # 收敛第三方日志
    noisy_level = logging.INFO if settings.is_development else logging.WARNING
    for name in _NOISY_LOGGERS:
        logging.getLogger(name).setLevel(noisy_level)

    logging.getLogger(__name__).debug(
        "logging ready env=%s level=%s dir=%s",
        settings.app_env,
        logging.getLevelName(level),
        log_dir,
    )


def _parse_level(value: str) -> int:
    level = getattr(logging, value.upper(), None)
    if isinstance(level, int):
        return level
    return logging.INFO
