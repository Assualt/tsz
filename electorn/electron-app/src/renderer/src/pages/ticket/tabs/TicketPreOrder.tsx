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
  Input,
  Tag,
  Spin,
  Modal,
  Typography
} from 'antd'
import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserOutlined, ArrowLeftOutlined, PayCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { fetchTrainDetail } from '@renderer/api/ticket'
import { getPassengers, type Passenger } from '@renderer/api/user'
import { createOrder, cancelOrder, type CreateOrderPayload } from '@renderer/api/orders'
import { TrainInfo, PassagerTableItem } from '../constants'

const { Text } = Typography

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

const getSeatString = (seatType: string): string => {
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
      return seatType
  }
}

const getTicketElement = (leftNumber: number): JSX.Element => {
  if (leftNumber > 20) {
    return <div style={{ color: 'green', fontWeight: 'bold' }}>有</div>
  } else if (leftNumber > 0) {
    return <div style={{ color: 'orange', fontWeight: 'bold' }}>{leftNumber}</div>
  } else {
    return <div style={{ color: 'gray', fontWeight: 'bold' }}>无</div>
  }
}

const getPassengerTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    成人票: '成人票',
    儿童票: '儿童票',
    学生票: '学生票',
    adult: '成人票',
    child: '儿童票',
    student: '学生票'
  }
  return typeMap[type] || type
}

const getCardTypeLabel = (cardType: string): string => {
  const typeMap: Record<string, string> = {
    居民二代身份证: '居民二代身份证',
    港澳通行证: '港澳通行证',
    台湾通行证: '台湾通行证',
    护照: '护照',
    id_card: '居民二代身份证',
    hk_macau_pass: '港澳通行证',
    taiwan_pass: '台湾通行证',
    passport: '护照'
  }
  return typeMap[cardType] || cardType
}

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

