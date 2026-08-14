"""弱密码策略：黑名单、字母+数字、禁止包含用户名。"""

from __future__ import annotations

import re

from app.core.error_codes import (
    CODE_WEAK_PASSWORD_BLACKLIST,
    CODE_WEAK_PASSWORD_COMPLEXITY,
    CODE_WEAK_PASSWORD_CONTAINS_USERNAME,
)
from app.core.exceptions import BusinessException

# 常见弱口令黑名单（小写比对）
_PASSWORD_BLACKLIST = frozenset(
    {
        "password",
        "password1",
        "password123",
        "123456",
        "12345678",
        "123456789",
        "qwerty",
        "qwerty123",
        "abc123",
        "admin",
        "admin123",
        "letmein",
        "welcome",
        "iloveyou",
        "111111",
        "000000",
    }
)

_HAS_LETTER = re.compile(r"[A-Za-z]")
_HAS_DIGIT = re.compile(r"\d")


def validate_password_strength(username: str, password: str) -> None:
    """校验密码强度；不通过则抛出业务异常。"""
    lowered = password.lower()
    if lowered in _PASSWORD_BLACKLIST:
        raise BusinessException(
            "密码过于简单，请更换",
            code=CODE_WEAK_PASSWORD_BLACKLIST,
            detail="password in blacklist",
            status_code=400,
        )
    if not _HAS_LETTER.search(password) or not _HAS_DIGIT.search(password):
        raise BusinessException(
            "密码必须同时包含字母和数字",
            code=CODE_WEAK_PASSWORD_COMPLEXITY,
            detail="password must contain letter and digit",
            status_code=400,
        )
    if username and username.lower() in lowered:
        raise BusinessException(
            "密码不能包含用户名",
            code=CODE_WEAK_PASSWORD_CONTAINS_USERNAME,
            detail="password contains username",
            status_code=400,
        )
