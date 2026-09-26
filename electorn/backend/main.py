from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, inspect
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.core.config import settings
from app.api.api_v1.router import api_router
from app.core.database import engine, Base
from app.utils.logging import log_request
from app.utils.exception import ExceptionMiddleware
from app.schemas.response import SuccessResponse
from app.models.chat import ChatConversation, ChatMessage

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


def seed_chat_data():
    """首次启动时初始化聊天演示数据（仅当会话表为空时执行）"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        if db.query(ChatConversation).count() > 0:
            return

        now = datetime.now()
        avatar = lambda seed: f"https://api.dicebear.com/7.x/miniavs/svg?seed={seed}&size=64"

        # 演示数据归属真实存在的用户（users.id=2，username=123）
        demo_user_id = 2

        # 会话 1：群聊「雇佣军(5)」，有未读
        conv1 = ChatConversation(
            user_id=demo_user_id, title="雇佣军(5)", avatar=avatar("army"),
            conversation_type="group", muted=False, unread=2,
            created_at=now - timedelta(days=10), updated_at=now - timedelta(minutes=5)
        )
        # 会话 2：单聊「张三」
        conv2 = ChatConversation(
            user_id=demo_user_id, title="张三", avatar=avatar("zhangsan"),
            conversation_type="single", muted=False, unread=0,
            created_at=now - timedelta(days=30), updated_at=now - timedelta(hours=2)
        )
        # 会话 3：群聊「产品设计交流群(12)」，免打扰
        conv3 = ChatConversation(
            user_id=demo_user_id, title="产品设计交流群(12)", avatar=avatar("design"),
            conversation_type="group", muted=True, unread=0,
            created_at=now - timedelta(days=60), updated_at=now - timedelta(days=1)
        )
        db.add_all([conv1, conv2, conv3])
        db.flush()

        def msg(conv, sender_id, sender_name, seed, content, minutes_ago, msg_type=0, file_info=None):
            return ChatMessage(
                conversation_id=conv.id, sender_id=sender_id,
                sender_name=sender_name, sender_avatar=avatar(seed),
                msg_type=msg_type, content=content, file_info=file_info,
                created_at=now - timedelta(minutes=minutes_ago)
            )

        db.add_all([
            msg(conv1, 3, "老李", "laoli", "今晚八点开黑，老地方集合", 48),
            msg(conv1, demo_user_id, "123", "2", "收到，我吃完饭就上线", 42),
            msg(conv1, 4, "阿强", "aqiang", "我新练了个英雄，带你们飞", 40),
            msg(conv1, 3, "老李", "laoli", "别坑啊哈哈", 38),
            msg(conv1, 4, "阿强", "aqiang", "[图片]", 5, msg_type=1),
            msg(conv2, 3, "张三", "zhangsan", "车票帮我看一下周五去上海的", 130),
            msg(conv2, demo_user_id, "123", "2", "好的，G字头高铁有好几班，稍后发你", 125),
            msg(conv2, 3, "张三", "zhangsan", "多谢，二等座就行", 120),
            msg(conv3, 5, "设计喵", "designer", "新版圆角规范同步在群文件了，大家查收", 1500),
            msg(conv3, demo_user_id, "123", "2", "收到，气泡圆角统一到 12px 了", 1480),
        ])

        conv1.last_message = "[图片]"
        conv1.last_message_at = now - timedelta(minutes=5)
        conv2.last_message = "多谢，二等座就行"
        conv2.last_message_at = now - timedelta(hours=2)
        conv3.last_message = "收到，气泡圆角统一到 12px 了"
        conv3.last_message_at = now - timedelta(days=1)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

seed_chat_data()

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
