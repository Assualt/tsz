import Layout from 'antd/es/layout/layout'
import { Content } from 'antd/es/layout/layout'
import './style.css'
import ChatMessageItem from './chatMessageItem'
import { ChatMessageInfo } from './chatMessageItem/constants'
import { Divider } from 'antd'
import { getChatHistory } from '@renderer/api/chat'
import { message } from 'antd'
import { useEffect, useState } from 'react'

const ChatMessageBox: React.FC = () => {
  const [chatMessageList, setChatMessageList] = useState<ChatMessageInfo[]>([])

  const fetchChatHistory = (): void => {
    // 实现获取聊天历史消息的逻辑
    // 可以调用API获取聊天历史消息
    // 然后更新chatMessageList状态
    getChatHistory('testId', '1234567890')
      .then((res) => {
        setChatMessageList(res.data.histList || [])
      })
      .catch((err) => {
        message.info('获取聊天历史消息失败 :' + err.message || '未知错误')
      })
  }

  useEffect(() => {
    fetchChatHistory()
  }, [])

  const showMessageItem = (message: ChatMessageInfo, index: number): JSX.Element => {
    return (
      <>
        {index == 0 && <Divider style={{ margin: '0' }}>以上是历史消息</Divider>}
        <ChatMessageItem message={message} key={message.id} />
      </>
    )
  }

  return (
    <>
      <Layout className="chat-layout">
        <Content className="chat-content">
          {chatMessageList.map((item: ChatMessageInfo, index: number) => {
            return showMessageItem(item, index)
          })}
        </Content>
      </Layout>
    </>
  )
}

export default ChatMessageBox
