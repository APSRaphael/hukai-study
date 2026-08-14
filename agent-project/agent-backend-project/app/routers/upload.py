"""需认证的通用文件上传。"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.deps import CurrentUser
from app.db.session import get_db
from app.schemas.upload import UploadOut
from app.services import upload as upload_service

router = APIRouter(prefix="/upload", tags=["上传"])

DbSession = Annotated[Session, Depends(get_db)]
UploadFileParam = Annotated[UploadFile, File(description="上传文件")]


@router.post("/file", response_model=UploadOut)
async def upload_file(
    db: DbSession,
    current_user: CurrentUser,
    file: UploadFileParam,
):
    """图片：保存并更新头像；文档：仅保存。按用户目录 + MD5 去重。"""
    return await upload_service.save_upload(db, current_user, file)
