import React from 'react'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Badge, Dropdown, MenuProps, Space, Typography, message } from 'antd'

// api
import { logout } from '@renderer/api/user'

import { changeUrl } from '@renderer/stores'

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
    label: '退出登陆'
  }
]

const menuOnClick: MenuProps['onClick'] = ({ key }) => {
  if (key == 'info') {
  } else if (key == 'setting') {
  } else if (key == 'logout') {
    logout('hxoun')
      .then((res) => {
        message.success(`退出成功 ${JSON.stringify(res.data)}`)
      })
      .catch((err) => {
        message.error(`退出失败 ${err}`)
      })

    message.loading(
      {
        content: '跳转至首页...',
        key: 'logout',
        duration: 2
      },
      () => {
        changeUrl('/')
      }
    )
  }
}

const AvatarInfo : React.FC = () => {
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
