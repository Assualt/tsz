import { StoreState, ActionTypes, InitialState } from './types'

export const reducer = (
  state: StoreState = InitialState,
  action: { type: ActionTypes; payload }
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
    case ActionTypes.REFRESH_CHAT_HISTORY:
      state.chat.needUpdate = action.payload
      return state

    case ActionTypes.SELECT_CHAT_ITEM:
      state.chat.needRefresh = action.payload
      return state

    case ActionTypes.STORE_SEND_CHAT:
      state.chat.sendChat = action.payload
      return state

    default:
      return state
  }
}
