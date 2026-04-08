import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Radio, message, Space, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select
const { Group, Button: RadioButton } = Radio

interface Passager {
  id: string
  name: string
  idType: string
  idNumber: string
  phone: string
  email: string
  type: string
  remark: string
}

const PassagerInfoMgr = () => {
  const [passagers, setPassagers] = useState<Passager[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPassager, setCurrentPassager] = useState<Passager>({
    id: '',
    name: '',
    idType: '',
    idNumber: '',
    phone: '',
    email: '',
    type: '',
    remark: ''
  })
  const [form] = Form.useForm()

  // 模拟初始数据
  useEffect(() => {
    const initialPassagers: Passager[] = [
      {
        id: '1',
        name: '张三',
        idType: '身份证',
        idNumber: '110101199001011234',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        type: '成人',
        remark: '常用乘车人'
      },
      {
        id: '2',
        name: '李四',
        idType: '身份证',
        idNumber: '110101199102022345',
        phone: '13900139002',
        email: 'lisi@example.com',
        type: '成人',
        remark: '常用乘车人'
      },
      {
        id: '3',
        name: '王五',
        idType: '护照',
        idNumber: 'E12345678',
        phone: '13700137003',
        email: 'wangwu@example.com',
        type: '成人',
        remark: '偶尔乘车人'
      },
      {
        id: '4',
        name: '赵六',
        idType: '身份证',
        idNumber: '110101200503033456',
        phone: '13600136004',
        email: 'zhaoliu@example.com',
        type: '儿童',
        remark: '学生'
      }
    ]
    setPassagers(initialPassagers)
  }, [])

  // 打开添加模态框
  const showAddModal = () => {
    setIsEditing(false)
    setCurrentPassager({
      id: '',
      name: '',
      idType: '',
      idNumber: '',
      phone: '',
      email: '',
      type: '',
      remark: ''
    })
    form.resetFields()
    setIsModalVisible(true)
  }

  // 打开编辑模态框
  const showEditModal = (record: Passager) => {
    setIsEditing(true)
    setCurrentPassager(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // 提交表单
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEditing) {
        // 编辑乘车人
        const updatedPassagers = passagers.map(passager => 
          passager.id === currentPassager.id ? { ...values, id: currentPassager.id } : passager
        )
        setPassagers(updatedPassagers)
        message.success('乘车人信息更新成功')
      } else {
        // 添加乘车人
        const newPassager: Passager = {
          ...values,
          id: Date.now().toString()
        }
        setPassagers([...passagers, newPassager])
        message.success('乘车人信息添加成功')
      }
      setIsModalVisible(false)
    }).catch(errorInfo => {
      console.error('表单验证失败:', errorInfo)
    })
  }

  // 删除乘车人
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定删除这个乘车人吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const updatedPassagers = passagers.filter(passager => passager.id !== id)
        setPassagers(updatedPassagers)
        message.success('乘车人信息删除成功')
      }
    })
  }

  // 表格列配置
  const columns = [
    {
      title: '乘车人ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Passager, b: Passager) => a.name.localeCompare(b.name)
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      key: 'idType'
    },
    {
      title: '证件号码',
      dataIndex: 'idNumber',
      key: 'idNumber'
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
        { text: '学生', value: '学生' }
      ],
      onFilter: (value: string, record: Passager) => record.type === value
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Passager) => (
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

        <Table
          columns={columns}
          dataSource={passagers}
          rowKey="id"
          pagination={{
            pageSize: 10
          }}
          scroll={{
            x: 1200
          }}
        />

        <Modal
          title={isEditing ? '编辑乘车人信息' : '添加乘车人信息'}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" icon={<CloseOutlined />} onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleOk}>
              保存
            </Button>
          ]}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={currentPassager}
          >
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
                <Option value="身份证">身份证</Option>
                <Option value="护照">护照</Option>
                <Option value="港澳通行证">港澳通行证</Option>
                <Option value="台湾通行证">台湾通行证</Option>
                <Option value="军官证">军官证</Option>
                <Option value="士兵证">士兵证</Option>
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
                <RadioButton value="成人">成人</RadioButton>
                <RadioButton value="儿童">儿童</RadioButton>
                <RadioButton value="学生">学生</RadioButton>
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
