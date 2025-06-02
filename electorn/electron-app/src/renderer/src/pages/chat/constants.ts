export enum MessageType {
  TEXT,
  IMAGE,
  FILE,
  AUDIO,
  VIDEO,
  LINK
}

export interface ChatMessageInfo {
  id: string
  name: string
  nickName: string
  avatar: string
  content: string
  time: string
  msgType: MessageType
  isSelf: boolean
  fileInfo?: {
    name: string
    size: number
    type: string
  }
}
