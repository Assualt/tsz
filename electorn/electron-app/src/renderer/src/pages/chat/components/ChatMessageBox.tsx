import { List, Avatar } from 'antd'
import Layout from 'antd/es/layout/layout'
import { Content } from 'antd/es/layout/layout'
import VirtualList from 'rc-virtual-list'
import moment from 'moment' // 引入 moment 库来处理时间格式
import '../style.css'

enum MessageType {
  TEXT,
  IMAGE,
  FILE,
  AUDIO,
  VIDEO
}

interface UserItem {
  id: string
  name: string
  nickName: string
  avatar: string
  content: string
  time: string
  msgType: MessageType
  isSelf: boolean
}

const ChatMessageBox: React.FC = () => {
  const appendData = (): void => {
    console.log('appendData')
  }

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>): void => {
    console.log(e.currentTarget.scrollTop)
    if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - 700) <= 1) {
      appendData()
    }
  }

  const data = [
    {
      id: '1',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      content: 'Can you help me with this issue?',
      time: '2023-01-01 12:00:00',
      msgType: MessageType.TEXT,
      isSelf: false
    },
    {
      id: '2',
      name: 'John Brown',
      nickName: 'John Brown(1)',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
      content: 'Sure, what is the issue?',
      time: '2023-01-01 12:01:00',
      msgType: MessageType.TEXT,
      isSelf: true
    },
    {
      id: '3',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:02:00',
      msgType: MessageType.IMAGE,
      isSelf: false
    },
    {
      id: '4',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:34:00',
      msgType: MessageType.TEXT,
      isSelf: true
    },
    {
      id: '5',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:34:00',
      msgType: MessageType.TEXT,
      isSelf: true
    },
    {
      id: '6',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:02:00',
      msgType: MessageType.TEXT,
      isSelf: false
    },
    {
      id: '6',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:02:00',
      msgType: MessageType.TEXT,
      isSelf: false
    },
    {
      id: '6',
      name: 'John Brown',
      nickName: 'John Brown',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5',
      content: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6',
      time: '2023-01-01 12:02:00',
      msgType: MessageType.TEXT,
      isSelf: false
    }
  ]

  const showName = (item: UserItem): JSX.Element => {
    return (
      <>
        <span>{item.name}</span>
        <span style={{ color: '#999', marginLeft: '10px' }}>{item.nickName}</span>
      </>
    )
  }

  // 定义样式常量
  const SELF_MESSAGE_BG_COLOR = '#9EEA6A'
  const OTHER_MESSAGE_BG_COLOR = '#f0f0f0'
  const MESSAGE_MARGIN = '8px'

  const showContent = (item: UserItem): JSX.Element => {
    const bgColor = item.isSelf ? SELF_MESSAGE_BG_COLOR : OTHER_MESSAGE_BG_COLOR
    // 减小最大宽度，避免与滚动条重合
    const maxWidth = item.isSelf ? '70%' : '80%'
    if (item.msgType === MessageType.TEXT) {
      return (
        <span
          className="chat-input-box-content-text-wrapper"
          style={{
            backgroundColor: bgColor,
            padding: '8px 12px',
            borderRadius: '16px',
            display: 'inline-block',
            maxWidth: maxWidth,
            wordBreak: 'break-word',
            margin: item.isSelf ? `0 ${MESSAGE_MARGIN} 0 0` : `0 0 0 ${MESSAGE_MARGIN}`
          }}
        >
          {item.content}
        </span>
      )
    } else if (item.msgType === MessageType.IMAGE) {
      return (
        <img
          src={item.content}
          alt="message image"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            maxWidth: maxWidth,
            height: 'auto'
          }}
          onClick={() => window.open(item.content, '_blank')}
        />
      )
    } else if (item.msgType === MessageType.FILE) {
      return (
        <a
          href={item.content}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: bgColor,
            padding: '8px 12px',
            borderRadius: '16px',
            textDecoration: 'none',
            color: '#1890ff',
            maxWidth: maxWidth
          }}
        >
          <span style={{ marginRight: '8px' }}>📄</span>
          <span>{item.content.split('/').pop()}</span>
        </a>
      )
    } else if (item.msgType === MessageType.AUDIO) {
      return (
        <audio controls style={{ width: '200px', maxWidth: maxWidth }}>
          <source src={item.content} type="audio/mpeg" />
          您的浏览器不支持音频播放。
        </audio>
      )
    }
    return <span>{item.content}</span>
  }

  const showTime = (time: string): string => {
    return moment(time).format('HH:mm')
  }

  const showDivider = (item: UserItem, index: number): JSX.Element => {
    if (index === 0) {
      return <></>
    }

    const prevItem = data[index - 1].time
    const diffTime = moment(item.time).diff(moment(prevItem), 'minutes')
    if (diffTime < 30) {
      return <></>
    }

    return <></>
    // return <Divider variant="dotted" style={{ marginTop: '16px'}}>以上是历史消息</Divider>
  }

  return (
    <>
      <Layout style={{ height: '700px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
        <Content
          style={{
            padding: '16px',
            overflowY: 'auto',
            // 添加右内边距，将滚动条右移
            paddingRight: '30px'
          }}
        >
          <List split={false}>
            <VirtualList data={data} itemHeight={50} itemKey="id" onScroll={onScroll}>
              {(item: UserItem, index: number) => (
                <List.Item
                  key={item.id}
                  style={{
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: item.isSelf ? 'flex-end' : 'flex-start',
                    flexDirection: item.isSelf ? 'row-reverse' : 'row',
                    marginBottom: MESSAGE_MARGIN // 增加消息之间的间距
                  }}
                >
                  {showDivider(item, index)}
                  {item.isSelf ? (
                    <List.Item.Meta
                      title={
                        <div style={{ textAlign: 'right', marginRight: '10px' }}>
                          {showName(item)}
                          <Avatar src={item.avatar} style={{ marginLeft: '10px' }} />
                        </div>
                      }
                      description={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end'
                          }}
                        >
                          {showContent(item)}
                          <div
                            style={{
                              color: '#999',
                              fontSize: '12px',
                              marginTop: '8px',
                              marginRight: '16px'
                            }}
                          >
                            {showTime(item.time)}
                          </div>
                        </div>
                      }
                    />
                  ) : (
                    <List.Item.Meta
                      title={
                        <div>
                          <Avatar src={item.avatar} style={{ marginRight: '10px' }} />
                          {showName(item)}
                        </div>
                      }
                      description={
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                          }}
                        >
                          {showContent(item)}
                          <div
                            style={{
                              color: '#999',
                              fontSize: '12px',
                              marginLeft: '16px',
                              marginTop: '8px'
                            }}
                          >
                            {showTime(item.time)}
                          </div>
                        </div>
                      }
                    />
                  )}
                </List.Item>
              )}
            </VirtualList>
          </List>
        </Content>
      </Layout>
    </>
  )
}

export default ChatMessageBox
