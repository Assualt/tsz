import React, { useEffect, useState } from 'react'

import './style.css'
import { UserOutlined, HomeOutlined } from '@ant-design/icons'
import { Layout, Menu, MenuProps, Breadcrumb } from 'antd'
import { Footer } from 'antd/es/layout/layout'

import AvatarInfo from './components/AvatarInfo'
import { useNavigate } from 'react-router-dom'

// api
import { useLocation } from 'react-router-dom'
import TicketSearch from './tabs/TicketSearch'
import TicketPreOrder from './tabs/TicketPreOrder'
import TicketList from './tabs/TicketList'
import UserInfo from './tabs/UserInfo'
import PassagerMgr from './tabs/PassagerInfoMgr'

const { Header, Content, Sider } = Layout

const menuItems: MenuProps['items'] = [
  {
    key: '1',
    label: '首页'
  },
  {
    key: '2',
    label: '博客'
  },
  {
    key: '3',
    label: '文档'
  },
  {
    key: '4',
    label: '关于'
  }
]

const sliderItems: MenuProps['items'] = [
  {
    key: '1',
    icon: <HomeOutlined />,
    label: '车票管理',
    children: [
      {
        key: 'home',
        label: '车票查询'
      },
      {
        key: 'orderlist',
        label: '订单查询'
      }
    ]
  },
  {
    key: '4',
    icon: <UserOutlined />,
    label: '常用信息管理',
    children: [
      {
        key: 'userInfo',
        label: '个人信息'
      },
      {
        key: 'passagerMgr',
        label: '乘车人管理'
      }
    ]
  }
]

interface BreadCrumbProps {
  href: string
  title: JSX.Element
}

interface TabProps {
  herf: string
  content: JSX.Element
  breadCrumb: BreadCrumbProps[]
}

const HomeBreadCrumb: BreadCrumbProps = {
  href: '/',
  title: (
    <>
      <HomeOutlined />
      <span>首页</span>
    </>
  )
}

const BreadCrumbs: TabProps[] = [
  {
    herf: '/home',
    content: <TicketSearch />,
    breadCrumb: [
      {
        href: '/home',
        title: (
          <>
            <UserOutlined />
            <span>12306 查询网站</span>
          </>
        )
      }
    ]
  },
  {
    herf: '/order',
    content: <TicketPreOrder />,
    breadCrumb: [
      {
        href: '/order',
        title: (
          <>
            <UserOutlined />
            <span>订单预定</span>
          </>
        )
      }
    ]
  },
  {
    herf: '/orderlist',
    content: <TicketList />,
    breadCrumb: [
      {
        href: '/orderlist',
        title: (
          <>
            <UserOutlined />
            <span>订单预定</span>
          </>
        )
      }
    ]
  },
  {
    herf: '/userInfo',
    content: <UserInfo />,
    breadCrumb: [
      {
        href: '/userInfo',
        title: (
          <>
            <UserOutlined />
            <span>个人信息</span>
          </>
        )
      }
    ]
  },
  {
    herf: '/passagerMgr',
    content: <PassagerMgr />,
    breadCrumb: [
      {
        href: '/passager/mgr',
        title: (
          <>
            <UserOutlined />
            <span>订单预定</span>
          </>
        )
      }
    ]
  }
]

const Home: React.FC = () => {
  const navigator = useNavigate()
  const location = useLocation()
  const [tabItem, setTabItems] = useState<TabProps>({
    herf: '/home',
    content: <TicketSearch />,
    breadCrumb: [HomeBreadCrumb]
  })
  useEffect(() => {
    BreadCrumbs.forEach((item) => {
      if (item.herf === location.pathname) {
        if (item.breadCrumb.length > 0 && item.breadCrumb[0].href !== '/') {
          item.breadCrumb = [HomeBreadCrumb, ...item.breadCrumb]
        }
        setTabItems(item)
      }
    })
  }, [location.pathname])

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <AvatarInfo />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={sliderItems}
            onClick={({ key }) => { navigator(`/${key}`) }}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 0px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={tabItem.breadCrumb} />
          <Content
            style={{
              padding: 0,
              margin: 0,
              height: '100%',
              background: '#fff',
              overflowY: 'scroll'
            }}
          >
            {tabItem.content}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}

export default Home
