export interface ChatListProps {
  // 会话ID（与后端 chat_conversations.id 对齐）
  id: number | string
  title: string
  time: string
  avatar: string
  content: string
  muted: boolean
  unread: number
}
