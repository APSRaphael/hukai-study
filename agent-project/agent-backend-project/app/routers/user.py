"""路由层：用户信息增删改查接口。"""

from fastapi import APIRouter, status

from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["用户"])


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    """新增用户。"""
    return user_service.create_user(payload)


@router.get("", response_model=list[UserOut])
def list_users():
    """查询用户列表。"""
    return user_service.list_users()


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    """按 id 查询用户。"""
    return user_service.get_user(user_id)


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, payload: UserUpdate):
    """更新用户。"""
    return user_service.update_user(user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int):
    """删除用户。"""
    user_service.delete_user(user_id)
