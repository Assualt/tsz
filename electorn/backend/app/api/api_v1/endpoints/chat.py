from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.logging_config import console
from app.core.logging_config import trans
from app.schemas.response import SuccessResponse
from app.models.chat import ChatConversation, ChatMessage
from app.models.user import User
from app.dto.chat import ChatListRequest, ChatHistoryRequest, ChatSendRequest
from app.services.ai_service import (
    AI_AVATAR,
    AI_CONVERSATION_TYPE,
    AI_SENDER_ID,
    AI_SENDER_NAME,
    AI_WELCOME,
    generate_ai_reply,
    maybe_simulate_typing_delay
)


router = APIRouter()

# 消息类型 -> 列表摘要文案
MSG_TYPE_SUMMARY = {
    1: "[图片]",
    2: "[文件]",
    3: "[语音]",
    4: "[视频]",
    5: "[链接]"
}


def _format_time(value) -> str:
    """统一时间序列化，兼容 datetime 与字符串（兼容历史数据）"""
    if value is None:
        return ""
    if isinstance(value, str):
        return value
    if hasattr(value, "strftime"):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    return str(value)


def _conversation_out(conv: ChatConversation) -> dict:
    """会话列表项，字段与前端 ChatListProps 对齐"""
    return {
        "id": conv.id,
        "title": conv.title,
        "avatar": conv.avatar or "",
        "content": conv.last_message or "",
        "time": _format_time(conv.last_message_at or conv.created_at),
        "muted": bool(conv.muted),
        "unread": conv.unread or 0
    }


def _message_out(msg: ChatMessage, current_user_id: int) -> dict:
    """消息项，字段与前端 ChatMessageInfo 对齐；is_self 按请求用户动态计算"""
    return {
        "id": str(msg.id),
        "name": msg.sender_name,
        "nickName": msg.sender_name,
        "avatar": msg.sender_avatar or "",
        "content": msg.content,
        "time": _format_time(msg.created_at),
        "msgType": msg.msg_type or 0,
        "isSelf": msg.sender_id == current_user_id,
        "fileInfo": msg.file_info
    }


def _ensure_ai_conversation(db: Session, user_id: int) -> ChatConversation:
    """确保用户拥有一个默认的 AI 助手会话（不存在则创建并写入欢迎语）。

    任何用户拉取聊天列表时都会触发，实现"默认自带 AI 助手"。
    """
    ai_conv = db.query(ChatConversation).filter(
        ChatConversation.user_id == user_id,
        ChatConversation.conversation_type == AI_CONVERSATION_TYPE
    ).first()
    if ai_conv is not None:
        return ai_conv

    now = datetime.now()
    ai_conv = ChatConversation(
        user_id=user_id,
        target_id=None,
        title=AI_SENDER_NAME,
        avatar=AI_AVATAR,
        conversation_type=AI_CONVERSATION_TYPE,
        muted=False,
        unread=0,
        last_message=AI_WELCOME,
        last_message_at=now,
        created_at=now,
        updated_at=now
    )
    db.add(ai_conv)
    db.flush()  # 取得 ai_conv.id

    welcome = ChatMessage(
        conversation_id=ai_conv.id,
        sender_id=AI_SENDER_ID,
        sender_name=AI_SENDER_NAME,
        sender_avatar=AI_AVATAR,
        msg_type=0,
        content=AI_WELCOME,
        created_at=now
    )
    db.add(welcome)
    db.commit()
    db.refresh(ai_conv)
    return ai_conv


@router.post("/getChatList")
def get_chat_list(req: ChatListRequest, db: Session = Depends(get_db)):
    """获取用户的聊天会话列表。

    AI 助手会话为每个用户默认存在且固定置顶，其余会话按最后消息时间倒序。
    """
    # 默认 AI 助手会话不存在时自动创建（含欢迎语）
    _ensure_ai_conversation(db, req.userId)

    # AI 会话置顶（布尔表达式在 SQLite/MySQL 中均可排序）；
    # IS NULL 表达式保证无消息的会话排在最后
    conversations = (
        db.query(ChatConversation)
        .filter(ChatConversation.user_id == req.userId)
        .order_by((ChatConversation.conversation_type == AI_CONVERSATION_TYPE).desc(),
                  ChatConversation.last_message_at.is_(None),
                  ChatConversation.last_message_at.desc(),
                  ChatConversation.updated_at.desc())
        .all()
    )

    chat_list = [_conversation_out(conv) for conv in conversations]

    console.info("Get chat list", extra={"extra_data": {"user_id": req.userId, "count": len(chat_list)}})
    trans.info("Get chat list", extra={"extra_data": {"user_id": req.userId, "count": len(chat_list)}})

    return SuccessResponse(data={"chatList": chat_list})


