from pydantic import BaseModel
from typing import Optional, Any


class BaseResponse(BaseModel):
    code: int
    message: str
    data: Optional[Any] = None


class SuccessResponse(BaseResponse):
    total: Optional[int] = None
    page_num: Optional[int] = None
    cur_page: Optional[int] = None
    
    def __init__(self, data: Any = None, message: str = "success", total: Optional[int] = None, page_num: Optional[int] = None, cur_page: Optional[int] = None):
        super().__init__(
            code=200,
            message=message,
            data=data
        )
        if total is not None:
            self.total = total
        if page_num is not None:
            self.page_num = page_num
        if cur_page is not None:
            self.cur_page = cur_page
    
    def model_dump(self, **kwargs):
        # 排除为 None 的字段
        kwargs.setdefault('exclude_none', True)
        return super().model_dump(**kwargs)


class ErrorResponse(BaseResponse):
    def __init__(self, code: int, message: str, data: Any = None):
        super().__init__(
            code=code,
            message=message,
            data=data
        )
