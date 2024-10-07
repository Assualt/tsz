import { Layout, Row, Col, Tabs, Form, Checkbox, TimePicker, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const getNext15Days = () => {
  let days = []
  for (let i = 0; i < 20; i++) {
    days.push(dayjs().add(i, 'day'))
  }
  return days
}

const dateTabsItem = getNext15Days().map((item, index) => {
  return {
    label: item.format('MM-DD'),
    key: item.format('YYYY-MM-DD'),
    children: '',
    style: { color: 'black', backgroundColor: 'red' }
  }
})

const onTabActive = (key: string) => {}

const onFinish = (values: any, func) => {
  console.log('Success:', values)
  func(true)
  setTimeout(() => {
    func(false)
  }, 3000)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const getTrainLabel = (value: String) => {
  let trainLabels = {
    G: '高铁',
    D: '动车',
    K: '快速',
    T: '特快',
    Z: '直达',
    Y: '旅游',
    C: '城际',
    S: '城域'
  }

  return trainLabels[value]
}

const getTrainTypeLabel = (value: Array<string>) => {
  let trainTypeLabels = []
  for (let i = 0; i < value.length; ++i) {
    trainTypeLabels.push({ code: value[i], label: getTrainLabel(value[i]) })
  }
  return trainTypeLabels
}

const getStationLabel = (station: String) => {
  if (station == '') {
    return []
  }
  return [{ code: station, label: station }]
}

const getFilterInfo = () => {
  return {
    size: 4,
    data: [
      {
        code: '商务座',
        label: '商务座'
      },
      {
        code: '特等座',
        label: '特等座'
      },
      {
        code: '一等座',
        label: '一等座'
      },
      {
        code: '二等座',
        label: '二等座'
      },
      {
        code: '硬卧',
        label: '硬卧'
      },
      {
        code: '硬座',
        label: '硬座'
      },
      {
        code: '无座',
        label: '无座'
      }
    ]
  }
}

const SearchFilter: React.FC = ({
  isSearch,
  setIsSearch,
  searchParam,
  searchResultTrainTypeList
}) => {
  const [form] = Form.useForm()
  const [trainType, setTrainType] = useState<String[]>([])
  const [trainIsIndeterminate, trainIsSelectAll] = [
    trainType.length > 0 && trainType.length < searchResultTrainTypeList.length,
    trainType.length > 0 && trainType.length == searchResultTrainTypeList.length
  ]

  const [fromStation, setFromStation] = useState<String[]>([])
  const [fromStationIsIndeterminate, fromStationIsSelectAll] = [
    fromStation.length > 0 && fromStation.length < getStationLabel(searchParam.from).length,
    fromStation.length > 0 && fromStation.length == getStationLabel(searchParam.from).length
  ]

  const [toStation, setToStation] = useState<String[]>([])
  const [toStationIsIndeterminate, toStationIsSelectAll] = [
    toStation.length > 0 && toStation.length < getStationLabel(searchParam.to).length,
    toStation.length > 0 && toStation.length == getStationLabel(searchParam.to).length
  ]

  const [seatType, setSeatType] = useState<String[]>([])
  const [seatTypeIsIndeterminate, seatTypeIsSelectAll] = [
    seatType.length > 0 && seatType.length < getFilterInfo().data.length,
    seatType.length > 0 && seatType.length == getFilterInfo().data.length
  ]

  const [pickupTimeKey, setPickupTimeKey] = useState<number>(0)

  useEffect(() => {
    setPickupTimeKey(searchParam.date.format('YYYY-MM-DD'))
  }, [searchParam, isSearch])

  return (
    <Layout
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        // border: '1px solid #e0e0e0',
        marginTop: '2vh'
      }}
    >
      <Tabs
        defaultActiveKey="1"
        size="small"
        items={dateTabsItem}
        type="card"
        tabPosition="top"
        onChange={onTabActive}
        activeKey={pickupTimeKey}
      ></Tabs>

      <Form
        form={form}
        layout="inline"
        style={{ width: '100%' }}
        name="basic"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 18 }}
        initialValues={{ remember: true }}
        onFinish={(value) => onFinish(value, setIsSearch)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={isSearch}
      >
        <Form.Item
          label="车次类型"
          style={{ fontWeight: 'bold', width: '100%', fontSize: '20px', lineHeight: '32px' }}
        >
          <Row>
            <Col span={2}>
              <Checkbox
                indeterminate={trainIsIndeterminate}
                checked={trainIsSelectAll}
                onClick={() => {
                  trainIsSelectAll ? setTrainType([]) : setTrainType(searchResultTrainTypeList)
                }}
              >
                全选
              </Checkbox>
            </Col>
            <Col span={16}>
              <Checkbox.Group onChange={setTrainType} value={trainType}>
                {getTrainTypeLabel(searchResultTrainTypeList).map((item) => {
                  return <Checkbox value={item.code}>{item.label}</Checkbox>
                })}
              </Checkbox.Group>
            </Col>
            <Col span={2}>出发时间</Col>
            <Col span={4}>
              <TimePicker.RangePicker defaultValue={dayjs()} format="HH:mm:ss" />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="出发车站"
          style={{ fontWeight: 'bold', width: '100%', fontSize: '20px', lineHeight: '20px' }}
        >
          <Row>
            <Col span={2}>
              <Checkbox
                indeterminate={fromStationIsIndeterminate}
                checked={fromStationIsSelectAll}
                onClick={() => {
                  console.log(fromStation, fromStationIsSelectAll)
                  fromStationIsSelectAll
                    ? setFromStation([])
                    : setFromStation(getStationLabel(searchParam.from))
                    console.log(fromStation, fromStationIsSelectAll)
                }}
              >
                全选
              </Checkbox>
            </Col>
            <Col span={20}>
              <Checkbox.Group onChange={setFromStation} value={fromStation}>
                {getStationLabel(searchParam.from).map((item) => {
                  if (item.label == '') {
                    return
                  }
                  return <Checkbox value={item.code}>{item.label}</Checkbox>
                })}
              </Checkbox.Group>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="到达车站"
          style={{ fontWeight: 'bold', width: '100%', fontSize: '20px', lineHeight: '20px' }}
        >
          <Row>
            <Col span={2}>
              <Checkbox
                indeterminate={toStationIsIndeterminate}
                checked={toStationIsSelectAll}
                onClick={() => {
                  toStationIsSelectAll
                    ? setToStation([])
                    : setToStation(getStationLabel(searchParam.to))
                }}
              >
                全选
              </Checkbox>
            </Col>
            <Col span={22}>
              <Checkbox.Group onChange={setToStation} value={toStation}>
                {getStationLabel(searchParam.to).map((item) => {
                  if (item.label == '') {
                    return
                  }
                  return <Checkbox value={item.code}>{item.label}</Checkbox>
                })}
              </Checkbox.Group>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="车次席别"
          style={{ fontWeight: 'bold', width: '100%', fontSize: '20px', lineHeight: '20px' }}
        >
          <Row>
            <Col span={2}>
              <Checkbox indeterminate={seatTypeIsIndeterminate} checked={seatTypeIsSelectAll}>
                全选
              </Checkbox>
            </Col>
            <Col span={22}>
              <Checkbox.Group onChange={setSeatType} value={seatType}>
                {getFilterInfo().data.map((item) => {
                  return <Checkbox value={item.code}>{item.label}</Checkbox>
                })}
              </Checkbox.Group>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Layout>
  )
}

export default SearchFilter
