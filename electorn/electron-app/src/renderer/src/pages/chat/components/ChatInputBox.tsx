import { Button, Col, Layout, Row, Space, Popover } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import { useState } from 'react'

import '../style.css'
import TextArea from 'antd/es/input/TextArea'
import EmojiPicker from './EmojiPicker'

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_4938016_z65v44mc3dj.js'],
  extraCommonProps: {
    style: {
      fontSize: '20px'
    }
  }
})

const ChatInputBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const fillSelect = (val: string): void => {
    setInputValue((prevValue) => prevValue + val)
    const textArea = document.getElementById('chat-input-box-text-area') as HTMLTextAreaElement
    if (textArea) {
      textArea.focus()
    }
  }

  const handleTextAreaFocus = (): void => {
    const textArea = document.getElementById('chat-input-box-text-area') as HTMLTextAreaElement
    if (textArea) {
      textArea.style.borderColor = '#1890ff' // 改变边框颜色以显示焦点状态
    }
  }

  const handleSelectFile = (): void => {}

  return (
    <>
      <Layout style={{ position: 'relative', bottom: '0px' }}>
        <div className="chat-input-box-tool-list">
          <Row gutter={16}>
            <Col span={12}>
              <Space>
                <Popover
                  content={EmojiPicker({ func: (val) => fillSelect(val) })}
                  title={''}
                  placement="top"
                  trigger="hover"
                >
                  <Button type="text" icon={<IconFont type="icon-emoji " />} />
                </Popover>
                <Button
                  type="text"
                  icon={<IconFont type="icon-file" />}
                  onClick={() => {
                    handleSelectFile()
                  }}
                />
                <Button type="text" icon={<IconFont type="icon-jiandao" />} />
                <Button type="text" icon={<IconFont type="icon-message" />} />
              </Space>
            </Col>
            <Col span={10} />
            <Col span={2}>
              <Space>
                <Button type="text" icon={<IconFont type="icon-telephone" />} />
                <Button type="text" icon={<IconFont type="icon-shexiangji" />} />
              </Space>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: '10px' }}>
          <TextArea
            id="chat-input-box-text-area"
            rows={4}
            placeholder="请输入内容"
            // 调整自动调整大小的范围
            autoSize={{ minRows: 4, maxRows: 10 }}
            className="chat-input-box-text-area"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              handleTextAreaFocus()
            }}
          />
          <Button
            type="text"
            style={{ position: 'relative', top: '-30px', right: '00px', float: 'right' }}
          >
            发送
          </Button>
        </div>
      </Layout>
    </>
  )
}

export default ChatInputBox