@router.post("/getChatHistory")
def get_chat_history(req: ChatHistoryRequest, db: Session = Depends(get_db)):
    """获取指定会话的历史消息；进入会话时未读数清零"""
    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == req.chatId,
        ChatConversation.user_id == req.userId
    ).first()
    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat conversation {req.chatId} not found"
        )

    query = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == req.chatId)
        .order_by(ChatMessage.id.asc())
    )
    if req.page and req.per_page:
        messages = query.limit(req.per_page).offset((req.page - 1) * req.per_page).all()
    else:
        messages = query.all()

    hist_list = [_message_out(msg, req.userId) for msg in messages]

    # 进入会话，未读数清零
    if conversation.unread:
        conversation.unread = 0

    console.info("Get chat history",
                 extra={"extra_data": {"user_id": req.userId, "chat_id": req.chatId, "count": len(hist_list)}})
    trans.info("Get chat history",
               extra={"extra_data": {"user_id": req.userId, "chat_id": req.chatId, "count": len(hist_list)}})

    return SuccessResponse(data={"histList": hist_list})


@router.post("/sendChatMessage")
def send_chat_message(req: ChatSendRequest, db: Session = Depends(get_db)):
    """发送消息：写入消息表并刷新会话摘要"""
    if not req.content or not req.content.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message content cannot be empty")

    if req.msgType not in MSG_TYPE_SUMMARY and req.msgType != 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Invalid msgType: {req.msgType}")

    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == req.chatId,
        ChatConversation.user_id == req.userId
    ).first()
    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat conversation {req.chatId} not found"
        )

    # 发送者信息：优先取 users 表用户名，头像表中暂无该字段，使用 dicebear 生成
    sender = db.query(User).filter(User.id == req.userId).first()
    sender_name = sender.username if sender else f"用户{req.userId}"
    sender_avatar = f"https://api.dicebear.com/7.x/miniavs/svg?seed={req.userId}&size=64"

    file_info = None
    if req.msgType == 2:
        file_info = {
            "name": req.fileName or "未知文件",
            "size": req.fileSize or 0,
            "type": req.fileType or ""
        }

    content = req.content.strip()
    message = ChatMessage(
        conversation_id=req.chatId,
        sender_id=req.userId,
        sender_name=sender_name,
        sender_avatar=sender_avatar,
        msg_type=req.msgType,
        content=content,
        file_info=file_info
    )
    db.add(message)

    # 普通会话：摘要为用户消息；AI 会话稍后更新为 AI 的回复
    conversation.last_message = (
        MSG_TYPE_SUMMARY.get(req.msgType, content)
        if req.msgType != 0 else content
    )[:512]
    conversation.last_message_at = datetime.now()

    # AI 助手会话：同步生成一条 AI 回复（前端发送成功后会重新拉取历史，两条消息一并展示）
    ai_reply_message = None
    console.info(f"Sending chat message: {conversation.conversation_type} {req.msgType}")
    if conversation.conversation_type == AI_CONVERSATION_TYPE and req.msgType == 0:
        db.flush()  # 先落库用户消息，保证消息顺序（用户消息 id 在前）
        maybe_simulate_typing_delay()  # 规则回退模式下模拟"思考中"，真实模型调用本身有网络耗时
        ai_reply = generate_ai_reply(content)
        ai_reply_message = ChatMessage(
            conversation_id=req.chatId,
            sender_id=AI_SENDER_ID,
            sender_name=AI_SENDER_NAME,
            sender_avatar=AI_AVATAR,
            msg_type=0,
            content=ai_reply,
            created_at=datetime.now()
        )
        db.add(ai_reply_message)
        conversation.last_message = ai_reply[:512]
        conversation.last_message_at = datetime.now()

    db.commit()
    db.refresh(message)

    result = _message_out(message, req.userId)
    if ai_reply_message is not None:
        db.refresh(ai_reply_message)
        result["aiReply"] = _message_out(ai_reply_message, req.userId)

    console.info("Send chat message",
                 extra={"extra_data": {"user_id": req.userId, "chat_id": req.chatId, "msg_id": message.id}})
    trans.info("Send chat message",
               extra={"extra_data": {"user_id": req.userId, "chat_id": req.chatId, "msg_id": message.id}})

    return SuccessResponse(data=result)
