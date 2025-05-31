enum SeatType {
  Business,
  Superlative,
  FirstClass,
  SecondClass,
  MovingLying,
  SuperMovingLying,
  SuperSoftMovingLying,
  SoftLyingFirstClass,
  HardLyingSecondClass,
  SoftSeat,
  HardSeat,
  NullSeat,
  Other
}

export interface TicketInfo {
  id: string // 车次
  from: string // 始发站
  to: string // 终点站
  startTime: Date // 出发时间
  endTime: Date // 到达时间
  costTime: BigInteger // 耗时
  seatType: SeatType // 座位类型
  price: number // 价格
  disCount: number // 折扣
}

export interface QueryFilter {
  from: string
  to: string
  startTime: Date
}

export interface Cities {
  name: string
  label: string
  code: string
}

export interface SearchInfo {
  from: string
  to: string
  startTime: Date
}

export const defaultTrainType: string[] = [
  '不限',
  'GC-高铁城际',
  'D-动车',
  '复兴号',
  'C-城际',
  'Z-直达',
  'T-特快',
  'K-快速',
  '其他'
]

export const defaultSeatType: string[] = [
  '不限',
  '一等座',
  '二等座',
  '硬座',
  '软卧',
  '硬卧',
  '无座',
  '一等卧',
  '二等卧',
  '动卧',
  '硬卧/一等卧',
  '软卧/一等卧',
  '硬卧/二等卧',
  '软卧/二等卧',
  '动卧/一等卧',
  '动卧/二等卧',
  '其他'
]