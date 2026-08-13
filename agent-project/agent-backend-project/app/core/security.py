"""安全工具：密码哈希与校验（passlib + bcrypt）。"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """明文密码 → bcrypt 哈希。"""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """校验明文密码是否与哈希匹配。"""
    return pwd_context.verify(plain, hashed)
