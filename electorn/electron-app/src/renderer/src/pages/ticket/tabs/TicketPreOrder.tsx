import {
  Card,
  Checkbox,
  Table,
  Divider,
  Layout,
  Space,
  message,
  TableProps,
  Button,
  Select,
  Input
} from 'antd'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserOutlined, CloseCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { fetchTrainDetail } from '@renderer/api/ticket'
import { getUserPassengers, getPassengerInfo } from '@renderer/api/user'
import { TrainInfo, Passager, PassagerTableItem } from '../constants'

const CardTitle: JSX.Element = (
  <Space direction="horizontal">
    <span style={{ color: '#8c8c8c', fontWeight: 'bold', fontSize: '2.3vh' }}>列表信息</span>
    <span style={{ color: '#8c8c8c', fontWeight: 'bold' }}>(以下余票仅供参考)</span>
  </Space>
)

const UserTitle: JSX.Element = (
  <Space direction="horizontal">
    <span style={{ color: '#8c8c8c', fontWeight: 'bold', fontSize: '2.3vh' }}>乘客信息</span>
    <span style={{ color: '#8c8c8c', fontWeight: 'bold' }}>(填写说明)</span>
  </Space>
)

const getSeatString = (seatType: string) => {
  switch (seatType) {
    case 'business':
      return '商务座'
    case 'first':
      return '一等座'
    case 'second':
      return '二等座'
    case 'special':
      return '特等座'
    default:
      break
  }

  return ''
}

const getTicketElement = (leftNumber: number): JSX.Element => {
  // 如果leftNumber大于20，则返回一个绿色的div
  if (leftNumber > 20) {
    return <div style={{ color: 'green', fontWeight: 'bold' }}>有</div>
  } else if (leftNumber > 0) {
    // 如果leftNumber等于0，则返回一个黄色的div
    return <div style={{ color: 'orange', fontWeight: 'bold' }}>{leftNumber}</div>
  } else {
    return <div style={{ color: 'gray', fontWeight: 'bold' }}>无</div>
  }
}

