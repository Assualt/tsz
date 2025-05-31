import { Layout, Row, Col, Tabs, Form, Checkbox, TimePicker } from 'antd'
import { useState } from 'react'

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

const getTrainLabel = (value: string) => {
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

const getTrainTypeLabel = (value: string[]) => {
  let trainTypeLabels: { code: string; label: string }[] = []
  for (let i = 0; i < value.length; ++i) {
    trainTypeLabels.push({ code: value[i], label: getTrainLabel(value[i]) })
  }
  return trainTypeLabels
}

const getStationLabel = (stations: string[]) => {
  if (stations.length == 0) {
    return []
  }

  let stationLabels: DataType[] = []
  for (let i = 0; i < stations.length; ++i) {
    stationLabels.push({ code: stations[i], label: stations[i] })
  }
  return stationLabels
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

interface DataType {
  code: string
  label: string
}

const SearchFilter = ({ isSearch, setIsSearch, searchParam, searchResultTrainTypeList }) => {
  const [form] = Form.useForm()
  const [trainType, setTrainType] = useState<DataType[]>([])
  const [trainIsIndeterminate, trainIsSelectAll] = [
    trainType.length > 0 && trainType.length < searchResultTrainTypeList.length,
    trainType.length > 0 && trainType.length == searchResultTrainTypeList.length
  ]

  const [fromStation, setFromStation] = useState<DataType[]>([])
  const [fromStationIsIndeterminate, fromStationIsSelectAll] = [
    fromStation.length > 0 && fromStation.length < getStationLabel([searchParam.from]).length,
    fromStation.length > 0 && fromStation.length == getStationLabel([searchParam.from]).length
  ]

  const [toStation, setToStation] = useState<DataType[]>([])
  const [toStationIsIndeterminate, toStationIsSelectAll] = [
    toStation.length > 0 && toStation.length < getStationLabel([searchParam.to]).length,
    toStation.length > 0 && toStation.length == getStationLabel([searchParam.to]).length
  ]

  const [seatType, setSeatType] = useState<DataType[]>([])
  const [seatTypeIsIndeterminate, seatTypeIsSelectAll] = [
    seatType.length > 0 && seatType.length < getFilterInfo().data.length,
    seatType.length > 0 && seatType.length == getFilterInfo().data.length
  ]

  return (
    <Layout
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        marginTop: '10px'
      }}
    >
      <Form
        form={form}
        layout="inline"
        style={{ width: '100%'}}
        name="filterForm"
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
                  return (
                    <Checkbox value={item.code} key={item.code}>
                      {item.label}
                    </Checkbox>
                  )
                })}
              </Checkbox.Group>
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
                  fromStationIsSelectAll
                    ? setFromStation([])
                    : setFromStation(getStationLabel([searchParam.from]))
                }}
              >
                全选
              </Checkbox>
            </Col>
            <Col span={20}>
              <Checkbox.Group
                onChange={(value) => {
                  setFromStation(value)
                }}
                value={fromStation}
              >
                {getStationLabel([searchParam.from]).map((item) => {
                  if (item.label == '') {
                    return
                  }
                  return (
                    <Checkbox value={item.code} key={item.code}>
                      {item.label}
                    </Checkbox>
                  )
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
                    : setToStation(getStationLabel([searchParam.to]))
                }}
              >
                全选
              </Checkbox>
            </Col>
            <Col span={22}>
              <Checkbox.Group onChange={setToStation} value={toStation}>
                {getStationLabel([searchParam.to]).map((item) => {
                  if (item.label == '') {
                    return
                  }
                  return (
                    <Checkbox value={item.code} key={item.code}>
                      {item.label}
                    </Checkbox>
                  )
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
                  return (
                    <Checkbox value={item.code} key={item.code}>
                      {item.label}
                    </Checkbox>
                  )
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
