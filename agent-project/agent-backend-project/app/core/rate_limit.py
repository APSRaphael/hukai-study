"""简单固定窗口限流（进程内内存，按 key 计数）。"""

from __future__ import annotations

import time
from collections.abc import Callable
from threading import Lock

from fastapi import Request

from app.core.error_codes import CODE_RATE_LIMITED
from app.core.exceptions import BusinessException


class FixedWindowRateLimiter:
    """固定时间窗口限流器。"""

    def __init__(self, *, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._counts: dict[str, int] = {}
        self._lock = Lock()

    def hit(self, key: str) -> None:
        """记录一次访问；超出限额则抛业务异常。"""
        window = int(time.time() // self.window_seconds)
        bucket = f"{key}:{window}"
        with self._lock:
            # 顺带清理非当前窗口的计数，避免字典无限增长
            stale = [k for k in self._counts if not k.endswith(f":{window}")]
            for k in stale:
                del self._counts[k]

            count = self._counts.get(bucket, 0)
            if count >= self.limit:
                raise BusinessException(
                    "请求过于频繁，请稍后再试",
                    code=CODE_RATE_LIMITED,
                    detail=f"rate limited key={key} limit={self.limit}/{self.window_seconds}s",
                    status_code=429,
                )
            self._counts[bucket] = count + 1

    def reset(self) -> None:
        """测试用：清空计数。"""
        with self._lock:
            self._counts.clear()


def client_ip(request: Request) -> str:
    """提取客户端 IP（优先 X-Forwarded-For 首段）。"""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def rate_limit_dependency(
    limiter: FixedWindowRateLimiter,
    *,
    prefix: str,
) -> Callable[[Request], None]:
    """生成 FastAPI 依赖：按 IP 固定窗口限流。"""

    def _depend(request: Request) -> None:
        limiter.hit(f"{prefix}:{client_ip(request)}")

    return _depend


# 注册接口：每 IP 每分钟最多 5 次
register_rate_limiter = FixedWindowRateLimiter(limit=5, window_seconds=60)
