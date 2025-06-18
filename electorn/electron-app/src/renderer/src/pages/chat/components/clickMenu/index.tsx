import { Popover, Menu, MenuProps } from 'antd'
import { createRoot } from 'react-dom/client'
import { MenuItemInfo } from './types'

const ClickMenu = (
  event: React.MouseEvent<HTMLElement, MouseEvent>,
  menus: MenuItemInfo[]
): void => {
  event.preventDefault() // 阻止默认行为

  const closePopover = (): void => {
    const popoverContainer = document.getElementById('popover-container')
    if (popoverContainer) {
      document.body.removeChild(popoverContainer)
    }
    document.removeEventListener('mousedown', handleOutsideClick)
  }

  type MenuItem = Required<MenuProps>['items'][number]

  // 修改返回类型为数组
  const getMenuItems = (): MenuItem[] => {
    return menus.map((item) => ({
      key: item.key,
      label: (
        <>
          {item.icon}
          {item?.label}
        </>
      ),
      onClick: (): void => {
        item.onClick(event)
        closePopover()
      },
      disabled: item.disabled(),
      theme: 'dark'
    }))
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
        items={getMenuItems()}
        mode="inline"
        style={{ maxWidth: 120 }} // 调整菜单最小宽度
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
