import React from 'react'
import { Layout } from 'antd'

import ChatSlider from '../components/ChartSlider'
import ChatMainContent from '../components/ChatMainContent'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'

const ChatMain: React.FC = () => {
  return (
    <>
      <Layout>
        <Sider width={300} style={{ background: '#fff' }}>
          <ChatSlider />
        </Sider>
        <Content style={{ padding: '0 24px' }}>
          <ChatMainContent />
        </Content>
      </Layout>
    </>
  )
}

export default ChatMain
