import { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Space, message, Typography, Divider, Spin, Tag } from 'antd'
import {
  WechatOutlined,
  AlipayCircleOutlined,
  CreditCardOutlined,
  WalletOutlined,
  ArrowLeftOutlined,
  CloseCircleFilled
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { payOrder, getOrderById, cancelOrder } from '@renderer/api/orders'
import Copyright from '@renderer/components/Copyright'

const { Title, Text } = Typography

interface PaymentInfo {
  orderId: number
  orderNo: string
  trainNum: string
  trainDate: string
  trainStartTime?: string
  trainEndTime?: string
  fromStation: string
  toStation: string
  seatType: string
  passengerName: string
  passengerCount: number
  passengers?: string | null
  price: number
}

const PAYMENT_METHODS = [
  {
    key: 'wechat',
    title: '微信支付',
    description: '使用微信扫码或免密支付',
    icon: <WechatOutlined style={{ fontSize: 32, color: '#07C160' }} />,
    badge: <Tag color="green">推荐</Tag>,
    qrPrefix: 'weixin://'
  },
  {
    key: 'alipay',
    title: '支付宝',
    description: '使用支付宝扫码或免密支付',
    icon: <AlipayCircleOutlined style={{ fontSize: 32, color: '#1677FF' }} />,
    badge: null,
    qrPrefix: 'alipay://'
  },
  {
    key: 'unionpay',
    title: '银联支付',
    description: '使用银联银行卡支付',
    icon: <CreditCardOutlined style={{ fontSize: 32, color: '#E60012' }} />,
    badge: null,
    qrPrefix: 'unionpay://'
  },
  {
    key: 'balance',
    title: '余额支付',
    description: '使用账户余额支付',
    icon: <WalletOutlined style={{ fontSize: 32, color: '#FA8C16' }} />,
    badge: null,
    qrPrefix: 'balance://'
  }
]

const Payment = (): JSX.Element => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string>('wechat')
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [qrCodeLoading, setQrCodeLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const orderId = params.get('orderId')

    if (!orderId) {
      message.error('订单信息丢失，请重新预定')
      navigate('/home')
      return
    }

    fetchOrderDetail(parseInt(orderId))

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current)
            countdownTimerRef.current = null
          }
          setIsExpired(true)
          message.warning('支付时间已过期')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
    }
  }, [])

  const fetchOrderDetail = async (orderId: number) => {
    setLoading(true)
    try {
      const res = await getOrderById(orderId)
      const orderData = res.data

      setPaymentInfo({
        orderId: orderData.id,
        orderNo: orderData.order_no,
        trainNum: orderData.train_num,
        trainDate: orderData.train_date,
        trainStartTime: orderData.train_start_time,
        trainEndTime: orderData.train_end_time,
        fromStation: orderData.from_station,
        toStation: orderData.to_station,
        seatType: orderData.seat_type,
        passengerName: orderData.passenger_name,
        passengerCount: orderData.passenger_count || 1,
        passengers: orderData.passengers || null,
        price: orderData.price
      })
    } catch (err) {
      message.error('获取订单信息失败：' + (err instanceof Error ? err.message : '未知错误'))
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  const [cancelling, setCancelling] = useState(false)

  const handleBack = async () => {
    if (!paymentInfo) {
      navigate('/home')
      return
    }

    setCancelling(true)
    try {
      await cancelOrder(paymentInfo.orderId)
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
        countdownTimerRef.current = null
      }
      message.info('订单已取消')
    } catch {
      // 取消失败也允许返回
    } finally {
      setCancelling(false)
      navigate('/home')
    }
  }

  const handlePayment = async () => {
    if (!paymentInfo) {
      message.error('订单信息异常')
      return
    }

    if (isExpired) {
      message.error('订单已过期，请重新预定')
      return
    }

    setPaymentLoading(true)
    try {
      await payOrder(paymentInfo.orderId, selectedMethod)
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current)
      }
      message.success('支付成功！')
      setTimeout(() => {
        navigate('/orderlist')
      }, 1500)
    } catch (err) {
      message.error('支付失败：' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setPaymentLoading(false)
    }
  }

  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateQrCodeUrl = (method: string): string => {
    if (!paymentInfo || isExpired) return ''
    const methodConfig = PAYMENT_METHODS.find((m) => m.key === method)
    const qrContent = `${methodConfig?.qrPrefix || ''}pay?orderNo=${paymentInfo.orderNo}&amount=${paymentInfo.price}`
    const encodedContent = encodeURIComponent(qrContent)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedContent}`
  }

  const qrCodeUrl = useMemo(() => {
    if (!paymentInfo || isExpired) return ''
    setQrCodeLoading(true)
    setTimeout(() => setQrCodeLoading(false), 300)
    return generateQrCodeUrl(selectedMethod)
  }, [selectedMethod, paymentInfo, isExpired])

  const formatTime = (timeStr?: string): string => {
    if (!timeStr) return '--'
    try {
      return dayjs(timeStr, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
    } catch {
      return timeStr
    }
  }

  const parsePassengers = (
    passengersStr?: string | null
  ): { name: string; idCard: string; seatType?: string }[] => {
    if (!passengersStr) return []
    try {
      const data = JSON.parse(passengersStr)
      if (Array.isArray(data)) return data
      return []
    } catch {
      return []
    }
  }

  const formatPassengerName = (info: PaymentInfo): string => {
    const passengers = parsePassengers(info.passengers)
    if (passengers.length > 0) {
      return passengers.map((p) => p.name).join('、')
    }
    if (info.passengerCount <= 1) {
      return info.passengerName
    }
    return `${info.passengerName} 等${info.passengerCount}人`
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#f5f6f8',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          flexShrink: 0
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} loading={cancelling}>
          返回
        </Button>
        <Space>
          <Text>支付剩余时间：</Text>
          <Text strong style={{ color: countdown < 300 ? '#f5222d' : '#fa8c16', fontSize: 18 }}>
            {formatCountdown(countdown)}
          </Text>
        </Space>
      </div>

      <Spin spinning={loading} tip="加载订单信息..." style={{ flex: 1, minHeight: 0 }}>
        {paymentInfo && (
          <div
            style={{
              display: 'flex',
              flex: 1,
              padding: 24,
              gap: 24,
              overflow: 'auto',
              minHeight: 0
            }}
          >
            <div
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 24
                }}
              >
                <Title level={4} style={{ margin: '0 0 16px 0' }}>
                  订单信息
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">订单号</Text>
                    <Text strong>{paymentInfo.orderNo}</Text>
                  </div>
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">车次</Text>
                    <Text strong>{paymentInfo.trainNum}次</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">出发日期</Text>
                    <Text strong>{paymentInfo.trainDate}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">行程</Text>
                    <Text strong>
                      {paymentInfo.fromStation} → {paymentInfo.toStation}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '16px',
                      background: '#f6f8fa',
                      borderRadius: 8
                    }}
                  >
                    <Space size={24} align="center">
                      <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: '#f5222d', fontSize: 24 }}>
                          {formatTime(paymentInfo.trainStartTime)}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            出发
                          </Text>
                        </div>
                      </div>
                      <Text type="secondary" style={{ fontSize: 20 }}>
                        ～
                      </Text>
                      <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ color: '#f5222d', fontSize: 24 }}>
                          {formatTime(paymentInfo.trainEndTime)}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            到达
                          </Text>
                        </div>
                      </div>
                    </Space>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">席别</Text>
                    <Text strong>{paymentInfo.seatType}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">乘车人</Text>
                    <Text strong>{formatPassengerName(paymentInfo)}</Text>
                  </div>
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Text strong style={{ fontSize: 16 }}>
                      应付金额
                    </Text>
                    <Text strong style={{ fontSize: 28, color: '#f5222d' }}>
                      ¥{paymentInfo.price.toFixed(2)}
                    </Text>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 24
                }}
              >
                <Title level={4} style={{ margin: '0 0 16px 0' }}>
                  选择支付方式
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.key}
                      onClick={() => !isExpired && setSelectedMethod(method.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        border:
                          selectedMethod === method.key ? '2px solid #1890ff' : '1px solid #e8e8e8',
                        borderRadius: 8,
                        background: selectedMethod === method.key ? '#e6f7ff' : '#fff',
                        cursor: isExpired ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s',
                        opacity: isExpired ? 0.5 : 1
                      }}
                    >
                      <Space>
                        {method.icon}
                        <Space direction="vertical" size={0}>
                          <Space>
                            <Text strong>{method.title}</Text>
                            {method.badge}
                          </Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {method.description}
                          </Text>
                        </Space>
                      </Space>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border:
                            selectedMethod === method.key
                              ? '2px solid #1890ff'
                              : '2px solid #d9d9d9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {selectedMethod === method.key && (
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: '#1890ff'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 24,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Title level={4} style={{ margin: '0 0 16px 0' }}>
                  扫码支付
                </Title>
                {isExpired ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <CloseCircleFilled style={{ fontSize: 80, color: '#bfbfbf' }} />
                    <div style={{ marginTop: 16 }}>
                      <Text strong style={{ fontSize: 18, color: '#8c8c8c' }}>
                        二维码已失效
                      </Text>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">支付时间已过期</Text>
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <Button type="primary" onClick={handleBack}>
                        重新预定
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Spin spinning={qrCodeLoading} tip="生成二维码...">
                      <div
                        style={{
                          width: 220,
                          height: 220,
                          border: '1px solid #e8e8e8',
                          borderRadius: 12,
                          padding: 12,
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={qrCodeUrl}
                          alt="支付二维码"
                          style={{ width: 196, height: 196 }}
                          key={selectedMethod}
                        />
                      </div>
                    </Spin>
                    <div style={{ marginTop: 20 }}>
                      <Text type="secondary">
                        请使用
                        <Text strong style={{ color: '#1890ff' }}>
                          {' '}
                          {PAYMENT_METHODS.find((m) => m.key === selectedMethod)?.title}{' '}
                        </Text>
                        扫码支付
                      </Text>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ fontSize: 28, color: '#f5222d' }}>
                        ¥{paymentInfo.price.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Spin>

      <div
        style={{
          padding: '16px 32px',
          background: '#fff',
          borderTop: '1px solid #e8e8e8',
          flexShrink: 0
        }}
      >
        <Button
          type="primary"
          size="large"
          loading={paymentLoading}
          onClick={handlePayment}
          disabled={isExpired}
          style={{ width: '100%', height: 50, fontSize: 18 }}
        >
          {isExpired
            ? '订单已过期'
            : paymentLoading
              ? '支付处理中...'
              : `确认支付 ¥${paymentInfo?.price.toFixed(2)}`}
        </Button>
      </div>
      <Copyright />
    </div>
  )
}

export default Payment
