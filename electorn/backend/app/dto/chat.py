from pydantic import BaseModel
from typing import Optional


class ChatListRequest(BaseModel):
    """聊天列表请求"""
    userId: int


class ChatHistoryRequest(BaseModel):
    """聊天历史消息请求"""
    userId: int
    chatId: int
    # 分页（可选），不传则返回全部历史
    page: Optional[int] = None
    per_page: Optional[int] = None


class ChatSendRequest(BaseModel):
    """发送聊天消息请求"""
    userId: int
    chatId: int
    content: str
    # 消息类型：0文本 1图片 2文件 3音频 4视频 5链接
    msgType: Optional[int] = 0
    # 文件类消息附加信息
    fileName: Optional[str] = None
    fileSize: Optional[int] = None
    fileType: Optional[str] = None
