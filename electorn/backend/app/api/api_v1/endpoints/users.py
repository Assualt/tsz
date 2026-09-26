from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.logging_config import console
from app.schemas.user import User, UserUpdate
from app.schemas.response import SuccessResponse
from app.models.user import User as UserModel
from app.api.api_v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/me")
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    # 将 SQLAlchemy 模型对象转换为 Pydantic 模型对象
    user_data = User.model_validate(current_user)
    data = {
        'id': '1',
        'username': user_data.username,
        'email': user_data.email,
        'phone': '13800138001',
        'realName': '张三',
        'gender': '男',
        'age': 30,
        'address': '北京市朝阳区',
        'remark': '普通用户',
        'avatar': ''
    }
    return SuccessResponse(data=data)


@router.get("")
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    console.info("current user is %d", current_user.id)
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="not enough permissions"
        )
    users = db.query(UserModel).offset(skip).limit(limit).all()
    # 将 SQLAlchemy 模型对象列表转换为 Pydantic 模型对象列表
    users_data = [User.model_validate(user) for user in users]
    return SuccessResponse(data=users_data)


@router.get("/{user_id}")
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if not current_user.is_superuser and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    # 将 SQLAlchemy 模型对象转换为 Pydantic 模型对象
    user_data = User.model_validate(user)
    return SuccessResponse(data=user_data)


@router.put("/{user_id}")
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if not current_user.is_superuser and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    db.commit()
    db.refresh(user)
    # 将 SQLAlchemy 模型对象转换为 Pydantic 模型对象
    user_data = User.model_validate(user)
    return SuccessResponse(data=user_data)

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    db.delete(user)
    db.commit()
    return SuccessResponse(data=None, message="User deleted successfully")