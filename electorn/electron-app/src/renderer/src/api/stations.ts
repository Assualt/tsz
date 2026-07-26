import { api } from './index'

export interface Station {
  id?: string
  name: string
  code: string
  city_id: number
  level: number
  open_date: string
  address: string
  keyword: string
}

export function getStationList(per_page: number, page: number) {
  return api.get('/stations', {
    params: {
      per_page,
      page
    }
  })
}

export function createOrUpdateStation(station: Station) {
  if (!station.id) {
    return api.post('/stations', station)
  } else {
    return api.put(`/stations/${station.id}`, station)
  }
}

export function getStationById(id: number) {
  return api.get(`/stations/${id}`)
}

export function deleteStation(id: number) {
  return api.delete(`/stations/${id}`)
}
