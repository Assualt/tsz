from app.core.logging_config import trans, console
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import json
import random
import uuid
import asyncio
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from app.core.database import get_db
from app.core.config import settings
from app.schemas.user import CodeReq, User, UserCreate, Token, LoginRequest, QRCodeRequest, QRCodeStatusRequest, QRCodeConfirmRequest
from app.schemas.response import SuccessResponse
from app.models.user import User as UserModel
from app.utils.redis import redis_client
from app.utils.security import verify_password, get_password_hash, create_access_token, decode_access_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 记录日志到文件和控制台
    trans.info("Register user", extra={"extra_data": {"email": user.email, "username": user.username}})
    console.info(f"Register user: {user.username} ({user.email})")
    
    # 检查邮箱是否已注册
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 检查用户名是否已注册
    db_user = db.query(UserModel).filter(UserModel.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # 确保密码不超过 72 字节，这是 bcrypt 的限制
    truncated_password = user.password[:72]
    encrypt_password = get_password_hash(truncated_password)
    
    # 创建用户
    db_user = UserModel(
        username=user.username,
        email=user.email,
        hashed_password=encrypt_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    # 将 SQLAlchemy 模型对象转换为 Pydantic 模型对象
    user_data = User.model_validate(db_user)
    return SuccessResponse(data=user_data)


@router.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    console.info(f"Login attempt: {request.headers.get('Content-Type')}")
    # 获取 Content-Type
    content_type = request.headers.get("Content-Type")
    
    # 解析请求数据
    if content_type == "application/json":
        # 解析 JSON 格式的数据
        try:
            data = await request.json()
            username = data.get("username")
            password = data.get("password")
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid JSON format"
            )
    elif content_type == "application/x-www-form-urlencoded":
        # 解析表单格式的数据
        try:
            form_data = await request.form()
            username = form_data.get("username")
            password = form_data.get("password")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid form format"
            )
    else:
        # 不支持的 Content-Type
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported Content-Type"
        )
    
    # 检查用户名和密码是否提供
    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing username or password"
        )
    
    # 记录日志
    console.info(f"Login attempt: {username}")
    
    # 查找用户
    # 尝试通过邮箱查找
    user = db.query(UserModel).filter(UserModel.email == username).first()
    # 如果没有找到，尝试通过用户名查找
    if not user:
        user = db.query(UserModel).filter(UserModel.username == username).first()
    
    # 验证用户和密码
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 创建访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    # 记录登录成功
    console.info(f"Login successful: {username}")

    # 将用户信息保存到redis中去
    key = settings.REDIS_KEY_LOGIN_PREFIX + str(user.id) + ':' + username
    value = {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
        }
    }
    redis_client.set(key, json.dumps(value), expire=settings.REDIS_LOGIN_EXPIRE)
    console.info(f"login user with key: %s success", key)

    return SuccessResponse(data={
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "user_id" : user.id,
            "username" : user.username,
            "email" : user.email,
        }
    })


@router.post("/code")
def get_code(body: CodeReq):
    # 记录日志到文件和控制台
    console.info("Get code for %s", body.username)
    # 生成6位数字的验证码
    code = generate_code()
    
    # 构建 Redis 键
    key = settings.REDIS_KEY_CODE_PREFIX + body.username
    
    # 保存验证码到 Redis，设置5分钟过期
    try:
        redis_client.set(key, code, expire=settings.REDIS_CODE_EXPIRE)
        console.info(f"Saved code {code} for user {body.username} to Redis with key: {key}")
        trans.info("Code generated and saved", extra={"extra_data": {"username": body.username, "code": code, "key": key}})
    except Exception as e:
        console.error(f"Failed to save code to Redis: {str(e)}")
        trans.error("Failed to save code to Redis", extra={"extra_data": {"username": body.username, "error": str(e)}})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate code for user"
        )
    # 返回成功响应
    return SuccessResponse(data=None, message=f"Code for {body.username} sent successfully")


def generate_code() -> str:
    """生成6位数字的验证码"""
    return str(random.randint(100000, 999999))
        

