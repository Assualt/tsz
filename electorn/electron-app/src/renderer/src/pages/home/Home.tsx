import React, { useEffect, useState } from 'react'

import './style.css'
import { UserOutlined, HomeOutlined } from '@ant-design/icons'
import { Layout, Menu, MenuProps, Breadcrumb } from 'antd'
import { Footer } from 'antd/es/layout/layout'

import AvatarInfo from './components/AvatarInfo'

// api
import { useLocation } from 'react-router-dom'
import TicketSearch from './tabs/TicketSearch'
import TicketPreOrder from './tabs/TicketPreOrder'

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
        key: '2',
        label: '车票查询'
      },
      {
        key: '3',
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
        key: '5',
        label: '个人信息'
      },
      {
        key: '6',
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
            <span>订单查询</span>
          </>
        )
      }
    ]
  }
]

const Home: React.FC = () => {
  const location = useLocation()
  const [tabItem, setTabItems] = useState<TabProps>({
    herf: '/home',
    content: <TicketSearch />,
    breadCrumb: [HomeBreadCrumb]
  })
  useEffect(() => {
    BreadCrumbs.forEach((item) => {
      if (item.herf === location.pathname) {
        let props = item
        props.breadCrumb = [HomeBreadCrumb, ...item.breadCrumb]
        setTabItems(props)
      }
    })
  }, [])

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
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={tabItem.breadCrumb} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff'
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
