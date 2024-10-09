import React from 'react'

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
  price: Number // 价格
  disCount: Number // 折扣
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
