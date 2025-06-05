import React, { useEffect } from 'react'
import '../style.css'
import ChatList from './chatList'
import { ChatListProps } from './chatList/constants'
import { getChatList } from '@renderer/api/chat'
import { message } from 'antd'
import store from '@renderer/store'

const ChatSlider: React.FC = () => {
  /**
   * 聊天列表
   */
  const [chatList, setChatList] = React.useState<ChatListProps[]>([])

  useEffect(() => {
    const user = store.getState().user
    getChatList(user.userId)
      .then((res) => {
        setChatList(res.data.chatList || [])
      })
      .catch((err) => {
        message.info('获取聊天列表失败 : ' + err.message || '未知错误')
      })
  }, [])

  return (
    <>
      <ChatList data={chatList} />
    </>
  )
}

export default ChatSlider
