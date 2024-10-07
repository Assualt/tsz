import { useRef, useState, useEffect } from 'react'
import { Layout } from 'element-react'
import SearchBox from './components/SearchBox'
import MenuNav from './components/MenuNav'
import TicketFilter from './components/TicketFilter'
import DetailContent from './components/DetailContent'
import ToolTips from './components/ToolTips'

import { fetchAllCities } from '@renderer/api/ticket'
import { Cities } from './constant'

const Main = () => {
  const [cities, setCities] = useState<Cities[]>([])
  const [isLoading, setLoading] = useState(false)
  const [queryResult, setQueryResult] = useState({})
  const queryFilter = useRef({
    trainType: ['不限', 'GC-高铁城际', 'D-动车', '复兴号'],
    from: ['不限', '北京', '北京南', '北京西', '北京北', '北京东'],
    to: ['不限', '北京', '北京南', '北京西', '北京北', '北京东'],
    seatType: ['不限', '一等座', '二等座', '硬座', '软卧', '硬卧', '无座', '一等卧', '二等卧'],
    date: new Date(),
    time: [new Date(), new Date()]
  })

  const handleLoading = (loading: boolean) => {
    setLoading(loading)
  }

  const handleQueryResult = (result) => {
    if (result === queryResult) return
    setQueryResult(result)
  }

  const handlePickupDate = (date) => {
    console.log(date)
  }

  useEffect(() => {
    fetchAllCities()
      .then((res) => {
        setCities(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Layout.Row gutter="10" style={{ width: '100%' }}>
      <Layout.Col span="4">
        <MenuNav></MenuNav>
      </Layout.Col>
      <Layout.Col span="20">
        <SearchBox
          onChangeLoading={handleLoading}
          onHandleQuery={handleQueryResult.bind(this)}
          cities={cities}
          isLoading={isLoading}
        ></SearchBox>
        <TicketFilter
          isLoading={isLoading}
          queryFilter={queryFilter.current}
          onPickUpDate={handlePickupDate.bind(this)}
        ></TicketFilter>
        <DetailContent isLoading={isLoading} queryResult={queryResult}></DetailContent>
        <ToolTips></ToolTips>
      </Layout.Col>
    </Layout.Row>
  )
}

export default Main
