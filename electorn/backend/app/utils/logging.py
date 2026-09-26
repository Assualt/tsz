from datetime import datetime
from fastapi import Request, Response
from app.core.logging_config import trans


async def log_request(request: Request, call_next):
    # 记录请求开始
    request_start = datetime.utcnow()
    
    # 处理请求
    response = await call_next(request)
    
    # 记录请求结束
    request_end = datetime.utcnow()
    duration = (request_end - request_start).total_seconds() * 1000
    
    # 构建日志数据
    log_data = {
        "request_method": request.method,
        "request_url": str(request.url),
        "request_headers": dict(request.headers),
        "response_status": response.status_code,
        "response_headers": dict(response.headers),
        "duration_ms": duration
    }
    
    # 记录日志
    trans.info("Request processed", extra={"extra_data": log_data})
    
    return response
