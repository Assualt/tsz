// 定义存储状态的接口
export interface StoreState {
  user: {
    name: string
    avatar: string
    userId: string
  }
  chat: {
    selectedChatId: number | string | null // 当前选中的会话ID，null 表示未选中
    selectedChatTitle: string // 当前选中的会话标题
    sendChat: string // 保存待发送的消息（乐观更新）
    refreshTick: number // 聊天历史刷新计数，发送消息成功后自增触发重新拉取
  }
}

// 定义初始状态
export const InitialState: StoreState = {
  user: {
    name: '',
    avatar: '',
    userId: ''
  },
  chat: {
    selectedChatId: null,
    selectedChatTitle: '',
    sendChat: '',
    refreshTick: 0
  }
}

// 定义 action 类型的枚举
export enum ActionTypes {
  SET_COOKIES = 'SET_COOKIES',
  REFRESH_CHAT_HISTORY = 'REFRESH_CHAT_HISTORY',
  SELECT_CHAT_ITEM = 'SELECT_CHAT_ITEM',
  STORE_SEND_CHAT = 'STORE_SEND_CHAT' // 保存发送的消息
}
