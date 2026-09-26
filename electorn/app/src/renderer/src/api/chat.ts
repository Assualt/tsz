import { api } from './index'
import { ChatMessageInfo } from '@renderer/pages/chat/components/chatMessageItem/constants'

/** 聊天列表项（与后端 /chat/getChatList 返回字段对齐） */
export interface ChatListItem {
  id: number | string
  title: string
  time: string
  content: string
  avatar: string
  muted: boolean
  unread: number
}

type UserId = number | string
type ChatId = number | string

/** 获取用户的聊天会话列表 */
export const getChatList = async (userId: UserId) => {
  return api.post('/chat/getChatList', { userId: Number(userId) })
}

/** 获取指定会话的历史消息（点击会话后调用） */
export const getChatHistory = async (userId: UserId, chatId: ChatId) => {
  return api.post('/chat/getChatHistory', { userId: Number(userId), chatId: Number(chatId) })
}

/** 发送聊天消息，返回服务端落库后的消息（isSelf=true） */
export const sendChatMessage = async (
  userId: UserId,
  chatId: ChatId,
  content: string,
  msgType: number = 0
): Promise<{ data: ChatMessageInfo }> => {
  return api.post('/chat/sendChatMessage', {
    userId: Number(userId),
    chatId: Number(chatId),
    content,
    msgType
  })
}