@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # 获取当前用户
    console.info("Logout attempt for user: %s", token)
    user = get_current_user(token=token, db=db)
    
    # 记录注销开始
    console.info(f"Logout attempt for user: {user.username} ({user.email})")
    trans.info("Logout attempt", extra={"extra_data": {"user_id": user.id, "username": user.username, "email": user.email}})
    
    # 构建 Redis 键
    key = settings.REDIS_KEY_LOGIN_PREFIX + str(user.id) + ':' + user.username
    
    # 尝试删除 Redis 键
    try:
        delete_result = redis_client.delete(key)
        if delete_result:
            console.info(f"Logout successful: deleted Redis key for user {user.username}")
            trans.info("Logout successful", extra={"extra_data": {"user_id": user.id, "username": user.username, "key": key}})
        else:
            console.warning(f"Logout: Redis key not found for user {user.username}")
            trans.warning("Logout: Redis key not found", extra={"extra_data": {"user_id": user.id, "username": user.username, "key": key}})
    except Exception as e:
        console.error(f"Logout error: {str(e)}")
        trans.error("Logout error", extra={"extra_data": {"user_id": user.id, "username": user.username, "error": str(e)}})
    
    # 获取当前时间
    logout_time = datetime.utcnow().isoformat() + "Z"
    
    # 返回成功响应
    return SuccessResponse(
        data={
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "logout_time": logout_time
        }, 
        message="Logout successful"
    )


@router.post("/qr-code")
def generate_qr_code(request: Request):
    """生成二维码用于扫码登录"""
    # 生成唯一的session_id
    session_id = str(uuid.uuid4())
    # 生成二维码内容（可以是任意唯一标识）
    qr_content = f"electorn_login:{session_id}"
    
    # 保存到Redis，状态为waiting
    key = settings.REDIS_KEY_QR_CODE_PREFIX + session_id
    value = json.dumps({
        "status": "waiting",
        "qr_content": qr_content,
        "created_at": datetime.now().timestamp()
    })
    
    try:
        redis_client.set(key, value, expire=settings.REDIS_QR_CODE_EXPIRE)
        console.info(f"QR code generated with session_id: {session_id}")
    except Exception as e:
        console.error(f"Failed to save QR code to Redis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate QR code"
        )
    
    return SuccessResponse(data={
        "session_id": session_id,
        "qr_content": qr_content,
        "expire_seconds": settings.REDIS_QR_CODE_EXPIRE
    })


@router.get("/qr-status/{session_id}")
async def check_qr_status(session_id: str, db: Session = Depends(get_db)):
    """查询二维码扫码状态（用于前端轮询）"""
    key = settings.REDIS_KEY_QR_CODE_PREFIX + session_id
    
    # 先等待一下，避免频繁请求
    await asyncio.sleep(1)
    
    # 从Redis获取状态
    value = redis_client.get(key)
    if not value:
        return SuccessResponse(data={
            "status": "expired",
            "message": "二维码已过期"
        })
    
    data = json.loads(value)
    current_status = data.get("status", "waiting")
    
    # 如果状态是confirmed，生成token并返回
    if current_status == "confirmed":
        user_id = data.get("user_id")
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            return SuccessResponse(data={
                "status": "expired",
                "message": "用户不存在"
            })
        
        # 创建访问令牌
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        
        # 将用户信息保存到redis
        login_key = settings.REDIS_KEY_LOGIN_PREFIX + str(user.id) + ':' + user.username
        login_value = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }
        redis_client.set(login_key, json.dumps(login_value), expire=settings.REDIS_LOGIN_EXPIRE)
        
        # 删除二维码记录
        redis_client.delete(key)
        
        return SuccessResponse(data={
            "status": "confirmed",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
            }
        })
    
    return SuccessResponse(data={
        "status": current_status,
        "message": f"二维码状态: {current_status}"
    })


@router.post("/qr-confirm")
def confirm_qr_code(body: QRCodeConfirmRequest, db: Session = Depends(get_db)):
    """手机端确认扫码登录"""
    key = settings.REDIS_KEY_QR_CODE_PREFIX + body.session_id
    
    # 从Redis获取状态
    value = redis_client.get(key)
    if not value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="二维码不存在或已过期"
        )
    
    data = json.loads(value)
    current_status = data.get("status", "waiting")
    
    if current_status == "expired":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="二维码已过期"
        )
    
    # 验证用户是否存在
    user = db.query(UserModel).filter(UserModel.id == body.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户不存在"
        )
    
    # 更新状态为confirmed
    data["status"] = "confirmed"
    data["user_id"] = body.user_id
    redis_client.set(key, json.dumps(data), expire=settings.REDIS_QR_CODE_EXPIRE)
    
    console.info(f"QR code confirmed by user: {user.username}")
    
    return SuccessResponse(data={
        "status": "confirmed",
        "message": "确认成功"
    })
