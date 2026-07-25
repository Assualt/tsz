import { useState, useEffect, useCallback } from 'react'
import { message, Modal } from 'antd'
import { getOrderList, getOrderById, cancelOrder, deleteOrder } from '@renderer/api/orders'
import type { Order as OrderType } from '@renderer/api/orders'
export type { Order } from '@renderer/api/orders'

export interface UseOrderManagerOptions {
  page?: number
  perPage?: number
}

export const useOrderManager = (options: UseOrderManagerOptions = {}) => {
  const { page = 1, perPage = 10 } = options
  const [orders, setOrders] = useState<OrderType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<OrderType | null>(null)

  const formatDateTime = useCallback((dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }, [])

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toISOString().split('T')[0]
  }, [])

  const fetchOrders = useCallback(async (currentPage?: number, currentPerPage?: number) => {
    try {
      const fetchPage = currentPage || page
      const fetchPerPage = currentPerPage || perPage
      const res = await getOrderList(fetchPerPage, fetchPage)
      
      if (res?.data?.data) {
        const orderList: OrderType[] = res.data.data.map((order: any) => ({
          id: order.id,
          order_no: order.order_no,
          train_num: order.train_num,
          train_date: formatDate(order.train_date),
          from_station: order.from_station,
          to_station: order.to_station,
          seat_type: order.seat_type,
          passenger_name: order.passenger_name,
          passenger_id_card: order.passenger_id_card,
          price: order.price,
          status: order.status,
          created_at: formatDateTime(order.created_at),
          updated_at: formatDateTime(order.updated_at)
        }))
        setOrders(orderList)
        if (res.data.total) {
          setTotal(res.data.total)
        }
      } else if (res?.data && Array.isArray(res.data)) {
        const orderList: OrderType[] = res.data.map((order: any) => ({
          id: order.id,
          order_no: order.order_no,
          train_num: order.train_num,
          train_date: formatDate(order.train_date),
          from_station: order.from_station,
          to_station: order.to_station,
          seat_type: order.seat_type,
          passenger_name: order.passenger_name,
          passenger_id_card: order.passenger_id_card,
          price: order.price,
          status: order.status,
          created_at: formatDateTime(order.created_at),
          updated_at: formatDateTime(order.updated_at)
        }))
        setOrders(orderList)
        setTotal(orderList.length)
      }
    } catch (err: any) {
      message.error('获取订单信息失败: ' + err.message || '未知错误')
    }
  }, [page, perPage, formatDate, formatDateTime])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const showDetailModal = async (record: OrderType) => {
    try {
      const res = await getOrderById(Number(record.id))
      if (res?.data?.data) {
        const orderData = res.data.data
        setCurrentOrder({
          id: orderData.id,
          order_no: orderData.order_no,
          train_num: orderData.train_num,
          train_date: formatDate(orderData.train_date),
          from_station: orderData.from_station,
          to_station: orderData.to_station,
          seat_type: orderData.seat_type,
          passenger_name: orderData.passenger_name,
          passenger_id_card: orderData.passenger_id_card,
          price: orderData.price,
          status: orderData.status,
          created_at: formatDateTime(orderData.created_at),
          updated_at: formatDateTime(orderData.updated_at)
        })
      } else {
        setCurrentOrder(record)
      }
    } catch (err: any) {
      message.error('获取订单详情失败: ' + err.message || '未知错误')
      setCurrentOrder(record)
    }
    setIsDetailModalVisible(true)
  }

  const handleCancelDetail = () => {
    setIsDetailModalVisible(false)
    setCurrentOrder(null)
  }

  const handleCancelOrder = (id: string) => {
    Modal.confirm({
      title: '确定取消该订单吗？',
      content: '取消后订单状态将变更为已取消',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await cancelOrder(Number(id))
          message.success('订单已取消')
          await fetchOrders()
        } catch (err: any) {
          message.error('取消订单失败: ' + err.message || '未知错误')
        }
      }
    })
  }

  const handleDeleteOrder = (id: string) => {
    Modal.confirm({
      title: '确定删除该订单吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteOrder(Number(id))
          message.success('订单已删除')
          await fetchOrders()
        } catch (err: any) {
          message.error('删除订单失败: ' + err.message || '未知错误')
        }
      }
    })
  }

  return {
    orders,
    total,
    isDetailModalVisible,
    currentOrder,
    showDetailModal,
    handleCancelDetail,
    handleCancelOrder,
    handleDeleteOrder,
    fetchOrders
  }
}