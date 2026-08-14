"""日志体系：基于 loguru，控制台便于开发，文件用于留痕与排障。"""

from __future__ import annotations

import logging
import sys

from loguru import logger

from app.core.config import Settings, get_settings

# 第三方默认收敛，避免刷屏
_NOISY_LOGGERS = (
    "uvicorn",
    "uvicorn.access",
    "uvicorn.error",
    "sqlalchemy.engine",
    "sqlalchemy.pool",
    "alembic",
)

_LOG_FORMAT = (
    "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
    "<level>{message}</level>"
)

_FILE_FORMAT = (
    "{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}"
)


class InterceptHandler(logging.Handler):
    """把标准库 logging 转发到 loguru，兼容 uvicorn / sqlalchemy。"""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            level: str | int = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging(settings: Settings | None = None) -> None:
    """按环境初始化 loguru（可重复调用以刷新配置）。"""
    settings = settings or get_settings()
    level = (settings.log_level or "INFO").upper()
    console_level = "INFO" if settings.is_development else "WARNING"

    log_dir = settings.resolved_log_dir
    log_dir.mkdir(parents=True, exist_ok=True)

    logger.remove()

    # 控制台：开发 INFO+，生产 WARNING+
    logger.add(
        sys.stdout,
        level=console_level,
        format=_LOG_FORMAT,
        colorize=settings.is_development,
        enqueue=True,
        backtrace=settings.is_development,
        diagnose=False,
    )

    # 全量业务日志
    logger.add(
        log_dir / "app.log",
        level=level,
        format=_FILE_FORMAT,
        rotation=settings.log_max_bytes,
        retention=settings.log_backup_count,
        encoding="utf-8",
        enqueue=True,
        backtrace=True,
        diagnose=False,
    )

    # 错误单独落盘
    logger.add(
        log_dir / "error.log",
        level="ERROR",
        format=_FILE_FORMAT,
        rotation=settings.log_max_bytes,
        retention=settings.log_backup_count,
        encoding="utf-8",
        enqueue=True,
        backtrace=True,
        diagnose=False,
    )

    # 标准库 → loguru
    logging.root.handlers.clear()
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

    noisy_level = logging.INFO if settings.is_development else logging.WARNING
    for name in _NOISY_LOGGERS:
        logging.getLogger(name).handlers.clear()
        logging.getLogger(name).propagate = True
        logging.getLogger(name).setLevel(noisy_level)

    logger.debug(
        "logging ready env={} level={} dir={}",
        settings.app_env,
        level,
        log_dir,
    )
