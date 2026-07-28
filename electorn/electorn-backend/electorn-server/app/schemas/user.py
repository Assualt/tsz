from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str
    # 验证码
    code: str
    time: datetime = datetime.now()


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    
    class Config:
        from_attributes = True


class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None

class CodeReq(BaseModel):
    username: str

class LoginRequest(BaseModel):
    username: str
    password: str

class QRCodeRequest(BaseModel):
    pass

class QRCodeStatusRequest(BaseModel):
    session_id: str

class QRCodeConfirmRequest(BaseModel):
    session_id: str
    user_id: int
