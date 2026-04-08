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
  return api.get('/cities')
}

export function fetchTicketInfoNew(from: string, to: string, date: string) {
  const fetchUrl = '/tickets/query?from_station=' + from + '&to_station=' + to + '&date=' + date
  let result = api.get(fetchUrl)
  console.log(result)
  return result
}

export function fetchStationByTrainNo(train_num: string) {
  const fetchUrl = '/tickets/station?train_num=' + train_num
  return api.get(fetchUrl)
}

export function fetchPriceByTrainNo(train_num: string) {
  const fetchUrl = '/tickets/' + train_num + '/prices'
  return api.get(fetchUrl)
}

export function fetchTrainDetail(train_num: string, train_date: string) {
  const fetchUrl = '/tickets/' + train_num + '/detail?date=' + train_date
  return api.get(fetchUrl)
}
