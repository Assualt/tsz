import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Dropdown, MenuProps, Space, Typography, message } from 'antd'

// api
import { logout } from '@renderer/api/user'

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

export const AvatarInfo: React.FC = () => {
  const navigate = useNavigate()

  const menuOnClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'info') {
      navigate('/userInfo')
    } else if (key === 'setting') {
      navigate('/user/setting')
    } else if (key === 'logout') {
      message.loading({
        content: '正在退出登录...',
        key: 'logout'
      })

      // 先执行后端登出
      logout()
        .then(async () => {
          // 后端登出成功后，执行本地登出
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

          setTimeout(() => {
            navigate('/login')
          }, 500)
        })
        .catch((error) => {
          console.error('Backend logout failed:', error)
          message.error({
            content: '退出登录失败',
            key: 'logout',
            duration: 2
          })
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
