"""文件上传相关响应模型。"""

from pydantic import BaseModel, Field


class UploadOut(BaseModel):
    """上传结果。"""

    file_path: str = Field(description="可访问的相对路径，如 /uploads/1/xxx.jpg")
    file_type: str = Field(description="image | document")
    file_hash: str = Field(description="文件 MD5")
    avatar: str | None = Field(
        default=None, description="若为图片则返回更新后的头像路径"
    )
