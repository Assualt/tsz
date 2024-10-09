import dayjs from 'dayjs'
export interface SearchBoxField {
  from: string
  to: string
  date: dayjs.Dayjs
}

interface SeatLeftTicket {
  business: number
  special: number
  first: number
  second: number
  lying: number
  super_soft_lying: number
  soft_lying: number
  hard_lying: number
  soft_seat: number
  hard_seat: number
  no_seat: number
}

interface PriceInfo {
  seatType: string
  price: number
}

export interface Train {
  value: string
  label: string
  code: string
}

export interface TrainStation {
  name: string
  code: string
  arrivalTime: dayjs.Dayjs
  leaveTime: dayjs.Dayjs
}

export interface SearchResultField {
  trainNo: string
  station_from: string
  station_to: string
  begin_time: dayjs.Dayjs
  end_time: dayjs.Dayjs
  seatInfo: SeatLeftTicket
  priceInfo: PriceInfo[]
  isStart: boolean
  isEnd: boolean
}

export interface SeatLeftTicketPrice {
  business: number
  special: number
  first: number
  second: number
  lying: number
  super_soft_lying: number
  soft_lying: number
  hard_lying: number
  soft_seat: number
  hard_seat: number
  no_seat: number
}