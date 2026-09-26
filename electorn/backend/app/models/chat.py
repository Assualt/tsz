from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime


class ChatConversation(Base):
    """聊天会话表

    一个用户对应多个会话（单聊 / 群聊），会话用于左侧聊天列表展示，
    last_message / unread 为冗余字段，避免拉取列表时聚合消息表。
    """
    __tablename__ = "chat_conversations"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True, comment='会话ID，主键')
    user_id = Column(Integer, index=True, nullable=False, comment='会话所属用户ID（逻辑外键 users.id）')
    target_id = Column(Integer, nullable=True, comment='单聊对象用户ID，群聊为空')
    title = Column(String(128), nullable=False, comment='会话标题（对方昵称 / 群名称）')
    avatar = Column(String(512), nullable=True, comment='会话头像URL')
    conversation_type = Column(String(16), default='single', nullable=False,
                               comment='会话类型：single-单聊 group-群聊 ai-AI助手（每用户默认一个）')
    muted = Column(Boolean, default=False, nullable=False, comment='是否消息免打扰')
    unread = Column(Integer, default=0, nullable=False, comment='未读消息数')
    last_message = Column(String(512), nullable=True, comment='最后一条消息摘要')
    last_message_at = Column(DateTime, default=datetime.now, nullable=True, comment='最后一条消息时间')
    created_at = Column(DateTime, default=datetime.now, comment='创建时间')
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')

    messages = relationship(
        "ChatMessage",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="ChatMessage.id"
    )


class ChatMessage(Base):
    """聊天消息表

    发送者名称 / 头像冗余存储，保证用户信息变更后历史消息仍可正常展示。
    is_self 不入库，由接口根据请求用户与 sender_id 动态计算。
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True, comment='消息ID，主键')
    conversation_id = Column(
        Integer,
        ForeignKey("chat_conversations.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
        comment='所属会话ID'
    )
    sender_id = Column(Integer, index=True, nullable=False, comment='发送者用户ID（逻辑外键 users.id）')
    sender_name = Column(String(64), nullable=False, comment='发送者名称')
    sender_avatar = Column(String(512), nullable=True, comment='发送者头像URL')
    msg_type = Column(Integer, default=0, nullable=False,
                      comment='消息类型：0文本 1图片 2文件 3音频 4视频 5链接')
    content = Column(Text, nullable=False, comment='消息内容（文本 / 资源URL）')
    file_info = Column(JSON, nullable=True, comment='文件附加信息：{name, size, type}')
    created_at = Column(DateTime, default=datetime.now, index=True, comment='发送时间')

    conversation = relationship("ChatConversation", back_populates="messages")
