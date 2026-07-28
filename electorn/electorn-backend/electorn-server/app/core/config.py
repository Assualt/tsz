from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Electorn Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str = "sqlite:///./electorn.db"
    ALGORITHM: str = "HS256"
    
    # Redis 配置
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = "123456"
    
    # Redis Key 配置
    REDIS_KEY_LOGIN_PREFIX: str = "login:"
    REDIS_KEY_CODE_PREFIX: str = "code:"
    REDIS_KEY_SESSION_PREFIX: str = "session:"
    REDIS_KEY_QR_CODE_PREFIX: str = "qr_code:"
    
    # Redis 过期时间配置（秒）
    REDIS_LOGIN_EXPIRE: int = 3600  # 1小时
    REDIS_CODE_EXPIRE: int = 300  # 5分钟
    REDIS_SESSION_EXPIRE: int = 86400  # 24小时
    REDIS_QR_CODE_EXPIRE: int = 60  # 二维码1分钟过期

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
