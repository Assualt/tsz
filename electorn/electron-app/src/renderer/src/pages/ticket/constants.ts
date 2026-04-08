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
  key: React.Key
  name: string
  code: string
  arrival_time: dayjs.Dayjs
  left_time: dayjs.Dayjs
}

export interface SearchResultField {
  key: React.Key
  train_num: string
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

interface TicketInfo {
  seatType: string
  price: number
  left: number
}

export interface TrainInfo {
  train_num: string
  train_date: dayjs.Dayjs
  train_from: string
  train_to: string
  train_start_time: string
  train_end_time: string
  ticket: TicketInfo[]
}

export interface Passager {
  id: string
  name: string
}

export interface PassagerTableItem {
  key: React.Key
  passagerType: string
  seatType: string
  name: string
  idCardType: string
  idCard: string
}