const TicketPreOrder = (): JSX.Element => {
  const location = useLocation()
  const [trainNo, setTrainNo] = useState<string>('')
  const [trainDate, setTrainDate] = useState<dayjs.Dayjs>()
  const [trainInfo, setTrainInfo] = useState<TrainInfo>()
  const [passagers, setPassagers] = useState<Passager[]>([])
  const [passagersData, setPassagersData] = useState<PassagerTableItem[]>([])

  useEffect(() => {
    const pathName = location.search.replace('?', '')
    const params = new URLSearchParams(pathName)
    const [no, date] = [params.get('trainNo'), params.get('trainDate')]

    if (no && date) {
      setTrainNo(no)
      setTrainDate(dayjs(date, 'YYYY_MM_DD'))
      fetchTrainDetail(no, date)
        .then((res) => {
          setTrainInfo(res.data)
        })
        .catch((err) => {
          message.error(err)
        })

      getUserPassengers('')
        .then((res) => {
          setPassagers(res.data)
        })
        .catch((err) => {
          message.error(err)
        })
    }
  }, [])

  const passageType = [
    { value: '成人票', label: '成人票' },
    { value: '儿童票', label: '儿童票' },
    { value: '学生票', label: '学生票' }
  ]

  const idCardType = [
    { value: '居民二代身份证', label: '居民二代身份证' },
    { value: '港澳通行证', label: '港澳通行证' },
    { value: '台湾通行证', label: '台湾通行证' },
    { value: '护照', label: '护照' }
  ]

  const optionDelete = (key: string): JSX.Element => {
    return (
      <Button
        onClick={() => console.log('delete' + record.key)}
        icon={<CloseCircleOutlined />}
        type="text"
      />
    )
  }

  const passagerColumns: TableProps<PassagerTableItem>['columns'] = [
    {
      title: '序号',
      render: (_, _1, index) => `${index + 1}`
    },
    {
      title: '票种',
      render: (_, record): JSX.Element => {
        return (
          <Select
            value={record.passagerType}
            options={passageType}
            style={{ width: 120 }}
            disabled
          />
        )
      }
    },
    {
      title: '席别',
      render: (_, record): JSX.Element => {
        return (
          <Select style={{ width: 120 }} value={record.seatType}>
            {trainInfo?.ticket?.map((item) => {
              return (
                <Select.Option key={item.seatType} value={item.seatType}>
                  {`${getSeatString(item.seatType)} ￥${item.price}`}
                </Select.Option>
              )
            })}
          </Select>
        )
      }
    },
    {
      title: '姓名',
      render: (_, record) => `${record.name}`
    },
    {
      title: '证件号码',
      render: (_, record): JSX.Element => {
        return <Input value={record.idCard} style={{ width: 160 }} disabled />
      }
    },
    {
      title: '证件类型',
      render: (_, record): JSX.Element => {
        return <Select value={record.idCardType} style={{ width: 160 }} options={idCardType} />
      }
    },
    {
      title: '状态',
      render: (_, record): JSX.Element => {
        return <Tag color="green">有效</Tag>
      }
    }
  ]

  const updatePassagers = (passagers: string[]) => {
    let tmpData: PassagerTableItem[] = []
    passagers.forEach((item, index) => {
      getPassengerInfo(item)
        .then((res) => {
          tmpData = [
            ...tmpData,
            {
              key: `${index}`,
              passagerType: res.data.type,
              seatType: '二等座',
              name: item,
              idCardType: res.data.idCardType,
              idCard: res.data.idCard
            }
          ]

          setPassagersData(tmpData)
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }

  return (
    <>
      <Layout>
        <Card title={CardTitle}>
          <Space direction="horizontal">
            <span
              style={{ fontWeight: 'bold', fontSize: '2.3vh' }}
            >{`${trainDate?.format('YYYY-MM-DD')}`}</span>
            <span style={{ fontWeight: 'bold' }}>周四</span>
            <span style={{ fontWeight: 'bold', color: 'red', fontSize: '2.3vh' }}>
              {`${trainNo}`}次
            </span>
            <span
              style={{ fontWeight: 'bold', fontSize: '2.3vh' }}
            >{`${trainInfo?.trainFrom}`}</span>
            <span>站</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>
              ({`${dayjs(trainInfo?.trainStartTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}`} 开)
            </span>
            <span>--------</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>{`${trainInfo?.trainTo}`}</span>
            <span>站</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>
              ({`${dayjs(trainInfo?.trainEndTime, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}`} 到)
            </span>
          </Space>
          <Divider dashed />
          <Space direction="horizontal">
            {trainInfo?.ticket?.map((item) => {
              return (
                <Space direction="horizontal" key={item.seatType}>
                  <span key={item.seatType}>{`${getSeatString(item.seatType)}`}</span>
                  <span style={{ color: 'rgb(252, 131, 2)', fontWeight: 'bold' }}>
                    (￥{`${item.price}`})
                  </span>
                  {getTicketElement(item.left)}
                </Space>
              )
            })}
          </Space>
          <Divider type="horizontal"></Divider>
          <Space direction="vertical">
            <span style={{ color: 'blueviolet' }}>
              *显示的卧铺票价均为上铺票价,供您参考,具体票价以您支付时实际购买的铺别票价为准
            </span>
          </Space>
        </Card>
        <Divider />
        <Card title={UserTitle}>
          <Space direction="vertical">
            <span>
              <UserOutlined />
              乘车人
            </span>
            <Checkbox.Group onChange={updatePassagers}>
              {passagers.map((item) => {
                return (
                  <Checkbox value={item.name} key={item.id}>
                    {item.name}
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </Space>
          <Table<PassagerTableItem> columns={passagerColumns} dataSource={passagersData} />
        </Card>

        <Divider />
      </Layout>
    </>
  )
}

export default TicketPreOrder
