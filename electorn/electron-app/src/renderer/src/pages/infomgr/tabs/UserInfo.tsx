import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Form, Input, Select, message, Space, Typography, Avatar, Upload } from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons'
import { getCurrentUser } from '@renderer/api/user'

const { Title, Paragraph } = Typography
const { Option } = Select
const { Dragger } = Upload

interface User {
  id: string
  username: string
  email: string
  phone: string
  realName: string
  gender: string
  age: number
  address: string
  remark: string
  avatar: string
}

const UserInfo = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    username: 'test8@example.com',
    email: 'test8@example.com',
    phone: '13800138001',
    realName: '张三',
    gender: '男',
    age: 30,
    address: '北京市朝阳区',
    remark: '普通用户',
    avatar: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 加载用户信息
  useEffect(() => {
    // 这里可以从 API 获取用户信息
    // 暂时使用模拟数据
    getCurrentUser().then(res => {
      setUser(res?.data)
    }).catch(err => {
      message.error('获取用户信息失败 :' + err.message || '未知错误')
    })

    form.setFieldsValue(user)
  }, [user, form])

  // 开始编辑
  const startEdit = () => {
    setIsEditing(true)
    form.setFieldsValue(user)
  }

  // 取消编辑
  const cancelEdit = () => {
    setIsEditing(false)
    form.resetFields()
  }

  // 保存修改
  const saveEdit = (): void => {
    form.validateFields().then(values => {
      setUser({
        ...user,
        ...values
      })
      setIsEditing(false)
      message.success('个人信息更新成功')
    }).catch(errorInfo => {
      message.error('表单验证失败:', errorInfo)
    })
  }

  // 处理头像上传
  const handleAvatarUpload = (file: any) => {
    // 这里可以实现真实的文件上传逻辑
    // 暂时使用模拟数据
    const mockAvatarUrl = URL.createObjectURL(file)
    setUser({
      ...user,
      avatar: mockAvatarUrl
    })
    form.setFieldsValue({ avatar: mockAvatarUrl })
    message.success('头像上传成功')
    return false // 阻止默认上传行为
  }

  // 点击头像触发文件选择
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>个人信息管理</Title>

        <Card
          extra={
            !isEditing ? (
              <Button type="primary" icon={<EditOutlined />} onClick={startEdit}>
                编辑
              </Button>
            ) : null
          }
        >
          <div style={{ display: 'flex', gap: '30px' }}>
            {/* 左侧：头像和简略信息 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '200px' }}>
              {/* 头像 */}
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <Avatar
                  size={120}
                  src={user.avatar || undefined}
                  icon={<UserOutlined />}
                  style={{ cursor: isEditing ? 'pointer' : 'default' }}
                  onClick={handleAvatarClick}
                />
                {isEditing && (
                  <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: '50%', padding: '5px' }}>
                    <UploadOutlined style={{ color: '#1890ff' }} />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleAvatarUpload(e.target.files[0])
                    }
                  }}
                />
              </div>

              {/* 简略信息 */}
              <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
                <Paragraph strong style={{ margin: 0, fontSize: '16px' }}>{user.realName}</Paragraph>
                <Paragraph style={{ margin: 0, color: '#666' }}>{user.username}</Paragraph>
                <Paragraph style={{ margin: 0, color: '#666' }}>{user.gender} | {user.age}岁</Paragraph>
                <Paragraph style={{ margin: 0, color: '#666' }}>{user.phone}</Paragraph>
              </Space>
            </div>

            {/* 右侧：详细信息 */}
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                >
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input placeholder="请输入用户名" />
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
                    name="realName"
                    label="真实姓名"
                    rules={[{ required: true, message: '请输入真实姓名' }]}
                  >
                    <Input placeholder="请输入真实姓名" />
                  </Form.Item>
                  <Form.Item
                    name="gender"
                    label="性别"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <Select placeholder="请选择性别">
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="年龄"
                    rules={[
                      { required: true, message: '请输入年龄' },
                      { type: 'number', min: 1, max: 150, message: '请输入有效的年龄' }
                    ]}
                  >
                    <Input type="number" placeholder="请输入年龄" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="地址"
                    rules={[{ required: true, message: '请输入地址' }]}
                  >
                    <Input placeholder="请输入地址" />
                  </Form.Item>
                  <Form.Item
                    name="remark"
                    label="备注"
                  >
                    <Input.TextArea rows={4} placeholder="请输入备注信息" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button icon={<CloseOutlined />} onClick={cancelEdit}>
                        取消
                      </Button>
                      <Button type="primary" icon={<SaveOutlined />} onClick={saveEdit}>
                        保存
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Paragraph><strong>邮箱:</strong> {user.email}</Paragraph>
                  </Space>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Paragraph><strong>地址:</strong> {user.address}</Paragraph>
                  </Space>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Paragraph><strong>备注:</strong> {user.remark}</Paragraph>
                  </Space>
                </Space>
              )}
            </div>
          </div>
        </Card>
      </Space>
    </div>
  )
}

export default UserInfo
