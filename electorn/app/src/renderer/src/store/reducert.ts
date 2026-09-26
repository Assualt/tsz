import { StoreState, ActionTypes, InitialState } from './types'

export const reducer = (
  state: StoreState = InitialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: { type: ActionTypes; payload?: any }
): StoreState => {
  switch (action.type) {
    case ActionTypes.SET_COOKIES:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }

    // 选中某个会话：记录会话ID与标题，消息区据此按需加载历史
    case ActionTypes.SELECT_CHAT_ITEM:
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedChatId: action.payload?.id,
          selectedChatTitle: action.payload?.title ?? state.chat.selectedChatTitle
        }
      }

    // 聊天历史刷新计数 +1（如发送消息成功后）
    case ActionTypes.REFRESH_CHAT_HISTORY:
      return {
        ...state,
        chat: {
          ...state.chat,
          refreshTick: state.chat.refreshTick + 1
        }
      }

    // 保存待发送的消息内容，消息区据此做乐观追加；payload 为空字符串表示清空
    case ActionTypes.STORE_SEND_CHAT:
      return {
        ...state,
        chat: {
          ...state.chat,
          sendChat: action.payload
        }
      }

    default:
      return state
  }
}
