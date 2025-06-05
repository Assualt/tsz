import { Button, Col, Layout, Row, Space, Popover, message } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import { useState } from 'react'
import { sendChatMessage } from '@renderer/api/chat'

import '../style.css'
import TextArea from 'antd/es/input/TextArea'
import EmojiPicker from './emojPicker'

import ClickMenu from './clickMenu'

// store
import store from '@renderer/store'
import { ActionTypes } from '@renderer/store/types'

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_4938016_z65v44mc3dj.js'],
  extraCommonProps: {
    style: {
      fontSize: '20px'
    }
  }
})

const ChatInputBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [sendButtonDisabled, setSendButtonDisabled] = useState<boolean>(true)
  const [selectValue, setSelectValue] = useState<string>('')

  /**
   * 填充选择框
   * @param val
   *
   * */
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

  const onSelectFile = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (): void => {
      const file = input.files?.[0]
      if (file) {
        // 处理文件上传逻辑
        console.log('Selected file:', file)
        const textArea = document.getElementById('chat-input-box-text-area') as HTMLTextAreaElement
        if (textArea) {
          textArea.focus()
          textArea.value += `![file]${file.path}\n`
          setInputValue(textArea.value)
          document.removeChild(input) // 移除文件输入元素以释放内存
        }
      }
    }
    input.click()
  }

  /**
   * TextArea 键盘事件
   * @param e
   *
   * */
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // 检测是否按下了 Enter 键且没有按下 Shift 键
      e.preventDefault()
      sendContent()
    }
  }

  /**
   * TextArea 粘贴事件
   * @param e
   *
   * */
  const handlePaste = (paste_value: string): void => {
    const textArea = document.getElementById('chat-input-box-text-area') as HTMLTextAreaElement
    if (!textArea) {
      return
    }

    // 获取光标位置
    const start = textArea.selectionStart
    const end = textArea.selectionEnd
    // 插入文本
    const newValue =
      textArea.value.substring(0, start) + paste_value + textArea.value.substring(end)
    setInputValue(newValue)
  }

  /**
   * TextArea 选择文本事件
   * @param e
   *
   * */
  const isSelectEmpty = (): boolean => {
    return selectValue.trim() === ''
  }

  const getSelectedText = (): string => {
    return selectValue
  }

  const handleCut = (start: number, end: number): void => {
    const textArea = document.getElementById('chat-input-box-text-area') as HTMLTextAreaElement
    if (textArea) {
      const newValue = textArea.value.substring(0, start) + textArea.value.substring(end)
      setInputValue(newValue)
    }
  }

  /***
   * 发送消息
   * @returns void
   */
  const sendContent = (): void => {
    const loginUser = store.getState().user
    sendChatMessage(loginUser.userId, '1234567890', inputValue)
      .then(() => {
        store.dispatch({ type: ActionTypes.REFRESH_CHAT_HISTORY, payload: true })
      })
      .catch((err) => {
        message.error('发送失败' + err)
      })
    setInputValue('') // 清空输入框内容
    setSendButtonDisabled(true)
  }

  /**
   * 处理截屏事件
   * @returns void
   */
  const handleScreenCapture = async (): Promise<void> => {}

  return (
    <>
      <Layout style={{ position: 'relative', bottom: '0px' }}>
        <canvas id="screenCanvas" style={{ display: 'none' }}></canvas>
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
                    onSelectFile()
                  }}
                />
                <Button
                  type="text"
                  icon={
                    <IconFont
                      type="icon-jiandao"
                      onClick={(e) => {
                        return handleScreenCapture()
                      }}
                    />
                  }
                />
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
            onChange={(e) => {
              setInputValue(e.target.value)
              setSendButtonDisabled(e.target.value === '')
            }}
            onFocus={() => {
              handleTextAreaFocus()
            }}
            onKeyDown={(e) => {
              onKeyDown(e)
            }}
            onContextMenu={(e) => {
              ClickMenu(e, handlePaste, getSelectedText, isSelectEmpty, handleCut)
            }}
            onSelect={(e) => {
              setSelectValue(
                inputValue.substring(e.target['selectionStart'], e.target['selectionEnd'])
              )
            }}
          />
          <Button
            type="primary" // 使用 Ant Design 的主要按钮类型
            style={{
              position: 'relative',
              top: '-30px',
              right: '0px',
              float: 'right',
              borderRadius: '4px', // 添加圆角
              padding: '0 16px', // 调整内边距
              backgroundColor: '#1890ff', // 设置背景颜色
              color: '#fff', // 设置文字颜色
              border: 'none', // 移除边框
              transition: 'background-color 0.3s ease' // 添加过渡效果
            }}
            onClick={() => {
              sendContent()
            }}
            disabled={sendButtonDisabled}
            // 添加鼠标悬停样式
            onMouseEnter={(e) => {
              if (!sendButtonDisabled) {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#40a9ff'
              }
            }}
            onMouseLeave={(e) => {
              if (!sendButtonDisabled) {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = '#1890ff'
              }
            }}
          >
            发送
          </Button>
        </div>
      </Layout>
    </>
  )
}

export default ChatInputBox
