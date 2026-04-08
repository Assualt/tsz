import { ChatMessageInfo, MessageType } from './constants'
import { Avatar, Popover, Card, Image } from 'antd'
import './style.css'
import ClickMenu from '../clickMenu'
import { MenuItemInfo } from '../clickMenu/types'
import MediaCard from '../mediaCard'
import RightMenu from '../rightMenu'

const ChatMessageItem = ({ message }: { message: ChatMessageInfo }): JSX.Element => {
  const showName = (): JSX.Element => {
    return (
      <>
        <span>{message.name}</span>
        {message.nickName && (
          <span style={{ color: '#999', marginLeft: '5px' }}>{`(${message.nickName})`}</span>
        )}
      </>
    )
  }

  const showHoverContent = (): JSX.Element => {
    return (
      <Card>
        <Avatar src={message.avatar} shape="circle" />
      </Card>
    )
  }

  const showLink = (): JSX.Element => {
    return (
      <a href={message.content} target="_blank" rel="noopener noreferrer">
        {message.content}
      </a>
    )
  }

  const showAudio = (): JSX.Element => {
    return (
      <audio controls>
        <source src={message.content} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    )
  }

  const getFileIcon = (fileType: string): string => {
    switch (fileType) {
      case 'text/plain':
        return '📄'
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return '🖼️'
      case 'application/pdf':
        return '📑'
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '📄'
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '📊'
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return '📈'
      case 'audio/mpeg':
      case 'audio/wav':
        return '🎵'
      case 'video/mp4':
      case 'video/quicktime':
        return '🎬'
      default:
        return '📁'
    }
  }

  const showFile = (): JSX.Element => {
    const size = message.fileInfo?.size ? `${(message.fileInfo.size / 1024).toFixed(2)} KB` : ''
    return (
      <a
        href={message.content}
        target="_blank"
        rel="noopener noreferrer"
        className="chat-file-link"
      >
        <span className="chat-file-icon">{getFileIcon(message.fileInfo?.type || '')}</span>
        <div className="chat-file-info">
          <div className="chat-file-name">{message.fileInfo?.name || '未知文件名'}</div>
          {size && <div className="chat-file-size">{size}</div>}
        </div>
      </a>
    )
  }

  const showImage = (): JSX.Element => {
    return (
      <Image
        src={message.content}
        alt={message.content}
        style={{ width: '100%', height: 'auto' }}
      />
    )
  }

  const showContent = (): JSX.Element => {
    switch (message.msgType) {
      case MessageType.LINK:
        return showLink()
      case MessageType.IMAGE:
        return showImage()
      case MessageType.AUDIO:
        return showAudio()
      case MessageType.FILE:
        return <MediaCard />
      default:
        return <span>{message.content}</span>
    }
  }

  const rightMenus: MenuItemInfo[] = [
    {
      key: 'copy',
      label: '复制',
      onClick: (value): void => {
        // TODO: 复制文本
        console.log('复制文本', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'revoke',
      label: '撤回',
      onClick: (value): void => {
        // TODO: 撤回消息
        console.log('撤回消息', value)
      },
      disabled: (): boolean => {
        return false
      }
    },
    {
      key: 'forward',
      label: '转发',
      onClick: (value): void => {
        console.log('转发', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'collect',
      label: '收藏',
      onClick: (value): void => {
        console.log('收藏', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'muliSelect',
      label: '多选',
      onClick: (value): void => {
        console.log('多选', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'reference',
      label: '引用',
      onClick: (value): void => {
        console.log('引用', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'search',
      label: '搜一搜',
      onClick: (value): void => {
        console.log('搜一搜', value)
      },
      disabled: (): boolean => {
        return true
      }
    },
    {
      key: 'delete',
      label: '删除',
      onClick: (value): void => {
        console.log('删除', value)
      },
      disabled: (): boolean => {
        return false
      }
    }
  ]

  const showRightMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    ClickMenu(e, rightMenus)
  }

  return (
    <div className={`chat-message-list-container ${message.isSelf ? 'self-message' : ''}`}>
      <div
        className="chat-message-list-item"
        onContextMenu={(e) => {
          showRightMenu(e)
        }}
      >
        {!message.isSelf && (
          <Popover content={showHoverContent()} placement="rightTop">
            <div className="chat-message-list-item-avatar">
              <Avatar src={message.avatar} shape="circle" />
            </div>
          </Popover>
        )}
        <div className="chat-message-list-item-content">
          <div className="chat-message-list-item-content-name">{showName()}</div>
          <div className="chat-message-list-item-content-text">{showContent()}</div>
        </div>
        {message.isSelf && (
          <Popover content={showHoverContent()} placement="leftTop">
            <div className="chat-message-list-item-avatar">
              <Avatar src={message.avatar} shape="circle" />
            </div>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default ChatMessageItem
