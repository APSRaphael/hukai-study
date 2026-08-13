"""路由层：用户信息增删改查接口。"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["用户"])


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    """新增用户。"""
    return user_service.create_user(db, payload)


@router.get("", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    """查询用户列表。"""
    return user_service.list_users(db)


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """按 id 查询用户。"""
    return user_service.get_user(db, user_id)


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int, payload: UserUpdate, db: Session = Depends(get_db)
):
    """更新用户。"""
    return user_service.update_user(db, user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """删除用户。"""
    user_service.delete_user(db, user_id)
