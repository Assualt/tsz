import React, { useEffect } from 'react'

import './style.css'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import { BreadcrumbItemProps, Layout, Menu, MenuProps, Breadcrumb } from 'antd'
import { Footer } from 'antd/es/layout/layout'

import SearchBox from './components/SearchBox'
import SearchFilter from './components/SearchFilter'
import Result from './components/Result'
import AvatarInfo from './components/AvatarInfo'

import dayjs from 'dayjs'

// api
import { fetchAllCities } from '../../api/ticket'
import { SearchResultField, SearchBoxField, Train } from './Constant'

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
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
].map((icon, index) => {
  const key = String(index + 1)

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(1).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1
      return {
        key: subKey,
        label: `option${subKey}`
      }
    })
  }
})

const breadcrumbItemes: BreadcrumbItemProps['items'] = [{ title: '12306' }, { title: '车票查询' }]

const Home: React.FC = () => {
  const [stations, setStations] = React.useState<Train[]>([])
  const [isSearch, setIsSearch] = React.useState(false)
  const [searchResult, setSearchResult] = React.useState<SearchResultField[]>([])
  const [searchParam, setSearchParam] = React.useState<SearchBoxField>({
    from: '',
    to: '',
    date: dayjs()
  })
  const [searchResultTrainTypeList, setSearchResultTrainTypeList] = React.useState<string[]>([])

  const convertToSearchResult = (data: SearchResultField[]) => {
    let trainTypeList: string[] = []
    for (let i = 0; i < data.length; i++) {
      data[i].begin_time = dayjs(data[i].begin_time, 'YYYY-MM-DD HH:mm:ss')
      data[i].end_time = dayjs(data[i].end_time, 'YYYY-MM-DD HH:mm:ss')
      let type = data[i].trainNo[0]
      if (trainTypeList.indexOf(type) === -1) {
        trainTypeList.push(type)
      }
    }

    setSearchResultTrainTypeList(trainTypeList)
    setSearchResult(data)
  }

  useEffect(() => {
    fetchAllCities()
      .then((res) => {
        setStations(res.data)
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
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
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItemes} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff'
            }}
          >
            <SearchBox
              stations={stations}
              isSearch={isSearch}
              setIsSearch={setIsSearch}
              setSearchResult={convertToSearchResult}
              setSearchParam={setSearchParam}
            />
            <SearchFilter
              isSearch={isSearch}
              setIsSearch={setIsSearch}
              searchParam={searchParam}
              searchResultTrainTypeList={searchResultTrainTypeList}
            />
            <Result isSearch={isSearch} searchResult={searchResult} searchParam={searchParam} />
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}

export default Home
