import redis
from app.core.config import settings
from app.core.logging_config import console


class RedisClient:
    def __init__(self):
        self.redis_client = None
        self.connect()

    def connect(self):
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                db=settings.REDIS_DB,
                password=settings.REDIS_PASSWORD,
                decode_responses=True
            )
            # 测试连接
            self.redis_client.ping()
            console.info("Redis connected successfully")
        except Exception as e:
            console.error(f"Failed to connect to Redis: {e}")

    def get(self, key):
        try:
            return self.redis_client.get(key)
        except Exception as e:
            console.error(f"Redis get error: {e}")
            return None

    def set(self, key, value, expire=None):
        try:
            if expire:
                self.redis_client.setex(key, expire, value)
            else:
                self.redis_client.set(key, value)
            return True
        except Exception as e:
            console.error(f"Redis set error: {e}")
            return False

    def delete(self, key):
        try:
            self.redis_client.delete(key)
            return True
        except Exception as e:
            console.error(f"Redis delete error: {e}")
            return False

    def exists(self, key):
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            console.error(f"Redis exists error: {e}")
            return False


# 创建 Redis 客户端实例
redis_client = RedisClient()
