from pathlib import Path

from pydantic_settings import BaseSettings
from typing import Optional

# .env 固定位于项目根目录（本文件向上三级），避免因 uvicorn 启动目录不同而读不到配置
ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


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

    # AI 助手模型配置（OpenAI 兼容接口）；AI_API_KEY 为空时回退内置规则回复
    AI_API_KEY: str = ""
    AI_BASE_URL: str = ""
    AI_MODEL: str = ""
    AI_TEMPERATURE: float = 0.7
    AI_MAX_TOKENS: int = 512
    AI_TIMEOUT: int = 30  # 模型请求超时（秒）

    class Config:
        env_file = ENV_FILE
        case_sensitive = True


settings = Settings()
