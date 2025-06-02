import React from 'react'
import '../style.css'
import { List, Avatar, Button, Form, Input, Row, Col, Divider } from 'antd'
import { createFromIconfontCN, PlusCircleFilled } from '@ant-design/icons'

// 提取样式常量
const LIST_ITEM_FONT_SIZE = '10px'
const EXTRA_ITEM_MARGIN_BOTTOM = '4px'
const BUTTON_FONT_SIZE = '16px'
const LIST_ITEM_HEIGHT = '100px'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4938016_q2nlcmprvxr.js'
})

interface ChatShortMessage {
  title: string
  time: string
  avatar: string
  content: string
  key: string
  muted: boolean
}

const ChatSlider: React.FC = () => {
  const data: ChatShortMessage[] = [
    {
      title: '腾讯新闻',
      time: '12:00',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '交通大学',
      key: '1',
      muted: false
    },
    {
      title: 'Title 2',
      time: '12:01',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '[链接]最新放假通知连休八天',
      key: '2',
      muted: false
    },
    {
      title: '兴旺房产 董',
      time: '12:02',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '[转帐]朋友已确认收款',
      key: '3',
      muted: false
    },
    {
      title: 'Title 3',
      time: '12:02',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      content: '[图片]',
      key: '4',
      muted: true
    }
  ]

  const renderExtra = (item: ChatShortMessage): JSX.Element => {
    return (
      <>
        <div className="chat-message-extra-container">
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li
              className="chat-message-extra-item"
              style={{ marginBottom: EXTRA_ITEM_MARGIN_BOTTOM }}
            >
              {item.time}
            </li>
            <li className="chat-message-extra-item">
              <Button
                type="text"
                icon={<IconFont type="icon-zhong" />}
                style={{ padding: 0, fontSize: BUTTON_FONT_SIZE }}
              />
            </li>
          </ul>
        </div>
      </>
    )
  }

  return (
    <>
      <Form style={{ padding: '10px', height: '40px' }} size="middle">
        <Row gutter={1}>
          <Col span={1} />
          <Col span={18}>
            <Form.Item>
              <Input type="text" placeholder="搜索聊天记录" allowClear />
            </Form.Item>
          </Col>
          <Col span={1} />
          <Col span={4}>
            <Form.Item>
              <Button type="text" icon={<PlusCircleFilled />} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <List
        className="chat-message-list"
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            className="chat-message-list-item"
            style={{ height: LIST_ITEM_HEIGHT, fontSize: LIST_ITEM_FONT_SIZE }}
            key={item.key}
            extra={renderExtra(item)}
            onClick={() => console.log('clicked', item)}
          >
            <List.Item.Meta
              // 确保类名正确
              title={<strong style={{ fontWeight: 'bold' }}>{item.title}</strong>}
              avatar={<Avatar src={item.avatar} />}
              description={
                <div
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    padding: '0'
                  }}
                >
                  {item.content}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default ChatSlider
