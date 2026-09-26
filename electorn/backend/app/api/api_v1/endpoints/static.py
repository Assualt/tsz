from fastapi import APIRouter
from app.schemas.response import SuccessResponse
from app.core.logging_config import console
from app.utils.static_loader import static_loader


router = APIRouter()


@router.get("/user-agreement")
def get_user_agreement():
    """
    获取用户协议
    """
    console.info("Get user agreement")
    
    content = static_loader.get("user_agreement")
    if content is None:
        return SuccessResponse(data=None, message="用户协议未找到")
    
    user_agreement = {
        "title": "用户协议",
        "version": "1.0.0",
        "updated_at": "2026-04-08",
        "content": content
    }
    
    return SuccessResponse(data=user_agreement)


@router.get("/privacy-policy")
def get_privacy_policy():
    """
    获取隐私政策
    """
    console.info("Get privacy policy")
    
    content = static_loader.get("privacy_policy")
    if content is None:
        return SuccessResponse(data=None, message="隐私政策未找到")
    
    privacy_policy = {
        "title": "隐私政策",
        "version": "1.0.0",
        "updated_at": "2026-04-08",
        "content": content
    }
    
    return SuccessResponse(data=privacy_policy)


@router.get("/about")
def get_about():
    """
    获取关于我们
    """
    console.info("Get about")
    
    content = static_loader.get("about")
    if content is None:
        return SuccessResponse(data=None, message="关于我们未找到")
    
    about = {
        "title": "关于我们",
        "version": "1.0.0",
        "updated_at": "2026-04-08",
        "content": content
    }
    
    return SuccessResponse(data=about)
