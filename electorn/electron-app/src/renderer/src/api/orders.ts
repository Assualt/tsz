import { api } from './index'

export interface PassengerInfo {
  name: string
  idCard: string
  seatType?: string
}

export interface Order {
  id: number
  order_no: string
  train_num: string
  train_date: string
  train_start_time?: string | null
  train_end_time?: string | null
  from_station: string
  to_station: string
  seat_type: string
  passenger_name: string
  passenger_id_card: string
  passenger_count: number
  passengers?: string | null
  price: number
  status: string
  payment_method?: string | null
  paid_at?: string | null
  created_at: string
  updated_at?: string | null
}

export interface CreateOrderPayload {
  train_num: string
  train_date: string
  train_start_time?: string
  train_end_time?: string
  from_station: string
  to_station: string
  seat_type: string
  passenger_name: string
  passenger_id_card: string
  passenger_count?: number
  passengers?: string
  price: number
  payment_method?: string
}

export function createOrder(orderData: CreateOrderPayload) {
  return api.post('/orders', orderData)
}

export function payOrder(id: number, paymentMethod: string) {
  return api.put(`/orders/${id}/pay`, {
    payment_method: paymentMethod
  })
}

export function getOrderList(per_page: number, page: number) {
  return api.get('/orders', {
    params: {
      per_page,
      page
    }
  })
}

export function getOrderById(id: number) {
  return api.get(`/orders/${id}`)
}

export function cancelOrder(id: number) {
  return api.put(`/orders/${id}/cancel`)
}

export function deleteOrder(id: number) {
  return api.delete(`/orders/${id}`)
}
