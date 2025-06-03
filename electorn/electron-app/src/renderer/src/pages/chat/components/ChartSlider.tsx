import React from 'react'
import '../style.css'
import ChatList from './chatList'
import { ChatListProps } from './chatList/constants'

const ChatSlider: React.FC = () => {
  const dataInfo: ChatListProps[] = [
    {
      title: '腾讯新闻',
      time: '12:00',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '交通大学',
      key: '1',
      muted: false,
      unread: 1
    },
    {
      title: 'Title 2',
      time: '12:01',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '[链接]最新放假通知连休八天',
      key: '2',
      muted: true,
      unread: 2
    },
    {
      title: '兴旺房产 董',
      time: '12:02',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '[转帐]朋友已确认收款',
      key: '3',
      muted: false,
      unread: 100
    }
  ]

  return (
    <>
      <ChatList data={dataInfo} />
    </>
  )
}

export default ChatSlider
