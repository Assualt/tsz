import React, { useEffect, useState } from 'react'
import { TabProps } from '../common/constants'
import { useLocation } from 'react-router-dom'

// tabs
import ChatMain from './tabs/ChatMain'

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
