import { api } from './index'

export const getChatMessages = async (userId: string) => {
  return api.post('/chat/getChatMessages', { userId })
}
