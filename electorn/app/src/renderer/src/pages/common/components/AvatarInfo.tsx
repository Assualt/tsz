import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Dropdown, MenuProps, Space, Typography, message } from 'antd'

// api
import { logout, getUserInfo } from '@renderer/api/user'

const items: MenuProps['items'] = [
  {
    key: 'info',
    label: '个人信息'
  },
  {
    key: 'setting',
    label: '设置'
  },
  {
    key: 'logout',
    label: '退出登录'
  }
]

interface AvatarInfoProps {
  onLogout?: () => void
}

export const AvatarInfo: React.FC<AvatarInfoProps> = ({ onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const menuOnClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'info') {
      window.location.href = '/userInfo'
    } else if (key === 'setting') {
      window.location.href = '/user/setting'
    } else if (key === 'logout') {
      setIsLoggingOut(true)
      if (onLogout) {
        onLogout()
      }
      message.loading({
        content: '正在退出登录...',
        key: 'logout'
      })

      const userInfo = getUserInfo()
      const username = userInfo?.username || ''
      logout(username)
        .then(async () => {
          try {
            await window.api.logout()
            message.success({
              content: '退出成功',
              key: 'logout',
              duration: 1
            })
          } catch (error) {
            console.error('Local logout failed:', error)
          }
        })
        .catch((error) => {
          console.error('Backend logout failed:', error)
          message.error({
            content: '退出登录失败',
            key: 'logout',
            duration: 2
          })
          setIsLoggingOut(false)
          if (onLogout) {
            onLogout()
          }
        })
    }
  }

  return (
    <Badge dot className="avatar-info">
      <Dropdown
        menu={{
          items,
          onClick: menuOnClick,
          selectable: true,
          defaultSelectedKeys: []
        }}
      >
        <Typography.Link>
          <Space>
            <Avatar size={32} icon={<UserOutlined />} />
          </Space>
        </Typography.Link>
      </Dropdown>
    </Badge>
  )
}

export default AvatarInfo
