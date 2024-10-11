import { api } from '../api/index'
import Mock from 'mockjs'
import dayjs from 'dayjs'
import { param2Obj } from './utils'

function getCities() {
  let cities = []
  for (let idx = 0; idx < 100; ++idx) {
    cities.push({ value: Mock.Random.city(), label: Mock.Random.city(), code: '' })
  }
  return cities
}

function getRandomTrainType() {
  let result = Mock.Random.integer(0, 6)
  let typeList = 'GDZTYKCS'
  return typeList[result]
}

function getNewMockTicketLeftInfo(from, to, date) {
  let result = {
    date: date,
    from: from,
    to: to,
    trainList: []
  }

  let trainList = []
  for (let idx = 0; idx < Mock.Random.integer(10, 20); ++idx) {
    var fromCity = from
    var toCity = to
    var type = getRandomTrainType()
    let trainInfo = {
      trainNo: `${type}${Mock.Random.integer(1, 100)}`,
      station_from: fromCity,
      station_to: toCity,
      begin_time: dayjs(),
      end_time: dayjs().add(1, 'hour'),
      seatInfo: {
        business: Mock.Random.integer(10, 20),
        special: Mock.Random.integer(10, 20),
        first: Mock.Random.integer(10, 20),
        second: Mock.Random.integer(10, 20),
        lying: Mock.Random.integer(10, 20),
        super_soft_lying: Mock.Random.integer(10, 20),
        soft_lying: Mock.Random.integer(10, 20),
        hard_lying: Mock.Random.integer(10, 20),
        hard_seat: Mock.Random.integer(10, 20),
        soft_seat: Mock.Random.integer(10, 20),
        no_seat: Mock.Random.integer(10, 20)
      },
      isStart: Mock.Random.integer(0, 1) == 0,
      isEnd: Mock.Random.integer(0, 1) == 0,
      priceInfo: [{ seatType: '商务座', price: Mock.Random.integer(1000, 2000) }]
    }
    trainList.push(trainInfo)
  }

  result.trainList = trainList
  return trainList
}

function getMockTicketLeftInfo(from: string = '北京', to: string = '上海') {
  let date = new Date()
  let ticketInfo = {
    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    from: '北京',
    to: '上海',
    trainList: [],
    size: 10
  }

  for (let idx = 0; idx < ticketInfo.size; ++idx) {
    let type = Mock.Random.integer(0, 2) == 0 ? 'G' : 'D'
    let trainInfo = {
      no: `${type}${Mock.Random.integer(1, 100)}`,
      station: `${from} - ${to}`,
      business_special: Mock.Random.integer(0, 20),
      first_class: Mock.Random.integer(0, 120),
      second_class: Mock.Random.integer(0, 500),
      ssoft_lying: 0,
      soft_lying: 0,
      hard_lying: 0,
      soft_seat: 0,
      hard_seat: 0,
      no_seat: 120,
      other: '-',
      desc: '-',
      operation: '操作',
      type: type,
      from: from,
      to: to,
      isActive: Mock.Random.integer(0, 7) % 6 != 0,
      startTime: '00:00',
      endTime: '00:00',
      cost: '10小时49分',
      trainDetails: []
    }

    trainInfo.trainDetails.push({ name: from, start: '00:00', end: '00:00', stop: '' })
    for (let idx = 0; idx < 8; ++idx) {
      trainInfo.trainDetails.push({
        name: Mock.Random.city(),
        start: `0${idx}:00`,
        end: `0${idx + 1}:00`,
        stop: '1小时'
      })
    }
    trainInfo.trainDetails.push({ name: to, start: '09:00', end: '10:00', stop: '' })

    ticketInfo.trainList.push(trainInfo)
  }

  return ticketInfo
}

interface StationDetail {
  name: string
  arrivalTime: string
  leaveTime: string
  code: string
}

function getMockStations(trainNo: string) {
  let stations: StationDetail[] = []
  for (let idx = 0; idx < 10; ++idx) {
    stations.push({
      name: Mock.Random.city(),
      arrivalTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      leaveTime: dayjs().add(idx, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      code: 'xxx'
    })
  }
  return stations
}

function getMockTrainPrice(trainNo: string) {
  return {
    trainNo: trainNo,
    price: {
      business: Mock.Random.integer(10, 200),
      special: Mock.Random.integer(10, 200),
      first: Mock.Random.integer(10, 200),
      second: Mock.Random.integer(10, 200),
      lying: Mock.Random.integer(10, 200),
      super_soft_lying: Mock.Random.integer(10, 200),
      soft_lying: Mock.Random.integer(10, 200),
      hard_lying: Mock.Random.integer(10, 200),
      hard_seat: Mock.Random.integer(10, 200),
      soft_seat: Mock.Random.integer(10, 200),
      no_seat: Mock.Random.integer(10, 200)
    }
  }
}

function getTrainDetail(trainNo: string, trainDate: string) {
  let trainInfo = Mock.mock({
    trainNo: trainNo,
    trainDate: trainDate,
    trainFrom: '@city()',
    trainTo: '@city()',
    trainStartTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    trainEndTime: dayjs().add(10, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    'ticket|4': [
      {
        seatType: '@pick(business, special, first, second)',
        price: '@integer(10, 200)',
        left: '@integer(0, 50)'
      }
    ]
  })
  return trainInfo
}

export const mockFunc = () => {
  Mock.mock(new RegExp('/api/ticket/queryNew'), 'get', function (request) {
    var queryObj = param2Obj(request.url)
    console.log(queryObj)
    return api.result(
      200,
      'OK',
      getNewMockTicketLeftInfo(queryObj['from'], queryObj['to'], queryObj['date'])
    )
  })
}
export const ticketMock = [
  {
    url: '/api/ticket/cities',
    type: 'get',
    response: (request) => api.result(200, 'OK', getCities())
  },
  {
    url: '/api/ticket/station',
    type: 'get',
    response: (request) => {
      const query = request.query
      return api.result(200, 'OK', getMockStations(query['trainNo']))
    }
  },
  {
    url: '/api/ticket/price',
    type: 'get',
    response: (request) => {
      const queryObj = request.query
      return api.result(200, 'OK', getMockTrainPrice(queryObj['trainNo']))
    }
  },
  {
    url: '/api/ticket/trainDetail',
    type: 'get',
    response: (request) => {
      const queryObj = request.query
      return api.result(200, 'OK', getTrainDetail(queryObj['trainNo'], queryObj['trainDate']))
    }
  }
]
