import redis
from app.core.config import settings

# 直接测试 Redis 连接
print("Testing Redis connection...")
print(f"Redis host: {settings.REDIS_HOST}")
print(f"Redis port: {settings.REDIS_PORT}")
print(f"Redis db: {settings.REDIS_DB}")
print(f"Redis password: {settings.REDIS_PASSWORD}")

try:
    # 创建 Redis 客户端
    r = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD,
        decode_responses=True
    )
    # 测试连接
    r.ping()
    print("Redis connected successfully!")
    
    # 测试设置和获取键值对
    key = "test_key"
    value = "test_value"
    
    # 设置键值对
    print(f"Setting key: {key}, value: {value}")
    r.set(key, value)
    print("Set operation completed")
    
    # 获取键值对
    print(f"Getting key: {key}")
    retrieved_value = r.get(key)
    print(f"Retrieved value: {retrieved_value}")
    
    # 测试键是否存在
    print(f"Checking if key exists: {key}")
    exists = r.exists(key)
    print(f"Key exists: {exists}")
    
    # 测试删除键
    print(f"Deleting key: {key}")
    r.delete(key)
    print("Delete operation completed")
    
    # 再次检查键是否存在
    print(f"Checking if key exists after deletion: {key}")
    exists_after_delete = r.exists(key)
    print(f"Key exists after deletion: {exists_after_delete}")
    
    print("Redis test completed successfully!")
except Exception as e:
    print(f"Redis connection failed: {e}")
