import { api } from './index'

export interface Order {
  id: string
  order_no: string
  train_num: string
  train_date: string
  from_station: string
  to_station: string
  seat_type: string
  passenger_name: string
  passenger_id_card: string
  price: number
  status: string
  created_at: string
  updated_at: string
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