import React from 'react'

const Copyright: React.FC = () => (
  <div
    style={{
      textAlign: 'center',
      padding: '12px 24px',
      color: '#999',
      fontSize: '12px',
      background: '#fff',
      borderTop: '1px solid #f0f0f0',
      flexShrink: 0
    }}
  >
    © {new Date().getFullYear()} 12306 抢票助手. All rights reserved.
  </div>
)

export default Copyright
