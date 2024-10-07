import { Menu } from 'element-react'
import { useRef } from 'react'

const MenuNav = () => {
  const activeIndex = useRef('1-1')

  return (
    <Menu defaultActive={activeIndex.current} className="el-menu-vertical-demo">
      <Menu.SubMenu
        index="1"
        title={
          <span>
            <i className="el-icon-message"></i>车票管理
          </span>
        }
      >
        <Menu.ItemGroup title="出发车站">
          <Menu.Item index="1-1">南京</Menu.Item>
          <Menu.Item index="1-2">上海</Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>
      <Menu.Item index="2">
        <i className="el-icon-menu"></i>常用信息管理
      </Menu.Item>
      <Menu.Item index="3">
        <i className="el-icon-setting"></i>订单管理
      </Menu.Item>
    </Menu>
  )
}

export default MenuNav
