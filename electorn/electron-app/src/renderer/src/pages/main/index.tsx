import { useRef, useState, useEffect } from 'react'
import { Layout } from 'element-react'
import SearchBox from './components/SearchBox'
import MenuNav from './components/MenuNav'
import TicketFilter from './components/TicketFilter'
import DetailContent from './components/DetailContent'
import ToolTips from './components/ToolTips'
import { message } from 'antd' // 假设使用 antd 的 message 组件
import { fetchAllCities } from '@renderer/api/ticket'
import { Cities, defaultSeatType, defaultTrainType } from './constant'

// 为函数添加返回类型，React.FC 表示 React 函数式组件
// 此组件函数需要返回 JSX 元素，确保类型兼容
const Main: React.FC = () => {
  const [cities, setCities] = useState<Cities[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [queryResult, setQueryResult] = useState({})
  const queryFilter = useRef({
    trainType: defaultTrainType,
    from: [],
    to: [],
    seatType: defaultSeatType,
    date: new Date(),
    time: [new Date(), new Date()]
  })

  // 添加返回类型 void，表示该函数不返回任何值
  const handleLoading = (loading: boolean): void => {
    setLoading(loading)
  }

  const handleQueryResult = (result) : void => {
    if (result === queryResult) return
    setQueryResult(result)
  }

  const handlePickupDate = (date): void => {
    console.log(date)
  }

  const fetchCities = async (): Promise<void> => {
    try {
      const res = await fetchAllCities()
      setCities(res.data)
    } catch (err) {
      console.log(err)
      message.error('获取城市列表失败，请稍后重试')
    }
  }

  useEffect(() => { fetchCities() }, [])

  return (
    <Layout.Row gutter="10" style={{ width: '100%' }}>
      <Layout.Col span="4">
        <MenuNav />
      </Layout.Col>
      <Layout.Col span="20">
        <SearchBox
          onChangeLoading={handleLoading}
          onHandleQuery={handleQueryResult}
          cities={cities}
          isLoading={isLoading}
        />
        <TicketFilter
          isLoading={isLoading}
          queryFilter={queryFilter.current}
          onPickUpDate={handlePickupDate}
        />
        <DetailContent isLoading={isLoading} queryResult={queryResult} />
        <ToolTips />
      </Layout.Col>
    </Layout.Row>
  )
}

export default Main
