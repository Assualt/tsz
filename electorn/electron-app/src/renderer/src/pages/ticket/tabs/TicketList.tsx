import { useState, useMemo, useEffect } from 'react'
import { Table, Button, Modal, Typography, Tag, Space, Descriptions, type TableColumnsType, type PaginationProps } from 'antd'
import { EyeOutlined, CloseOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useOrderManager, type Order, type UseOrderManagerOptions } from './useOrderManager'
import { useNavigate } from 'react-router-dom'

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

  const managerOptions = useMemo<UseOrderManagerOptions>(() => ({
    page: pagination.current,
    perPage: pagination.pageSize
  }), [pagination.current, pagination.pageSize])

  const { 
    orders, 
    total, 
    isDetailModalVisible, 
    currentOrder, 
    showDetailModal, 
    handleCancelDetail,
    handleCancelOrder,
    handleDeleteOrder
  } = useOrderManager(managerOptions)

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'pending': { color: 'orange', text: '待支付' },
      'paid': { color: 'green', text: '已支付' },
      'cancelled': { color: 'gray', text: '已取消' },
      'completed': { color: 'blue', text: '已完成' },
      'refunded': { color: 'red', text: '已退款' }
    }
    const config = statusMap[status] || { color: 'default', text: status }
    return <Tag color={config.color}>{config.text}</Tag>
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
      width: 100
    },
    {
      title: '日期',
      dataIndex: 'train_date',
      key: 'train_date',
      width: 110
    },
    {
      title: '出发站',
      dataIndex: 'from_station',
      key: 'from_station',
      width: 100
    },
    {
      title: '到达站',
      dataIndex: 'to_station',
      key: 'to_station',
      width: 100
    },
    {
      title: '座位类型',
      dataIndex: 'seat_type',
      key: 'seat_type',
      width: 100
    },
    {
      title: '乘客',
      dataIndex: 'passenger_name',
      key: 'passenger_name',
      width: 80
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
      width: 300,
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
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="small"
            onClick={() => navigate(`/order?trainNo=${record.train_num}&trainDate=${record.train_date.replace(/-/g, '_')}`)}
          >
            预定
          </Button>
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleCancelOrder(record.id)}
          >
            取消
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteOrder(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
          <Title level={4}>订单查询</Title>
        </Space>

        <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              ...pagination,
              total: total,
              onChange: (current, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current,
                  pageSize
                }))
              },
              onShowSizeChange: (_current, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: 1,
                  pageSize
                }))
              }
            }}
            scroll={{
              x: 1300,
              y: 'calc(100vh - 300px)'
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
          width={500}
        >
          {currentOrder && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="订单号">{currentOrder.order_no}</Descriptions.Item>
              <Descriptions.Item label="车次">{currentOrder.train_num}</Descriptions.Item>
              <Descriptions.Item label="出发日期">{currentOrder.train_date}</Descriptions.Item>
              <Descriptions.Item label="出发站">{currentOrder.from_station}</Descriptions.Item>
              <Descriptions.Item label="到达站">{currentOrder.to_station}</Descriptions.Item>
              <Descriptions.Item label="座位类型">{currentOrder.seat_type}</Descriptions.Item>
              <Descriptions.Item label="乘客姓名">{currentOrder.passenger_name}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{currentOrder.passenger_id_card}</Descriptions.Item>
              <Descriptions.Item label="价格">¥{currentOrder.price.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(currentOrder.status)}</Descriptions.Item>
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