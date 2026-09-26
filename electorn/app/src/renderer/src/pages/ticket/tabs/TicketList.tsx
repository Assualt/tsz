import { useState, useMemo, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Typography,
  Tag,
  Space,
  Descriptions,
  type TableColumnsType,
  type PaginationProps
} from 'antd'
import {
  EyeOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  PayCircleOutlined
} from '@ant-design/icons'
import { useOrderManager, type Order, type UseOrderManagerOptions } from './useOrderManager'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title } = Typography

const TicketList = () => {
  const navigate = useNavigate()

  const [pagination, setPagination] = useState<PaginationProps>(() => {
    const saved = localStorage.getItem('orderListPagination')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return {
          current: 1,
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number) => `共 ${total} 条记录`
        }
      }
    }
    return {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total: number) => `共 ${total} 条记录`
    }
  })

  useEffect(() => {
    localStorage.setItem('orderListPagination', JSON.stringify(pagination))
  }, [pagination])

  const managerOptions = useMemo<UseOrderManagerOptions>(
    () => ({
      page: pagination.current,
      perPage: pagination.pageSize
    }),
    [pagination.current, pagination.pageSize]
  )

  const {
    orders,
    total,
    isDetailModalVisible,
    currentOrder,
    showDetailModal,
    handleCancelDetail,
    handleCancelOrder
  } = useOrderManager(managerOptions)

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待支付' },
      paid: { color: 'green', text: '已支付' },
      cancelled: { color: 'gray', text: '已取消' },
      completed: { color: 'blue', text: '已完成' },
      refunded: { color: 'red', text: '已退款' }
    }
    const config = statusMap[status] || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      wechat: '微信支付',
      alipay: '支付宝',
      unionpay: '银联支付',
      balance: '余额支付'
    }
    return methodMap[method] || method
  }

  const formatTime = (timeStr?: string | null): string => {
    if (!timeStr) return '--'
    try {
      return dayjs(timeStr).format('HH:mm')
    } catch {
      return timeStr
    }
  }

  const getTimeDiffDays = (startStr?: string | null, endStr?: string | null): number => {
    if (!startStr || !endStr) return 0
    try {
      const start = dayjs(startStr)
      const end = dayjs(endStr)
      const diff = end.diff(start.startOf('day'), 'day')
      return diff
    } catch {
      return 0
    }
  }

  const renderTimeColumn = (record: Order) => {
    const startTime = formatTime(record.train_start_time)
    const endTime = formatTime(record.train_end_time)
    const diffDays = getTimeDiffDays(record.train_start_time, record.train_end_time)
    return (
      <div style={{ textAlign: 'center', lineHeight: 1.4 }}>
        <div>{startTime}</div>
        <div style={{ fontSize: 10, color: diffDays > 0 ? '#fa8c16' : '#999' }}>
          {diffDays > 0 ? `+${diffDays}天 ` : ''}↓
        </div>
        <div>{endTime}</div>
      </div>
    )
  }

  const formatPassenger = (record: Order): string => {
    const passengers = parsePassengers(record.passengers)
    if (passengers.length > 0) {
      return passengers.map((p) => p.name).join('、')
    }
    if (record.passenger_count && record.passenger_count > 1) {
      return `${record.passenger_name} 等${record.passenger_count}人`
    }
    return record.passenger_name
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

  const columns: TableColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      key: 'order_no',
      ellipsis: true
    },
    {
      title: '车次',
      dataIndex: 'train_num',
      key: 'train_num',
      width: 80
    },
    {
      title: '日期',
      dataIndex: 'train_date',
      key: 'train_date',
      width: 100
    },
    {
      title: '出发站',
      dataIndex: 'from_station',
      key: 'from_station',
      width: 80
    },
    {
      title: '到达站',
      dataIndex: 'to_station',
      key: 'to_station',
      width: 80
    },
    {
      title: '时间',
      key: 'time',
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Order) => renderTimeColumn(record)
    },
    {
      title: '座位类型',
      dataIndex: 'seat_type',
      key: 'seat_type',
      width: 80
    },
    {
      title: '乘客',
      key: 'passenger',
      width: 120,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Order) => formatPassenger(record)
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => <span>¥{price.toFixed(2)}</span>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 280,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showDetailModal(record)}
          >
            详情
          </Button>
          {record.status === 'pending' ? (
            <Button
              type="primary"
              icon={<PayCircleOutlined />}
              size="small"
              onClick={() => navigate(`/payment?orderId=${record.id}`)}
            >
              去支付
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              size="small"
              onClick={() =>
                navigate(
                  `/order?trainNo=${record.train_num}&trainDate=${record.train_date.replace(/-/g, '_')}`
                )
              }
            >
              再次预定
            </Button>
          )}
          {record.status === 'pending' && (
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleCancelOrder(record.id)}
            >
              取消
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Space direction="vertical" style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <Space style={{ marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
          <Title level={4}>订单查询</Title>
        </Space>

        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              ...pagination,
              total: total,
              onChange: (current, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current,
                  pageSize
                }))
              },
              onShowSizeChange: (_current, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: 1,
                  pageSize
                }))
              }
            }}
            scroll={{
              x: 1300,
              y: 'calc(100vh - 320px)'
            }}
          />
        </div>

        <Modal
          title="订单详情"
          open={isDetailModalVisible}
          onCancel={handleCancelDetail}
          footer={[
            <Button key="close" onClick={handleCancelDetail}>
              关闭
            </Button>
          ]}
          width={550}
        >
          {currentOrder && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="订单号">{currentOrder.order_no}</Descriptions.Item>
              <Descriptions.Item label="车次">{currentOrder.train_num}</Descriptions.Item>
              <Descriptions.Item label="出发日期">{currentOrder.train_date}</Descriptions.Item>
              <Descriptions.Item label="出发站">{currentOrder.from_station}</Descriptions.Item>
              <Descriptions.Item label="到达站">{currentOrder.to_station}</Descriptions.Item>
              <Descriptions.Item label="出发时间">
                {formatTime(currentOrder.train_start_time)}
              </Descriptions.Item>
              <Descriptions.Item label="到达时间">
                {formatTime(currentOrder.train_end_time)}
              </Descriptions.Item>
              <Descriptions.Item label="座位类型">{currentOrder.seat_type}</Descriptions.Item>
              <Descriptions.Item label="乘客信息">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {(() => {
                    const passengers = parsePassengers(currentOrder.passengers)
                    if (passengers.length > 0) {
                      return passengers.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            {p.name}
                            <span style={{ color: '#999', marginLeft: 8 }}>{p.idCard}</span>
                          </span>
                          <Tag color="blue">{p.seatType || currentOrder.seat_type}</Tag>
                        </div>
                      ))
                    }
                    const count = currentOrder.passenger_count || 1
                    const rows: JSX.Element[] = []
                    for (let i = 0; i < count; i++) {
                      if (i === 0) {
                        rows.push(
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>
                              {currentOrder.passenger_name}
                              <span style={{ color: '#999', marginLeft: 8 }}>
                                {currentOrder.passenger_id_card}
                              </span>
                            </span>
                            <Tag color="blue">{currentOrder.seat_type}</Tag>
                          </div>
                        )
                      } else {
                        rows.push(
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#666' }}>同行乘客 {i + 1}</span>
                            <Tag color="blue">{currentOrder.seat_type}</Tag>
                          </div>
                        )
                      }
                    }
                    return rows
                  })()}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="价格">¥{currentOrder.price.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(currentOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="支付方式">
                {currentOrder.payment_method
                  ? getPaymentMethodLabel(currentOrder.payment_method)
                  : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="支付时间">{currentOrder.paid_at || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentOrder.created_at}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{currentOrder.updated_at}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Space>
    </div>
  )
}

export default TicketList
