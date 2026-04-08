import { useState, useEffect, useCallback } from 'react'
import { message, Modal } from 'antd'
import { getStationList, createOrUpdateStation, getStationById, deleteStation } from '@renderer/api/stations'

export interface Station {
  id: string
  name: string
  code: string
  city: string
  city_id: number
  level: string
  openDate: string
  address: string
  remark: string
}

export interface UseStationManagerOptions {
  page?: number
  perPage?: number
}

export const useStationManager = (options: UseStationManagerOptions = {}) => {
  const { page = 1, perPage = 5 } = options
  const [stations, setStations] = useState<Station[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentStation, setCurrentStation] = useState<Station>({
    id: '',
    name: '',
    code: '',
    city: '',
    city_id: 0,
    level: '',
    openDate: '',
    address: '',
    remark: ''
  })

  // 处理日期，只保留年月日
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return ''
    // 尝试解析日期
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      // 如果不是有效的日期格式，直接返回
      return dateString
    }
    // 格式化日期为 YYYY-MM-DD
    return date.toISOString().split('T')[0]
  }, [])

  // 从API获取车站列表
  const fetchStations = useCallback(async (currentPage?: number, currentPerPage?: number) => {
    try {
      const fetchPage = currentPage || page
      const fetchPerPage = currentPerPage || perPage
      const res = await getStationList(fetchPerPage, fetchPage)
      // 将res.data 数据转换为Station类型
      if (res?.data?.data) {
        const stationList: Station[] = res.data.data.map((station: any) => ({
          id: station.id,
          name: station.name,
          code: station.code,
          city: station.city_name,
          city_id: station.city_id,
          level: station.level_name,
          openDate: formatDate(station.open_date),
          address: station.address || '',
          remark: station.keyword
        }))
        setStations(stationList)
        // 设置总记录数
        if (res.data.total) {
          setTotal(res.data.total)
        }
      } else if (res?.data && Array.isArray(res.data)) {
        // 处理不同的响应格式
        const stationList: Station[] = res.data.map((station: any) => ({
          id: station.id,
          name: station.name,
          code: station.code,
          city: station.city_name,
          city_id: station.city_id,
          level: station.level_name,
          openDate: formatDate(station.open_date),
          address: station.address || '',
          remark: station.keyword
        }))
        setStations(stationList)
      } else {
        // 处理意外的响应格式
      }
    } catch (err: any) {
      message.error('获取车站信息失败 :' + err.message || '未知错误')
    }
  }, [page, perPage, formatDate])

  // 初始化数据
  useEffect(() => {
    fetchStations()
  }, [fetchStations])

  // 打开添加模态框
  const showAddModal = () => {
    setIsEditing(false)
    setCurrentStation({
      id: '',
      name: '',
      code: '',
      city: '',
      city_id: 0,
      level: '',
      openDate: '',
      address: '',
      remark: ''
    })
    setIsModalVisible(true)
  }

  // 打开编辑模态框
  const showEditModal = async (record: Station) => {
    try {
      // 调用 getStationById 获取最新的车站信息
      const res = await getStationById(Number(record.id))
      
      if (res?.data?.data) {
        // 使用 API 返回的数据更新 currentStation
        const stationData = res.data.data
        setCurrentStation({
          id: stationData.id,
          name: stationData.name,
          code: stationData.code,
          city: stationData.city_name,
          city_id: stationData.city_id,
          level: stationData.level_name,
          openDate: formatDate(stationData.open_date),
          address: stationData.address || '',
          remark: stationData.keyword
        })
      } else {
        // 如果 API 调用失败，使用传入的 record 数据
        setCurrentStation(record)
      }
      
      setIsEditing(true)
      setIsModalVisible(true)
    } catch (err: any) {
      message.error('获取车站详情失败: ' + err.message || '未知错误')
      // 出错时使用传入的 record 数据
      setCurrentStation(record)
      setIsEditing(true)
      setIsModalVisible(true)
    }
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 车站等级映射
  const levelMap: Record<string, number> = {
    '特等站': 0,
    '一等站': 1,
    '二等站': 2,
    '三等站': 3,
    '四等站': 4,
    '五等站': 5
  }

  // 提交表单
  const handleOk = async (values: Station) => {
    try {
      // 格式化日期，确保只包含年月日
      const formattedValues = {
        ...values,
        openDate: formatDate(values.openDate)
      }

      // 准备 API 请求数据
      const apiData = {
        ...formattedValues,
        level: levelMap[formattedValues.level] || 5, // 默认五等站
        keyword: formattedValues.remark, // 将 remark 改为 keyword
        city_id: formattedValues.city_id, // 使用 city_id 字段
        city: undefined, // 移除 city 字段
        remark: undefined // 移除 remark 字段
      }

      if (isEditing && currentStation.id) {
        // 编辑车站
        await createOrUpdateStation({
          ...apiData,
          id: currentStation.id
        })
        message.success('车站信息更新成功')
      } else {
        // 添加车站
        await createOrUpdateStation(apiData)
        message.success('车站信息添加成功')
      }

      // 保存成功后重新获取车站列表
      await fetchStations()
      setIsModalVisible(false)
    } catch (err: any) {
      message.error('保存车站信息失败 :' + err.message || '未知错误')
    }
  }

  // 删除车站
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定删除这个车站吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 调用删除车站的 API
          await deleteStation(Number(id))
          message.success('车站信息删除成功')
          // 删除成功后重新获取车站列表
          await fetchStations()
        } catch (err) {
          message.error('删除车站信息失败 :' + err?.message || '未知错误')
        }
      }
    })
  }

  return {
    stations,
    total,
    isModalVisible,
    isEditing,
    currentStation,
    showAddModal,
    showEditModal,
    handleCancel,
    handleOk,
    handleDelete,
    fetchStations
  }
}
