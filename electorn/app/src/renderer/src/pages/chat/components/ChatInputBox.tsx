import { Button, Space, Popover, message } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { sendChatMessage } from '@renderer/api/chat'

import '../style.css'
import TextArea from 'antd/es/input/TextArea'
import EmojiPicker from './emojPicker'

import ClickMenu from './clickMenu'

// store
import store from '@renderer/store'
import { ActionTypes } from '@renderer/store/types'
import { MenuItemInfo } from './clickMenu/types'

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
  const [hasSelectedChat, setHasSelectedChat] = useState<boolean>(false)

  // 订阅当前是否选中了会话，未选中时禁止输入与发送
  useEffect(() => {
    const syncSelected = (): void => {
      const { selectedChatId } = store.getState().chat
      setHasSelectedChat(selectedChatId !== null && selectedChatId !== '')
    }
    syncSelected()
    const unsubscribe = store.subscribe(syncSelected)
    return (): void => {
      unsubscribe()
    }
  }, [])

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
   * 发送消息（仅在已选中会话时可用）
   * @returns void
   */
  const sendContent = (): void => {
    const { user, chat } = store.getState()
    if (chat.selectedChatId === null || chat.selectedChatId === '') {
      message.warning('请先选择一个聊天会话')
      return
    }
    const content = inputValue.trim()
    if (!content) {
      return
    }
    // 乐观展示
    store.dispatch({ type: ActionTypes.STORE_SEND_CHAT, payload: content })
    sendChatMessage(user.userId, chat.selectedChatId, content)
      .then(() => {
        // 清空待发送内容，并触发历史消息重新拉取，与服务端数据对齐
        store.dispatch({ type: ActionTypes.STORE_SEND_CHAT, payload: '' })
        store.dispatch({ type: ActionTypes.REFRESH_CHAT_HISTORY })
      })
      .catch((err) => {
        store.dispatch({ type: ActionTypes.STORE_SEND_CHAT, payload: '' })
        store.dispatch({ type: ActionTypes.REFRESH_CHAT_HISTORY })
        message.error('发送失败：' + (err?.message || err))
      })
    setInputValue('') // 清空输入框内容
    setSendButtonDisabled(true)
  }

  const rightMenu: MenuItemInfo[] = [
    {
      key: 'copy',
      label: '复制',
      onClick: async (): Promise<void> => {
        await navigator.clipboard.writeText(getSelectedText())
      },
      disabled: (): boolean => {
        return getSelectedText() === ''
      }
    },
    {
      key: 'paste',
      label: '粘贴',
      onClick: async (): Promise<void> => {
        const data = await navigator.clipboard.readText()
        handlePaste(data)
      },
      disabled: (): boolean => {
        return false
      }
    },
    {
      key: 'cut',
      label: '剪切',
      onClick: async (event: React.MouseEvent<HTMLElement, MouseEvent>): Promise<void> => {
        handleCut(event.target['selectionStart'], event.target['selectionEnd'])
        return await navigator.clipboard.writeText(getSelectedText())
      },
      disabled: (): boolean => {
        return getSelectedText() === ''
      }
    }
  ]

  /**
   * 处理截屏事件
   * @returns void
   */
  const handleScreenCapture = async (): Promise<void> => {}

  return (
    <div className="chat-input-box-container">
      <canvas id="screenCanvas" style={{ display: 'none' }}></canvas>
      {/* 工具栏 */}
      <div className="chat-input-box-toolbar">
        <Space>
          <Popover
            content={EmojiPicker({ func: (val) => fillSelect(val) })}
            title={''}
            placement="top"
            trigger="hover"
          >
            <Button type="text" icon={<IconFont type="icon-emoji" />} />
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
                onClick={() => {
                  return handleScreenCapture()
                }}
              />
            }
          />
          <Button type="text" icon={<IconFont type="icon-message" />} />
        </Space>
        <Space>
          <Button type="text" icon={<IconFont type="icon-telephone" />} />
          <Button type="text" icon={<IconFont type="icon-shexiangji" />} />
        </Space>
      </div>
      {/* 输入区 */}
      <div className="chat-input-box-textarea-wrapper">
        <TextArea
          id="chat-input-box-text-area"
          rows={4}
          disabled={!hasSelectedChat}
          placeholder={
            hasSelectedChat ? '请输入内容，按 Enter 发送，Shift+Enter 换行' : '请先选择一个聊天会话'
          }
          autoSize={{ minRows: 3, maxRows: 8 }}
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
            ClickMenu(e, rightMenu)
          }}
          onSelect={(e) => {
            setSelectValue(
              inputValue.substring(e.target['selectionStart'], e.target['selectionEnd'])
            )
          }}
        />
      </div>
      {/* 发送按钮 */}
      <div className="chat-input-box-send-wrapper">
        <Button
          type="primary"
          onClick={() => {
            sendContent()
          }}
          disabled={!hasSelectedChat || sendButtonDisabled}
        >
          发送
        </Button>
      </div>
    </div>
  )
}

export default ChatInputBox