const TicketPreOrder = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()
  const [trainNo, setTrainNo] = useState<string>('')
  const [trainDate, setTrainDate] = useState<dayjs.Dayjs>()
  const [trainInfo, setTrainInfo] = useState<TrainInfo>()
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [selectedPassengerIds, setSelectedPassengerIds] = useState<string[]>([])
  const [passagersData, setPassagersData] = useState<PassagerTableItem[]>([])
  const [loading, setLoading] = useState(false)
  const [createOrderLoading, setCreateOrderLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)
  const [createdOrderNo, setCreatedOrderNo] = useState<string>('')
  const [orderCreatedTime, setOrderCreatedTime] = useState<string>('')
  const [countdown, setCountdown] = useState<number>(60)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const pathName = location.search.replace('?', '')
    const params = new URLSearchParams(pathName)
    const [no, date] = [params.get('trainNo'), params.get('trainDate')]

    if (no && date) {
      setTrainNo(no)
      setTrainDate(dayjs(date, 'YYYY_MM_DD'))
      loadData(no, date)
    }
  }, [])

  useEffect(() => {
    return () => {
      stopCountdown()
    }
  }, [])

  const loadData = async (trainNum: string, trainDateStr: string) => {
    setLoading(true)
    try {
      const [trainRes, passengerRes] = await Promise.all([
        fetchTrainDetail(trainNum, trainDateStr),
        getPassengers()
      ])

      if (trainRes?.data) {
        setTrainInfo(trainRes.data)
      }

      if (passengerRes?.data && Array.isArray(passengerRes.data)) {
        setPassengers(passengerRes.data)
      } else if (passengerRes?.data?.data) {
        setPassengers(passengerRes.data.data)
      }
    } catch (err: any) {
      message.error('加载数据失败：' + (err.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedPassengerIds.length > 0 && passengers.length > 0) {
      const defaultSeatType = trainInfo?.ticket?.[0]?.seatType || 'second'
      const data: PassagerTableItem[] = selectedPassengerIds.map((id, index) => {
        const passenger = passengers.find((p) => p.id === id)
        return {
          key: `${index}`,
          passagerType: passenger?.type || '成人票',
          seatType: defaultSeatType,
          name: passenger?.name || '',
          idCardType: passenger?.id_card_type || '居民二代身份证',
          idCard: passenger?.id_card || ''
        }
      })
      setPassagersData(data)
    } else {
      setPassagersData([])
    }
  }, [selectedPassengerIds, passengers, trainInfo])

  const handlePassengerChange = (checkedIds: string[]) => {
    setSelectedPassengerIds(checkedIds)
  }

  const handleSeatChange = (record: PassagerTableItem, newSeatType: string) => {
    const updatedData = passagersData.map((item) => {
      if (item.key === record.key) {
        return { ...item, seatType: newSeatType }
      }
      return item
    })
    setPassagersData(updatedData)
  }

  const handleBack = () => {
    const searchParams = {
      from: trainInfo?.train_from || '',
      to: trainInfo?.train_to || '',
      date: trainDate?.format('YYYY-MM-DD') || ''
    }
    localStorage.setItem('searchParams', JSON.stringify(searchParams))
    localStorage.setItem('autoSearch', 'true')
    navigate('/home')
  }

  const getTotalPrice = (): number => {
    if (!trainInfo?.ticket || passagersData.length === 0) return 0
    let total = 0
    for (const item of passagersData) {
      const ticketInfo = trainInfo.ticket.find((t) => t.seatType === item.seatType)
      if (ticketInfo) {
        total += ticketInfo.price
      }
    }
    return total
  }

  const validateAndSubmit = (): boolean => {
    if (!trainInfo) {
      message.warning('请选择车次信息')
      return false
    }
    if (passagersData.length === 0) {
      message.warning('请至少选择一位乘客')
      return false
    }
    for (const passenger of passagersData) {
      if (!passenger.name || !passenger.idCard) {
        message.warning('乘客信息不完整，请检查')
        return false
      }
    }
    return true
  }

  const startCountdown = () => {
    setCountdown(60)
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
    }
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
          }
          message.warning('支付时间已过期，请重新预定')
          setShowPaymentModal(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
  }

  const handleCancelOrder = async () => {
    if (createdOrderId) {
      try {
        await cancelOrder(createdOrderId)
        message.info('订单已取消')
      } catch {
        // 取消失败也允许关闭弹窗
      }
    }
    stopCountdown()
    setShowPaymentModal(false)
    setCreatedOrderId(null)
    setCreatedOrderNo('')
  }

  const handleNextStep = async () => {
    if (!validateAndSubmit()) return
    if (!trainInfo || !trainDate) {
      message.error('订单信息异常')
      return
    }

    setCreateOrderLoading(true)
    try {
      const firstPassenger = passagersData[0]
      const passengersData = passagersData.map((p) => ({
        name: p.name,
        idCard: p.idCard,
        seatType: p.seatType
      }))
      const payload: CreateOrderPayload = {
        train_num: trainInfo.train_num,
        train_date: trainDate.format('YYYY-MM-DD'),
        train_start_time: trainInfo.train_start_time,
        train_end_time: trainInfo.train_end_time,
        from_station: trainInfo.train_from,
        to_station: trainInfo.train_to,
        seat_type: firstPassenger.seatType,
        passenger_name: firstPassenger.name,
        passenger_id_card: firstPassenger.idCard,
        passenger_count: passagersData.length,
        passengers: JSON.stringify(passengersData),
        price: getTotalPrice()
      }

      const res = await createOrder(payload)
      const orderId = res.data?.id || res?.id
      const orderNo = res.data?.order_no || res?.order_no
      const createdTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

      if (orderId && orderNo) {
        setCreatedOrderId(orderId)
        setCreatedOrderNo(orderNo)
        setOrderCreatedTime(createdTime)
        setShowPaymentModal(true)
        startCountdown()
        message.success('订单创建成功，请在1分钟内完成支付')
      } else {
        throw new Error('订单创建失败')
      }
    } catch (err: any) {
      message.error('创建订单失败：' + (err.message || '未知错误'))
    } finally {
      setCreateOrderLoading(false)
    }
  }

  const handleConfirmPayment = () => {
    if (!createdOrderId) {
      message.error('订单信息异常，请重新创建订单')
      setShowPaymentModal(false)
      return
    }

    stopCountdown()
    setShowPaymentModal(false)
    navigate(`/payment?orderId=${createdOrderId}`)
  }

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTime = (timeStr?: string): string => {
    if (!timeStr) return '--:--'
    try {
      return dayjs(timeStr, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
    } catch {
      return timeStr
    }
  }

  const passagerColumns: TableProps<PassagerTableItem>['columns'] = [
    {
      title: '序号',
      render: (_: any, __: PassagerTableItem, index: number) => `${index + 1}`
    },
    {
      title: '票种',
      render: (_: any, record: PassagerTableItem): JSX.Element => {
        return (
          <Select
            value={getPassengerTypeLabel(record.passagerType)}
            options={passageType}
            style={{ width: 120 }}
            disabled
          />
        )
      }
    },
    {
      title: '席别',
      render: (_: any, record: PassagerTableItem): JSX.Element => {
        return (
          <Select
            style={{ width: 140 }}
            value={record.seatType}
            onChange={(value) => handleSeatChange(record, value)}
          >
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
      render: (_: any, record: PassagerTableItem) => `${record.name}`
    },
    {
      title: '证件号码',
      render: (_: any, record: PassagerTableItem): JSX.Element => {
        return <Input value={record.idCard} style={{ width: 160 }} disabled />
      }
    },
    {
      title: '证件类型',
      render: (_: any, record: PassagerTableItem): JSX.Element => {
        return (
          <Select
            value={getCardTypeLabel(record.idCardType)}
            style={{ width: 160 }}
            options={idCardType}
          />
        )
      }
    },
    {
      title: '票价',
      render: (_: any, record: PassagerTableItem): JSX.Element => {
        const ticketInfo = trainInfo?.ticket?.find((t) => t.seatType === record.seatType)
        return (
          <Text strong style={{ color: '#f5222d' }}>
            {ticketInfo ? `￥${ticketInfo.price}` : '--'}
          </Text>
        )
      }
    },
    {
      title: '状态',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_: any, __: PassagerTableItem): JSX.Element => {
        return <Tag color="green">有效</Tag>
      }
    }
  ]

  const totalPrice = getTotalPrice()

  return (
    <Layout>
      <div
        style={{
          padding: '16px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回车票查询
        </Button>
        {passagersData.length > 0 && (
          <Space>
            <Text>共 {passagersData.length} 人</Text>
            <Text strong style={{ color: '#f5222d', fontSize: 18 }}>
              合计：¥{totalPrice.toFixed(2)}
            </Text>
            <Button
              type="primary"
              icon={<PayCircleOutlined />}
              size="large"
              onClick={handleNextStep}
              disabled={passagersData.length === 0}
            >
              创建订单并支付
            </Button>
          </Space>
        )}
      </div>

      <Spin spinning={loading}>
        <Card title={CardTitle}>
          <Space direction="horizontal">
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>
              {trainDate?.format('YYYY-MM-DD')}
            </span>
            <span style={{ fontWeight: 'bold', color: 'red', fontSize: '2.3vh' }}>{trainNo}次</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>{trainInfo?.train_from}</span>
            <span>站</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>
              ({dayjs(trainInfo?.train_start_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} 开)
            </span>
            <span>--------</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>{trainInfo?.train_to}</span>
            <span>站</span>
            <span style={{ fontWeight: 'bold', fontSize: '2.3vh' }}>
              ({dayjs(trainInfo?.train_end_time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} 到)
            </span>
          </Space>
          <Divider dashed />
          <Space direction="horizontal">
            {trainInfo?.ticket?.map((item) => {
              return (
                <Space direction="horizontal" key={item.seatType}>
                  <span key={item.seatType}>{getSeatString(item.seatType)}</span>
                  <span style={{ color: 'rgb(252, 131, 2)', fontWeight: 'bold' }}>
                    (￥{item.price})
                  </span>
                  {getTicketElement(item.left)}
                </Space>
              )
            })}
          </Space>
          <Divider type="horizontal" />
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
            <Checkbox.Group onChange={handlePassengerChange} value={selectedPassengerIds}>
              {passengers.map((item) => {
                return (
                  <Checkbox value={item.id} key={item.id}>
                    {item.name} ({getPassengerTypeLabel(item.type)})
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </Space>
          <Table<PassagerTableItem> columns={passagerColumns} dataSource={passagersData} />
        </Card>

        <Divider />
      </Spin>

      <Modal
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>确认订单</span>
            <Tag color={countdown < 300 ? 'red' : 'green'}>
              支付剩余 {formatCountdown(countdown)}
            </Tag>
          </Space>
        }
        open={showPaymentModal}
        onCancel={handleCancelOrder}
        onOk={handleConfirmPayment}
        confirmLoading={createOrderLoading}
        okText="前往支付"
        cancelText="取消"
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <div
            style={{
              padding: 16,
              background: '#f6f8fa',
              borderRadius: 8,
              border: '1px solid #e8e8e8'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12
              }}
            >
              <Space>
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  {trainInfo?.train_num}次
                </Text>
                <Text strong>
                  {trainInfo?.train_from} → {trainInfo?.train_to}
                </Text>
              </Space>
              <Text type="secondary">{trainDate?.format('YYYY-MM-DD')}</Text>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                background: '#fff',
                borderRadius: 6,
                border: '1px dashed #d9d9d9'
              }}
            >
              <Space size={16} align="center">
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ color: '#52c41a', fontSize: 20 }}>
                    {formatTime(trainInfo?.train_start_time)}
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      出发
                    </Text>
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: 18 }}>
                  ～
                </Text>
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ color: '#52c41a', fontSize: 20 }}>
                    {formatTime(trainInfo?.train_end_time)}
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      到达
                    </Text>
                  </div>
                </div>
              </Space>
            </div>
            <div style={{ marginTop: 12 }}>
              <Text>乘车人：</Text>
              <Text strong>{passagersData.map((p) => p.name).join('、')}</Text>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              background: '#fffbe6',
              borderRadius: 8,
              border: '1px solid #ffe58f'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text type="secondary">订单流水号</Text>
              <Text strong copyable style={{ fontSize: 13 }}>
                {createdOrderNo}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text type="secondary">订单编号</Text>
              <Text strong>#{createdOrderId}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">下单时间</Text>
              <Text>{orderCreatedTime}</Text>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#fff1f0',
              borderRadius: 6,
              border: '1px solid #ffa39e'
            }}
          >
            <Text strong style={{ fontSize: 14 }}>
              应付金额
            </Text>
            <Text strong style={{ fontSize: 24, color: '#f5222d' }}>
              ¥{totalPrice.toFixed(2)}
            </Text>
          </div>
        </Space>
      </Modal>
    </Layout>
  )
}

export default TicketPreOrder
