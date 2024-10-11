import { api } from './index'

export function fetchTicketInfo(from: string, to: string, date: Date) {
  console.log(from, to, date)
  return api.get('/ticket/query', {
    from: from,
    to: to,
    date: date
  })
}

export function fetchAllCities() {
  return api.get('/ticket/cities')
}

export function fetchTicketInfoNew(from: string, to: string, date: string) {
  const fetchUrl = '/ticket/queryNew?from=' + from + '&to=' + to + '&date=' + date
  let result = api.get(fetchUrl)
  console.log(result)
  return result
}

export function fetchStationByTrainNo(trainNo: string) {
  const fetchUrl = '/ticket/station?trainNo=' + trainNo
  return api.get(fetchUrl)
}

export function fetchPriceByTrainNo(trainNo: string) {
  const fetchUrl = '/ticket/price?trainNo=' + trainNo
  return api.get(fetchUrl)
}

export function fetchTrainDetail(trainNo: string, trainDate: string) {
  const fetchUrl = '/ticket/trainDetail?trainNo=' + trainNo + '&trainDate=' + trainDate
  return api.get(fetchUrl)
}
