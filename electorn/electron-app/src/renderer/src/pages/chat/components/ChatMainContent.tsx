import ChatMessageBox from './ChatMessageBox'
import ChatInputBox from './ChatInputBox'
import { Divider, Layout } from 'antd'
import { useState } from 'react'

const { Header, Content } = Layout

const ChatMainContent: React.FC = () => {
  const [needUpdate, setNeedUpdate] = useState<boolean>(false)

  return (
    <>
      <Layout>
        <Header
          style={{
            background: '#fff',
            margin: '0',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bolder',
            fontSize: '16px'
          }}
        >
          <span>雇佣军(5)</span>
        </Header>
        <Divider style={{ margin: '0' }} />
        <Content>
          <ChatMessageBox />
          <Divider style={{ margin: '0' }} />
          <ChatInputBox />
        </Content>
      </Layout>
    </>
  )
}

export default ChatMainContent
