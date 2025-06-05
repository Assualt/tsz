// 定义存储状态的接口
export interface StoreState {
  user: {
    name: string
    avatar: string
    userId: string
  }
  chat: {
    needUpdate: boolean // 消息发送后更新字段
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
    needUpdate: false
  }
}

// 定义 action 类型的枚举
export enum ActionTypes {
  SET_COOKIES = 'SET_COOKIES',
  REFRESH_CHAT_HISTORY = 'REFRESH_CHAT_HISTORY'
}
