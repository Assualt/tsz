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
  id: String // 车次
  from: String // 始发站
  to: String // 终点站
  startTime: Date // 出发时间
  endTime: Date // 到达时间
  costTime: BigInteger // 耗时
  seatType: SeatType // 座位类型
  price: Number // 价格
  disCount: Number // 折扣
}

export interface QueryFilter {
  from: String
  to: String
  startTime: Date
}

export interface Cities {
  name: String
  label: String
  code: String
}
