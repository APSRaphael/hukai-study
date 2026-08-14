"""本地文件上传：按用户目录 + MD5 去重；图片会更新 users.avatar。"""

from __future__ import annotations

import hashlib
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.error_codes import CODE_BAD_REQUEST
from app.core.exceptions import BusinessException
from app.db import user as user_db
from app.models.user import User
from app.schemas.upload import UploadOut

IMAGE_CONTENT_TYPES = frozenset(
    {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    }
)

_EXT_BY_TYPE = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/markdown": ".md",
}


def _guess_ext(filename: str | None, content_type: str | None) -> str:
    if content_type and content_type in _EXT_BY_TYPE:
        return _EXT_BY_TYPE[content_type]
    if filename and "." in filename:
        return Path(filename).suffix.lower()[:16]
    return ".bin"


def _classify(content_type: str | None) -> str:
    if content_type and content_type.lower() in IMAGE_CONTENT_TYPES:
        return "image"
    return "document"


async def save_upload(db: Session, user: User, file: UploadFile) -> UploadOut:
    """保存上传文件；图片则写入 avatar。"""
    raw = await file.read()
    if not raw:
        raise BusinessException(
            "上传文件为空",
            code=CODE_BAD_REQUEST,
            detail="empty file",
            status_code=400,
        )

    content_type = (file.content_type or "").lower() or None
    file_type = _classify(content_type)
    file_hash = hashlib.md5(raw).hexdigest()
    ext = _guess_ext(file.filename, content_type)

    settings = get_settings()
    user_dir = settings.resolved_upload_dir / str(user.id)
    user_dir.mkdir(parents=True, exist_ok=True)

    disk_name = f"{file_hash}{ext}"
    disk_path = user_dir / disk_name
    if not disk_path.exists():
        disk_path.write_bytes(raw)

    public_path = f"/uploads/{user.id}/{disk_name}"
    avatar: str | None = None
    if file_type == "image":
        updated = user_db.update_user(db, user.id, avatar=public_path)
        assert updated is not None
        avatar = public_path

    return UploadOut(
        file_path=public_path,
        file_type=file_type,
        file_hash=file_hash,
        avatar=avatar,
    )
