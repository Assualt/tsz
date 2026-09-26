import React from 'react'

import ChatSlider from '../components/ChartSlider'
import ChatMainContent from '../components/ChatMainContent'

const ChatMain: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          width: 300,
          height: '100%',
          background: '#fff',
          flexShrink: 0,
          overflow: 'hidden',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <ChatSlider />
      </div>
      <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        <ChatMainContent />
      </div>
    </div>
  )
}

export default ChatMain
