import { api } from './index'

export interface City {
  id?: string
  name: string
  code: string
  province: string
  level: string
  population: string
  area: string
  zip_code: string
  description: string
  created_at?: string
  updated_at?: string
}

export function getCityList(per_page: number, page: number) {
  return api.get('/cities', {
    params: {
      per_page,
      page
    }
  })
}

export function getCityById(id: string) {
  return api.get(`/cities/${id}`)
}

export function createCity(city: City) {
  return api.post('/cities', city)
}

export function updateCity(id: string, city: City) {
  return api.put(`/cities/${id}`, city)
}

export function deleteCity(id: string) {
  return api.delete(`/cities/${id}`)
}

export function searchCities(keyword: string) {
  return api.get('/cities/search', {
    params: {
      keyword
    }
  })
}
