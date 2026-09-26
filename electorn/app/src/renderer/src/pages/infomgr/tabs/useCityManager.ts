import { useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import {
  getCityList,
  createCity,
  updateCity,
  deleteCity,
  type City as ApiCity
} from '@renderer/api/cities'

// 前端使用的 City 接口（与后端字段映射）
export interface City {
  id: string
  name: string
  code: string
  province: string
  level: string
  population: string
  area: string
  zipCode: string
  description: string
  createdAt?: string
  updatedAt?: string
}

export interface UseCityManagerOptions {
  page?: number
  perPage?: number
}

// 将后端数据转换为前端格式
const mapApiCityToCity = (apiCity: ApiCity): City => ({
  id: apiCity.id || '',
  name: apiCity.name,
  code: apiCity.code,
  province: apiCity.province,
  level: apiCity.level,
  population: apiCity.population,
  area: apiCity.area,
  zipCode: apiCity.zip_code,
  description: apiCity.description,
  createdAt: apiCity.created_at,
  updatedAt: apiCity.updated_at
})

// 将前端数据转换为后端格式
const mapCityToApiCity = (city: City): ApiCity => ({
  id: city.id || undefined,
  name: city.name,
  code: city.code,
  province: city.province,
  level: city.level,
  population: city.population,
  area: city.area,
  zip_code: city.zipCode,
  description: city.description
})

export const useCityManager = (options: UseCityManagerOptions = {}) => {
  const { page = 1, perPage = 10 } = options
  const [cities, setCities] = useState<City[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCity, setCurrentCity] = useState<City>({
    id: '',
    name: '',
    code: '',
    province: '',
    level: '',
    population: '',
    area: '',
    zipCode: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  // 从API获取城市列表
  const fetchCities = async (currentPage?: number, currentPerPage?: number) => {
    setLoading(true)
    try {
      const fetchPage = currentPage || page
      const fetchPerPage = currentPerPage || perPage
      const res = await getCityList(fetchPerPage, fetchPage)

      if (res?.data?.data && Array.isArray(res.data.data)) {
        const cityList: City[] = res.data.data.map((city: ApiCity) => mapApiCityToCity(city))
        setCities(cityList)
        // 设置总记录数
        if (res.data.total) {
          setTotal(res.data.total)
        }
      } else if (res?.data && Array.isArray(res.data)) {
        // 处理不同的响应格式
        const cityList: City[] = res.data.map((city: ApiCity) => mapApiCityToCity(city))
        setCities(cityList)
      } else {
        // 如果 API 返回数据格式不符合预期，使用空数组
        setCities([])
      }
    } catch (err: any) {
      message.error('获取城市信息失败: ' + (err.message || '未知错误'))
      // 出错时使用模拟数据作为备用
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  // 模拟数据（用于API不可用时的备用）
  const loadMockData = () => {
    const mockCities: City[] = [
      {
        id: '1',
        name: '北京',
        code: 'BJ',
        province: '北京市',
        level: '直辖市',
        population: '2189万',
        area: '16410平方公里',
        zipCode: '100000',
        description: '中华人民共和国首都'
      },
      {
        id: '2',
        name: '上海',
        code: 'SH',
        province: '上海市',
        level: '直辖市',
        population: '2487万',
        area: '6340平方公里',
        zipCode: '200000',
        description: '中国经济中心'
      },
      {
        id: '3',
        name: '广州',
        code: 'GZ',
        province: '广东省',
        level: '副省级城市',
        population: '1867万',
        area: '7434平方公里',
        zipCode: '510000',
        description: '广东省省会'
      },
      {
        id: '4',
        name: '深圳',
        code: 'SZ',
        province: '广东省',
        level: '副省级城市',
        population: '1756万',
        area: '1997平方公里',
        zipCode: '518000',
        description: '中国经济特区'
      },
      {
        id: '5',
        name: '杭州',
        code: 'HZ',
        province: '浙江省',
        level: '副省级城市',
        population: '1220万',
        area: '16850平方公里',
        zipCode: '310000',
        description: '浙江省省会'
      }
    ]
    setCities(mockCities)
    setTotal(mockCities.length)
  }

  // 初始化数据
  useEffect(() => {
    fetchCities()
  }, [])

  // 打开添加模态框
  const showAddModal = () => {
    setIsEditing(false)
    setCurrentCity({
      id: '',
      name: '',
      code: '',
      province: '',
      level: '',
      population: '',
      area: '',
      zipCode: '',
      description: ''
    })
    setIsModalVisible(true)
  }

  // 打开编辑模态框
  const showEditModal = (record: City) => {
    setIsEditing(true)
    setCurrentCity(record)
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 提交表单
  const handleOk = async (values: City) => {
    try {
      if (isEditing && currentCity.id) {
        // 编辑城市
        const apiCity = mapCityToApiCity({ ...values, id: currentCity.id })
        await updateCity(currentCity.id, apiCity)
        message.success('城市信息更新成功')
      } else {
        // 添加城市
        const apiCity = mapCityToApiCity(values)
        await createCity(apiCity)
        message.success('城市信息添加成功')
      }

      // 保存成功后重新获取城市列表
      await fetchCities()
      setIsModalVisible(false)
    } catch (err: any) {
      message.error('保存城市信息失败: ' + (err.message || '未知错误'))
    }
  }

  // 删除城市
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定删除这个城市吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCity(id)
          message.success('城市信息删除成功')

          // 删除成功后重新获取城市列表
          await fetchCities()
        } catch (err: any) {
          message.error('删除城市信息失败: ' + (err.message || '未知错误'))
        }
      }
    })
  }

  return {
    cities,
    total,
    isModalVisible,
    isEditing,
    currentCity,
    loading,
    showAddModal,
    showEditModal,
    handleCancel,
    handleOk,
    handleDelete,
    fetchCities
  }
}
