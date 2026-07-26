import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  type TableColumnsType,
  type PaginationProps
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons'
import { useStationManager, type Station, type UseStationManagerOptions } from './useStationManager'
import { getCityList } from '@renderer/api/cities'

const { Title } = Typography
const { Option } = Select

const StationInfoMgr = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`
  })

  // 城市列表状态
  const [cities, setCities] = useState<Array<{ value: string; label: string }>>([])
  const [citiesLoading, setCitiesLoading] = useState(false)

  // 使用 useMemo 确保 pagination 变化时重新计算 managerOptions
  const managerOptions = useMemo<UseStationManagerOptions>(
    () => ({
      page: pagination.current,
      perPage: pagination.pageSize
    }),
    [pagination.current, pagination.pageSize]
  )

  const {
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
  } = useStationManager(managerOptions)

  const [form] = Form.useForm()

  // 获取城市列表
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true)
        const res = await getCityList(100, 1) // 获取足够多的城市

        if (res?.data?.data && Array.isArray(res.data.data)) {
          const cityOptions = res.data.data.map((city: any) => ({
            value: city.id,
            label: city.name
          }))
          setCities(cityOptions)
        } else if (res?.data && Array.isArray(res.data)) {
          // 处理不同的响应格式
          const cityOptions = res.data.map((city: any) => ({
            value: city.id,
            label: city.name
          }))
          setCities(cityOptions)
        }
      } catch (err) {
      } finally {
        setCitiesLoading(false)
      }
    }

    fetchCities()
  }, [])

  // 表格列配置
  const columns: TableColumnsType<Station> = [
    {
      title: '车站ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '车站名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Station, b: Station) => a.name.localeCompare(b.name)
    },
    {
      title: '车站代码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '所属城市',
      dataIndex: 'city',
      key: 'city',
      filters: cities.map((city) => ({ text: city.label, value: city.value })),
      onFilter: (value: React.Key | boolean, record: Station) => record.city === String(value)
    },
    {
      title: '车站等级',
      dataIndex: 'level',
      key: 'level'
    },
    {
      title: '开通日期',
      dataIndex: 'openDate',
      key: 'openDate'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_: any, record: Station) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              showEditModal(record)
            }}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  // 处理表单提交
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        handleOk(values as Station)
        form.resetFields()
      })
      .catch(() => {})
  }

  // 处理添加按钮点击
  const handleAddClick = () => {
    form.resetFields()
    showAddModal()
  }

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
          <Title level={4}>车站信息管理</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
            添加车站
          </Button>
        </Space>

        <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
          <Table
            columns={columns}
            dataSource={stations}
            rowKey="id"
            pagination={{
              ...pagination,
              total: total,
              onChange: (current, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current,
                  pageSize
                }))
              },
              onShowSizeChange: (current, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  current: 1,
                  pageSize
                }))
              }
            }}
            scroll={{
              x: 1200,
              y: 'calc(100vh - 300px)'
            }}
          />
        </div>

        <Modal
          title={isEditing ? '编辑车站信息' : '添加车站信息'}
          open={isModalVisible}
          onOk={handleFormSubmit}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" icon={<SaveOutlined />} onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleFormSubmit}>
              保存
            </Button>
          ]}
        >
          <Form form={form} layout="vertical" initialValues={currentStation}>
            <Form.Item
              name="name"
              label="车站名称"
              rules={[{ required: true, message: '请输入车站名称' }]}
            >
              <Input placeholder="请输入车站名称" />
            </Form.Item>
            <Form.Item
              name="code"
              label="车站代码"
              rules={[{ required: true, message: '请输入车站代码' }]}
            >
              <Input placeholder="请输入车站代码" />
            </Form.Item>
            <Form.Item
              name="city_id"
              label="所属城市"
              rules={[{ required: true, message: '请选择所属城市' }]}
            >
              <Select
                placeholder="请选择所属城市"
                loading={citiesLoading}
                showSearch
                optionFilterProp="label"
              >
                {cities.map((city) => (
                  <Option key={city.value} value={city.value}>
                    {city.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="level"
              label="车站等级"
              rules={[{ required: true, message: '请选择车站等级' }]}
            >
              <Select placeholder="请选择车站等级">
                <Option value="特等站">特等站</Option>
                <Option value="一等站">一等站</Option>
                <Option value="二等站">二等站</Option>
                <Option value="三等站">三等站</Option>
                <Option value="四等站">四等站</Option>
                <Option value="五等站">五等站</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="openDate"
              label="开通日期"
              rules={[{ required: true, message: '请输入开通日期' }]}
            >
              <Input placeholder="请输入开通日期，格式：YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="address"
              label="地址"
              rules={[{ required: true, message: '请输入地址' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入车站详细地址" />
            </Form.Item>
            <Form.Item name="remark" label="备注">
              <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default StationInfoMgr
