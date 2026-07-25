from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.schemas.response import ErrorResponse
from app.core.logging_config import trans
from app.core.config import settings
from jose import JWTError, jwt
from app.core.logging_config import console



class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            # 鉴权
            if not await self.check_need_auth(request):
                return await call_next(request)
            else:
                await self.check_auth_token(request)
                response = await call_next(request)
                return response
        except HTTPException as e:
            # 处理 HTTP 异常
            error_response = ErrorResponse(
                code=e.status_code,
                message=e.detail
            )
            trans.error(f"HTTP Exception: {e.detail}", extra={"extra_data": {"status_code": e.status_code}})
            return JSONResponse(
                status_code=e.status_code,
                content=error_response.model_dump()
            )
        except Exception as e:
            # 处理其他异常
            error_response = ErrorResponse(
                code=500,
                message=f"Internal Server Error: {str(e)}"
            )
            trans.error(f"Internal Server Error: {str(e)}")
            return JSONResponse(
                status_code=500,
                content=error_response.model_dump()
            )

    async def check_auth_token(self, request: Request):
        """检查认证令牌"""
        token = request.headers.get("Authorization")
        if token is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No Authorization header provided"
            )
        
        # 移除 Bearer 前缀（大小写不敏感）
        if token.lower().startswith("bearer "):
            token = token.split(" ", 1)[1]
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            console.info(f"Check auth token: {user_id}")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Authorization header"
                )
        except JWTError as e:
            console.info(f"Check auth token error: %s e:%s", token, e)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Authorization header"
            )

    async def check_need_auth(self, request: Request):
        """检查是否需要认证"""
        white_list = [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/auth/code',
            '/api/v1/static/user-agreement',
            '/api/v1/static/privacy-policy',
            '/api/v1/static/about'
        ]
        return request.url.path not in white_list
