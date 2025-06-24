import React from 'react'
import './style.css'
import { FileUnknownFilled } from '@ant-design/icons'

const MediaCard: React.FC = () => {
  const fileName = 'clash_for_android_2.5.12.apk'
  return (
    <div
      className="media-card beautiful-layout"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <div
        className="file-info beautiful-info"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 2
        }}
      >
        <div className="file-name">{fileName}</div>
        <span className="file-size beautiful-size">34.4 MB</span>
      </div>
      <div className="file-icon" title={fileName}>
        <FileUnknownFilled style={{ fontSize: '48px' }} />
      </div>
    </div>
  )
}

export default MediaCard
