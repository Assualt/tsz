import './style.css'
import ChatMessageItem from './chatMessageItem'
import { ChatMessageInfo } from './chatMessageItem/constants'
import { Divider, Empty, Spin } from 'antd'
import { getChatHistory } from '@renderer/api/chat'
import { message } from 'antd'
import { Fragment, useEffect, useRef, useState } from 'react'
import store from '@renderer/store'
import { MessageType } from '../constants'

const ChatMessageBox: React.FC = () => {
  const [chatMessageList, setChatMessageList] = useState<ChatMessageInfo[]>([])
  const [selectedChatId, setSelectedChatId] = useState<number | string | null>(null)
  const [refreshTick, setRefreshTick] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const messageListRef = useRef<HTMLDivElement>(null)

  /** 拉取指定会话的历史消息 */
  const fetchChatHistory = (chatId: number | string): void => {
    const user = store.getState().user
    setLoading(true)
    getChatHistory(user.userId, chatId)
      .then((res) => {
        setChatMessageList(res.data.histList || [])
      })
      .catch((err) => {
        message.info('获取聊天历史消息失败 :' + err.message || '未知错误')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 订阅 store：同步当前选中会话、刷新计数，并处理发送消息的乐观追加
  useEffect(() => {
    const syncState = (): void => {
      const state = store.getState()
      setSelectedChatId(state.chat.selectedChatId)
      setRefreshTick(state.chat.refreshTick)
      // 有待发送内容时先乐观追加一条，接口成功后通过 refreshTick 重新拉取对齐
      if (state.chat.sendChat) {
        setChatMessageList((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            name: state.user.name,
            nickName: state.user.name,
            avatar: state.user.avatar,
            content: state.chat.sendChat,
            time: new Date().toLocaleString('zh-CN', { hour12: false }),
            msgType: MessageType.TEXT,
            isSelf: true,
            isSending: true
          }
        ])
      }
    }
    // 初始化同步一次，处理进入页面时已有选中会话的情况
    syncState()
    const unsubscribe = store.subscribe(syncState)
    return (): void => {
      unsubscribe()
    }
  }, [])

  // 只有用户点击会话（selectedChatId 变化）或主动刷新时才加载消息
  useEffect(() => {
    if (selectedChatId === null || selectedChatId === '') {
      setChatMessageList([])
      return
    }
    fetchChatHistory(selectedChatId)
  }, [selectedChatId, refreshTick])

  // 消息列表变化时自动滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [chatMessageList])

  const showMessageItem = (msg: ChatMessageInfo, index: number): JSX.Element => {
    return (
      <Fragment key={msg.id + '-' + index}>
        {index == 0 && <Divider style={{ margin: '0' }}>以上是历史消息</Divider>}
        <ChatMessageItem message={msg} />
      </Fragment>
    )
  }

  // 未选择会话：空态引导，不请求任何消息数据
  if (selectedChatId === null || selectedChatId === '') {
    return (
      <div className="chat-message-box chat-message-box-empty">
        <Empty description="选择一个聊天，开始对话" />
      </div>
    )
  }

  return (
    <div className="chat-message-box" ref={messageListRef}>
      {loading ? (
        <div className="chat-message-box-loading">
          <Spin />
        </div>
      ) : (
        chatMessageList.map((item: ChatMessageInfo, index: number) => {
          return showMessageItem(item, index)
        })
      )}
    </div>
  )
}

export default ChatMessageBox
