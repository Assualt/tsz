import React, { useState, useMemo } from 'react'
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
import { useCityManager, type City, type UseCityManagerOptions } from './useCityManager'

const { Title } = Typography
const { Option } = Select

const CityInfoMgr = () => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total) => `共 ${total} 条记录`
  })

  // 使用 useMemo 确保 pagination 变化时重新计算 managerOptions
  const managerOptions = useMemo<UseCityManagerOptions>(
    () => ({
      page: pagination.current,
      perPage: pagination.pageSize
    }),
    [pagination.current, pagination.pageSize]
  )

  const {
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
  } = useCityManager(managerOptions)

  const [form] = Form.useForm()

  // 格式化日期，将 ISO 格式的日期转换为年月日时分秒格式
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // 表格列配置
  const columns: TableColumnsType<City> = [
    {
      title: '城市ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '城市名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: City, b: City) => a.name.localeCompare(b.name)
    },
    {
      title: '城市代码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '所属省份',
      dataIndex: 'province',
      key: 'province',
      filters: [
        { text: '北京市', value: '北京市' },
        { text: '上海市', value: '上海市' },
        { text: '广东省', value: '广东省' },
        { text: '浙江省', value: '浙江省' }
      ],
      onFilter: (value: React.Key | boolean, record: City) => record.province === String(value)
    },
    {
      title: '城市等级',
      dataIndex: 'level',
      key: 'level'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      render: (text: string) => formatDate(text)
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      ellipsis: true,
      render: (text: string) => formatDate(text)
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_: any, record: City) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              form.setFieldsValue(record)
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
        handleOk(values as City)
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
          <Title level={4}>城市信息管理</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddClick}>
            添加城市
          </Button>
        </Space>

        <div style={{ position: 'relative', height: 'calc(100vh - 200px)' }}>
          <Table
            columns={columns}
            dataSource={cities}
            rowKey="id"
            loading={loading}
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
              x: 1400,
              y: 'calc(100vh - 300px)'
            }}
          />
        </div>

        <Modal
          title={isEditing ? '编辑城市信息' : '添加城市信息'}
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
          <Form form={form} layout="vertical" initialValues={currentCity}>
            <Form.Item
              name="name"
              label="城市名称"
              rules={[{ required: true, message: '请输入城市名称' }]}
            >
              <Input placeholder="请输入城市名称" />
            </Form.Item>
            <Form.Item
              name="code"
              label="城市代码"
              rules={[{ required: true, message: '请输入城市代码' }]}
            >
              <Input placeholder="请输入城市代码，如：BJ" />
            </Form.Item>
            <Form.Item
              name="province"
              label="所属省份"
              rules={[{ required: true, message: '请选择所属省份' }]}
            >
              <Select placeholder="请选择所属省份">
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="天津市">天津市</Option>
                <Option value="重庆市">重庆市</Option>
                <Option value="广东省">广东省</Option>
                <Option value="浙江省">浙江省</Option>
                <Option value="江苏省">江苏省</Option>
                <Option value="山东省">山东省</Option>
                <Option value="河南省">河南省</Option>
                <Option value="四川省">四川省</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="level"
              label="城市等级"
              rules={[{ required: true, message: '请选择城市等级' }]}
            >
              <Select placeholder="请选择城市等级">
                <Option value="直辖市">直辖市</Option>
                <Option value="副省级城市">副省级城市</Option>
                <Option value="地级市">地级市</Option>
                <Option value="县级市">县级市</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="population"
              label="人口"
              rules={[{ required: true, message: '请输入人口数量' }]}
            >
              <Input placeholder="请输入人口数量，如：1000万" />
            </Form.Item>
            <Form.Item name="area" label="面积" rules={[{ required: true, message: '请输入面积' }]}>
              <Input placeholder="请输入面积，如：10000平方公里" />
            </Form.Item>
            <Form.Item
              name="zipCode"
              label="邮编"
              rules={[{ required: true, message: '请输入邮编' }]}
            >
              <Input placeholder="请输入邮编" />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={4} placeholder="请输入城市描述" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default CityInfoMgr
