import { api } from './index'

export function fetchTicketInfo(from: String, to: String, date: Date) {
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

export function fetchTicketInfoNew(from: String, to: String, date: String) {
  const fetchUrl = '/ticket/queryNew?from=' + from + '&to=' + to + '&date=' + date
  let result = api.get(fetchUrl)
  console.log(result)
  return result
}
