import ChatMessageBox from './ChatMessageBox'
import ChatInputBox from './ChatInputBox'
import { useEffect, useState } from 'react'
import store from '@renderer/store'

const ChatMainContent: React.FC = () => {
  const [chatTitle, setChatTitle] = useState<string>('')

  // 订阅当前选中会话标题
  useEffect(() => {
    const syncTitle = (): void => {
      const { chat } = store.getState()
      setChatTitle(chat.selectedChatId === null ? '' : chat.selectedChatTitle)
    }
    syncTitle()
    const unsubscribe = store.subscribe(syncTitle)
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* 聊天标题栏 - 固定高度 */}
      <div
        style={{
          height: '56px',
          flexShrink: 0,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '16px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fff'
        }}
      >
        <span>{chatTitle || '聊天'}</span>
      </div>
      {/* 消息区 + 输入区 - 弹性填充 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <ChatMessageBox />
        <ChatInputBox />
      </div>
    </div>
  )
}

export default ChatMainContent
