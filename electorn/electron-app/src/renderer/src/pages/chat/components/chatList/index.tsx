import './style.css'
import { Avatar, Badge, Button, Input, Space } from 'antd'
import { ChatListProps } from './constants'
import { PlusSquareFilled, SearchOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import { format, isSameDay, isSameYear } from 'date-fns'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4938016_q2nlcmprvxr.js' // 替换为你的图标库地址
})

const ChatList = (props: { data: ChatListProps[] }): JSX.Element => {
  const { data } = props

  useEffect(() => {
    // console.log('props', data)
  }, [data]) // 监听prop

  // 修改 showTime 函数
  const showTime = (time): string => {
    const currentTime = new Date(time)
    const now = new Date()

    if (isSameDay(currentTime, now)) {
      return format(currentTime, 'HH:mm')
    } else if (isSameYear(currentTime, now)) {
      return format(currentTime, 'MM-dd')
    } else {
      return format(currentTime, 'yyyy-MM')
    }
  }

  const ChatItem = (message: ChatListProps, key: string): JSX.Element => {
    const MAX_UNREAD_DISPLAY = 99
    const displayCount =
      message.unread > MAX_UNREAD_DISPLAY ? `${MAX_UNREAD_DISPLAY}+` : message.unread

    return (
      <div className="chatlist-item" id={`chatlist-item-${key}`} key={key}>
        <div style={{ position: 'relative', marginRight: '10px' }}>
          {message.unread > 0 && (
            <Badge
              count={displayCount}
              style={{
                backgroundColor: '#ff4d4f',
                boxShadow: '0 0 0 2px white',
                position: 'absolute',
                top: '-4px',
                right: '-4px'
              }}
              size="small"
              dot={message.unread != 0}
            >
              <Avatar src={message.avatar} shape="square" size={40} />
            </Badge>
          )}
          {message.unread === 0 && <Avatar src={message.avatar} shape="square" size={40} />}
        </div>
        <div className="chatlist-item-content">
          <div className="chatlist-item-header">
            <div className="chatlist-item-content-title">{message.title}</div>
            <div className="chatlist-item-time">{showTime(message.time)}</div>
          </div>
          <div className="chatlist-item-content-content">{message.content}</div>
        </div>
        {message.muted && (
          <div className="chatlist-item-mute-icon">
            <Button
              type="text"
              style={{
                color: 'black',
                fontSize: '18px',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ff4d4f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#999'
              }}
              icon={<IconFont type="icon-jingyin" />}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="chatlist-container">
        <div className="chatlist-header">
          <Space>
            <Input placeholder="搜索聊天" prefix={<SearchOutlined />} className="chatlist-search" />
            <Button type="text" size="large" icon={<PlusSquareFilled />} />
          </Space>
        </div>
        <div className="chatlist-body">
          {Array.isArray(data) ? (
            data.map((message) => {
              return ChatItem(message, message.key)
            })
          ) : (
            <div>无数据</div>
          )}
        </div>
      </div>
    </>
  )
}

export default ChatList
