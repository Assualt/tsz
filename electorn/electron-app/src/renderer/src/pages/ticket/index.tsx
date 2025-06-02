import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TicketPreOrder from './tabs/TicketPreOrder'
import TicketList from './tabs/TicketList'
import { TabProps } from '../common/constants'

const TicketInfoList: TabProps[] = [
  {
    key: '/order',
    title: '预订单',
    component: <TicketPreOrder />
  },
  {
    key: '/orderlist',
    title: '订单列表',
    component: <TicketList />
  }
]

const InfoMgr: React.FC = () => {
  const [item, setItem] = useState<TabProps>(TicketInfoList[0])
  const location = useLocation()

  useEffect(() => {
    console.log('useEffect', location.pathname)
    const infoMgrItem = TicketInfoList.find((item) => item.key === location.pathname) // 找到匹配的 TabProps 对象
    if (infoMgrItem) {
      setItem(infoMgrItem) // 更新 item 状态
    } else {
      console.error(`No matching tab found for key: ${location.pathname}`)
    }
  }, [item, location])

  return <>{item.component}</>
}

export default InfoMgr
