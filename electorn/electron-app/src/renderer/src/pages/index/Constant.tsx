import dayjs from 'dayjs'
export type SearchBoxField = {
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

interface TrainStation {
    name: string
    code: string
    arrivalTime: dayjs.Dayjs
    leaveTime: dayjs.Dayjs
}

export interface SearchResultField {
  trainNo: string
  station_from: string
  station_to: String
  begin_time: dayjs.Dayjs
  end_time: dayjs.Dayjs
  seatInfo: SeatLeftTicket
  priceInfo: Array<PriceInfo>
  stations: Array<TrainStation>
  isStart: boolean
  isEnd: boolean
}

