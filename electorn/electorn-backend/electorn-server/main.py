from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect
from app.core.config import settings
from app.api.api_v1.router import api_router
from app.core.database import engine, Base
from app.utils.logging import log_request
from app.utils.exception import ExceptionMiddleware
from app.schemas.response import SuccessResponse

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 自动迁移：为已有表添加缺失的列
def migrate_add_columns():
    inspector = inspect(engine)
    if "orders" not in inspector.get_table_names():
        return
    columns = [col["name"] for col in inspector.get_columns("orders")]
    with engine.connect() as conn:
        if "passenger_count" not in columns:
            conn.execute(text("ALTER TABLE orders ADD COLUMN passenger_count INTEGER DEFAULT 1"))
            conn.commit()
migrate_add_columns()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加日志中间件
app.middleware("http")(log_request)

# 添加异常处理中间件
app.add_middleware(ExceptionMiddleware)

# 注册路由
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return SuccessResponse(data={"message": "Welcome to Electorn Backend API"})


@app.get("/health")
def health_check():
    return SuccessResponse(data={"status": "healthy"})
