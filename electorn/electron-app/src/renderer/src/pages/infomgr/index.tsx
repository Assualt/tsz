import React, { useEffect, useState } from 'react'
import { TabProps } from '../common/constants'
import UserInfo from './tabs/UserInfo'
import PassagerInfoMgr from './tabs/PassagerInfoMgr'
import { useLocation } from 'react-router-dom'

const InfoMgrList: TabProps[] = [
  {
    key: '/userInfo',
    title: '个人信息',
    component: <UserInfo />
  },
  {
    key: '/passagerInfo',
    title: '乘客信息管理',
    component: <PassagerInfoMgr />
  }
]

const InfoMgr: React.FC = () => {
  const [item, setItem] = useState<TabProps>(InfoMgrList[0])
  const location = useLocation()

  useEffect(() => {
    console.log('useEffect', location.pathname)
    const infoMgrItem = InfoMgrList.find((item) => item.key === location.pathname) // 找到匹配的 TabProps 对象
    if (infoMgrItem) {
      setItem(infoMgrItem) // 更新 item 状态
    } else {
      console.error(`No matching tab found for key: ${location.pathname}`)
    }
  }, [item, location])

  return <>{item.component}</>
}

export default InfoMgr
