import React, { useEffect, useState } from 'react'
import { TabProps } from '../common/constants'
import { useLocation } from 'react-router-dom'
import store from '@renderer/store'
import { ActionTypes } from '@renderer/store/types'

// tabs
import ChatMain from './tabs/ChatMain'

/** 从 localStorage 恢复登录用户信息到 store（登录页写入的字段名存在两种风格） */
const initUserFromStorage = (): void => {
  const raw = localStorage.getItem('userInfo')
  if (!raw) return
  try {
    const info = JSON.parse(raw)
    store.dispatch({
      type: ActionTypes.SET_COOKIES,
      payload: {
        userId: String(info.userId ?? info.user_id ?? ''),
        name: info.userName ?? info.username ?? info.name ?? '',
        avatar: info.avatar ?? ''
      }
    })
  } catch (e) {
    console.error('Parse userInfo failed:', e)
  }
}

// 模块加载时立即恢复用户信息：子组件的 useEffect 先于父组件执行，
// 放在挂载 effect 中会导致首次拉取聊天列表时 userId 仍为空
initUserFromStorage()

const ChatTabList: TabProps[] = [
  {
    key: '/chat',
    title: '聊天',
    component: <ChatMain />
  },
  {
    key: '/chatlist',
    title: '聊天列表',
    component: <div>聊天列表</div>
  }
]

const Chat: React.FC = () => {
  const [item, setItem] = useState<TabProps>(ChatTabList[0])
  const location = useLocation()

  useEffect(() => {
    console.log('useEffect', location.pathname)
    const infoMgrItem = ChatTabList.find((item) => item.key === location.pathname) // 找到匹配的 TabProps 对象
    if (infoMgrItem) {
      setItem(infoMgrItem) // 更新 item 状态
    } else {
      console.error(`No matching tab found for key: ${location.pathname}`)
    }
  }, [item, location])

  return <>{item.component}</>
}

export default Chat
