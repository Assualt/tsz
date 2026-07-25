import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Radio, message, Space, Typography, Spin, type TableProps } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons'

import { getPassengers, addPassenger, updatePassenger, deletePassenger, type Passenger } from '@renderer/api/user'

const { Title } = Typography
const { Option } = Select

const PassagerInfoMgr = () => {
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const loadPassengers = async () => {
    setLoading(true)
    try {
      const res = await getPassengers()
      if (res?.data && Array.isArray(res.data)) {
        setPassengers(res.data)
      } else if (res?.data?.data) {
        setPassengers(res.data.data)
      }
    } catch (err: any) {
      message.error('获取乘车人信息失败：' + (err.message || '未知错误'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPassengers()
  }, [])

  const showAddModal = () => {
    setIsEditing(false)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (record: Passenger) => {
    setIsEditing(true)
    form.setFieldsValue({
      name: record.name,
      idType: record.id_card_type,
      idNumber: record.id_card,
      phone: record.phone || '',
      email: record.email || '',
      type: record.type,
      remark: ''
    })
    form.setFieldsValue({ id: record.id })
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      
      const passengerData = {
        name: values.name,
        id_card: values.idNumber,
        id_card_type: values.idType,
        type: values.type,
        phone: values.phone || undefined,
        email: values.email || undefined,
        remark: values.remark || undefined
      }

      if (isEditing) {
        await updatePassenger(values.id, passengerData)
        message.success('乘车人信息更新成功')
      } else {
        await addPassenger(passengerData)
        message.success('乘车人信息添加成功')
      }

      setIsModalVisible(false)
      loadPassengers()
    } catch (error: any) {
      if (error.errorFields) {
        console.error('表单验证失败:', error)
      } else {
        message.error('操作失败：' + (error.message || '未知错误'))
      }
    }
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定删除这个乘车人吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePassenger(id)
          message.success('乘车人信息删除成功')
          loadPassengers()
        } catch (err: any) {
          message.error('删除失败：' + (err.message || '未知错误'))
        }
      }
    })
  }

  const columns: TableProps<Passenger>['columns'] = [
    {
      title: '乘车人ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Passenger, b: Passenger) => a.name.localeCompare(b.name)
    },
    {
      title: '证件类型',
      dataIndex: 'id_card_type',
      key: 'id_card_type',
      render: (text: string) => {
        const typeMap: Record<string, string> = {
          '居民二代身份证': '身份证',
          '港澳通行证': '港澳通行证',
          '台湾通行证': '台湾通行证',
          '护照': '护照',
          'id_card': '身份证',
          'hk_macau_pass': '港澳通行证',
          'taiwan_pass': '台湾通行证',
          'passport': '护照'
        }
        return typeMap[text] || text
      }
    },
    {
      title: '证件号码',
      dataIndex: 'id_card',
      key: 'id_card'
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '成人', value: '成人' },
        { text: '儿童', value: '儿童' },
        { text: '学生', value: '学生' },
        { text: 'adult', value: 'adult' },
        { text: 'child', value: 'child' },
        { text: 'student', value: 'student' }
      ],
      onFilter: (value: any, record: Passenger) => record.type === value,
      render: (text: string) => {
        const typeMap: Record<string, string> = {
          '成人': '成人',
          '儿童': '儿童',
          '学生': '学生',
          'adult': '成人',
          'child': '儿童',
          'student': '学生'
        }
        return typeMap[text] || text
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        return text === 'active' ? '有效' : text
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 140,
      render: (_: any, record: Passenger) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
          <Title level={4}>乘车人信息管理</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
            添加乘车人
          </Button>
        </Space>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={passengers}
            rowKey="id"
            pagination={{
              pageSize: 10
            }}
            scroll={{
              x: 1200
            }}
          />
        </Spin>

        <Modal
          title={isEditing ? '编辑乘车人信息' : '添加乘车人信息'}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" icon={<CloseOutlined />} onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              保存
            </Button>
          ]}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item name="id" hidden />
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="idType"
              label="证件类型"
              rules={[{ required: true, message: '请选择证件类型' }]}
            >
              <Select placeholder="请选择证件类型">
                <Option value="居民二代身份证">身份证</Option>
                <Option value="护照">护照</Option>
                <Option value="港澳通行证">港澳通行证</Option>
                <Option value="台湾通行证">台湾通行证</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="idNumber"
              label="证件号码"
              rules={[{ required: true, message: '请输入证件号码' }]}
            >
              <Input placeholder="请输入证件号码" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="手机号码"
              rules={[
                { required: true, message: '请输入手机号码' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Radio.Group>
                <Radio value="成人">成人</Radio>
                <Radio value="儿童">儿童</Radio>
                <Radio value="学生">学生</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="remark"
              label="备注"
            >
              <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  )
}

export default PassagerInfoMgr