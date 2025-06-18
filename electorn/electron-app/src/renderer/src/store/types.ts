// 定义存储状态的接口
export interface StoreState {
  user: {
    name: string
    avatar: string
    userId: string
  }
  chat: {
    needUpdate: boolean // 消息发送后更新字段
    needRefresh: boolean // 刷新消息列表字段
    sendChat: string // 保存发送的消息
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
    needUpdate: false,
    needRefresh: false,
    sendChat: '' // 初始化 sendChat 字段
  }
}

// 定义 action 类型的枚举
export enum ActionTypes {
  SET_COOKIES = 'SET_COOKIES',
  REFRESH_CHAT_HISTORY = 'REFRESH_CHAT_HISTORY',
  SELECT_CHAT_ITEM = 'SELECT_CHAT_ITEM',
  STORE_SEND_CHAT = 'STORE_SEND_CHAT' // 保存发送的消息
}
