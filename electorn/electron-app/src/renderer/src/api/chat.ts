import { api } from './index'

export const getChatList = async (userId: string) => {
  return api.post('/chat/getChatList', { userId })
}

export const getChatHistory = async (userId: string, chatId: string) => {
  return api.post('/chat/getChatHistory', { userId, chatId })
}

export const sendChatMessage = async (userId: string, chatId: string, content: string) => {
  return api.post('/chat/sendChatMessage', { userId, chatId, content })
}
