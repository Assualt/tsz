import React, { useEffect, useState } from 'react'
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
  const [selectedId, setSelectedId] = useState<number | string | null>(null)

  // 拉取聊天列表（首次进入、发送消息后 refreshTick 变化时都会调用）
  const loadChatList = (): void => {
    const user = store.getState().user
    if (!user.userId) {
      return
    }
    getChatList(user.userId)
      .then((res) => {
        setChatList(res.data.chatList || [])
      })
      .catch((err) => {
        message.info('获取聊天列表失败 : ' + err.message || '未知错误')
      })
  }

  useEffect(() => {
    loadChatList()
  }, [])

  // 订阅 store，回显当前选中的会话高亮；进入会话即时清掉未读红点（后端已同步清零）；
  // refreshTick 变化（发送消息后）重新拉取列表，刷新最后消息摘要与时间
  useEffect(() => {
    let lastTick = store.getState().chat.refreshTick
    const syncSelected = (): void => {
      const { selectedChatId: id, refreshTick } = store.getState().chat
      setSelectedId(id)
      if (id !== null && id !== '') {
        setChatList((prev) =>
          prev.map((item) => (item.id === id && item.unread !== 0 ? { ...item, unread: 0 } : item))
        )
      }
      if (refreshTick !== lastTick) {
        lastTick = refreshTick
        loadChatList()
      }
    }
    syncSelected()
    const unsubscribe = store.subscribe(syncSelected)
    return (): void => {
      unsubscribe()
    }
  }, [])

  return (
    <>
      <ChatList data={chatList} selectedId={selectedId} />
    </>
  )
}

export default ChatSlider
