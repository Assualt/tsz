import { Popover, Menu } from 'antd'
import { CopyOutlined, ScissorOutlined } from '@ant-design/icons'
import { createRoot } from 'react-dom/client'

const ClickMenu = (
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  updateText: (text: string) => void,
  getSelectedText: () => string, // 新增的方法，用于获取选中的文本
  isSelectEmtpy: () => boolean,
  cutSelectedText: (start: number, end: number) => void
): void => {
  event.preventDefault()

  const closePopover = (): void => {
    const popoverContainer = document.getElementById('popover-container')
    if (popoverContainer) {
      document.body.removeChild(popoverContainer)
    }
    document.removeEventListener('mousedown', handleOutsideClick)
  }

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(getSelectedText())
    } catch (err) {
      console.error('复制失败', err)
    } finally {
      closePopover()
    }
  }

  const handlePaste = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText()
      updateText(text)
    } catch (err) {
      console.error('粘贴失败', err)
    } finally {
      closePopover()
    }
  }

  const handleCut = async (): Promise<void> => {
    try {
      // 获取选中的文本
      cutSelectedText(event.target['selectionStart'], event.target['selectionEnd'])
    } catch (err) {
      console.error('剪切失败', err)
    } finally {
      closePopover()
    }
  }

  const popover = (
    <Popover
      content={''}
      trigger="click"
      placement="rightTop"
      getPopupContainer={() => document.body}
      style={{ position: 'absolute', left: event.clientX, top: event.clientY, zIndex: 9999 }}
    >
      <Menu
        items={[
          {
            key: 'copy',
            label: (
              <>
                <CopyOutlined />
                复制
              </>
            ),
            onClick: handleCopy,
            disabled: isSelectEmtpy()
          },
          {
            key: 'paste',
            label: <>粘贴</>,
            onClick: handlePaste
          },
          {
            key: 'cut',
            label: (
              <>
                <ScissorOutlined />
                剪切
              </>
            ),
            onClick: handleCut,
            disabled: isSelectEmtpy() // 禁用剪切选项，当没有选中文本时为 tru
          }
        ]}
      />
    </Popover>
  )

  const container = document.createElement('div')
  container.id = 'popover-container'
  // 确保容器可见
  container.style.position = 'absolute'
  container.style.left = `${event.clientX}px`
  container.style.top = `${event.clientY}px`
  container.style.zIndex = '9999'
  document.body.appendChild(container)
  const root = createRoot(container)
  root.render(popover)
  const handleOutsideClick = (event: MouseEvent): void => {
    if (!container.contains(event.target as Node)) {
      root.unmount()
      document.body.removeChild(container)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }

  document.addEventListener('mousedown', handleOutsideClick)
}

export default ClickMenu
