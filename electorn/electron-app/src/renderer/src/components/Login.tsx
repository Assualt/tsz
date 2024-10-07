import { Card, Form, Button, Input, message, Checkbox, Space } from 'antd'

import { login, register, getVerifyCode } from '@/api/user'

import React, { useState } from 'react'

import { changeUrl } from '@renderer/stores'

enum LogType {
  Login = 'login',
  Register = 'register'
}

interface DataType {
  userName: string
  password: string
  rePassword?: string
  remember: boolean
  type: LogType
  verifyCode: string
  tel: string
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
}

const onFinish: FormProps<DataType>['onFinish'] = (values) => {
  let userName = values['userName']
  let password = values['password']
  let type = values['type']

  login(userName, password)
    .then((res) => {
      message.success(`登陆成功 ${JSON.stringify(res.data)}`)
      changeUrl('/index')
    })
    .catch((err) => {
      message.error(err)
    })
}

const onFinishFailed: FormProps<DataType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

const handleVerifyCode: boolean = (form: FormInstance<DataType>, setVerifyCode: Function) => {
  let userName = form.getFieldValue('userName')
  if (userName === '' || userName === undefined) {
    message.error(`请输入用户名 ${userName} ${form.getFieldValue('userName')}`)
    return false
  }

  message.loading('正在发送验证码', 2.5, () => {
    getVerifyCode(userName)
      .then((res) => {
        message.success(`验证码已发送`)
        console.log(res.data)
        res.data.verifyCode
        setVerifyCode(res.data.verifyCode)
      })
      .catch((err) => {
        message.error(err)
      })
  })
  return true
}

const Login: React.FC = ({ setSpin }) => {
  const [form] = Form.useForm<DataType>()
  const [logType, setLogType] = useState<LogType>(LogType.Login)
  const [verifyCode, setVerifyCode] = useState<number>(0)
  const [verifyButtonText, setVerifyButtonText] = useState<string>('获取验证码')
  const [verifyButtonDisable, setVerifyButtonDisable] = useState<boolean>(false)

  const onRegisterFinish: FormProps<DataType>['onFinish'] = (values) => {
    let userName = values['userName']
    let password = values['password']
    let code = values['verifyCode']

    if (code !== verifyCode.toString()) {
      message.error('验证码错误')
      console.log(code, verifyCode, typeof code, typeof verifyCode)
      return
    }

    setSpin(true, 0)
    setTimeout(() => {
      register(userName, password, code)
        .then((res) => {
          message.success(`注册成功 ${JSON.stringify(res.data)}`)
        })
        .catch((err) => {
          message.error(err)
        })
      setSpin(false, 100)
      setTimeout(() => {
        message.info('1s 后跳转到登陆界面')
        setLogType(LogType.Login)
      }, 1000)
    }, 3000)
  }

  const applyVerifyCode = () => {
    if (handleVerifyCode(form, setVerifyCode) == false) {
      return
    }
    setVerifyButtonDisable(true)
    let count = 60
    setInterval(() => {
      if (count <= 0) {
        clearInterval()
        setVerifyButtonDisable(false)
        setVerifyButtonText('获取验证码')
        return
      }
      setVerifyButtonText(count-- + 's后重试')
    }, 1000)
  }

  const registerForm = () => {
    return (
      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, minWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onRegisterFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<DataType>
          label="用户名"
          name="userName"
          rules={[{ required: true, message: '请输入用户名', type: 'string' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<DataType>
          label="邮箱地址"
          name="tel"
          rules={[
            {
              required: true,
              message: '请输入有效的邮箱地址',
              type: 'email'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<DataType>
          label="密码"
          name="password"
          hasFeedback
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能小于6位' },
            { max: 16, message: '密码长度不能大于18位' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/,
              message: '密码必须包含大小写字母和数字'
            },
            { whitespace: true, message: '密码不能包含空格' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<DataType>
          label="再次键入密码"
          name="rePassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: '请再次输入密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<DataType> label="请输入验证码" name="verifyCode">
          <Space>
            <Input />
            <Button type="primary" disabled={verifyButtonDisable} onClick={applyVerifyCode}>
              {verifyButtonText}
            </Button>
          </Space>
        </Form.Item>

        <Form.Item<DataType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
            <Button
              type="link"
              onClick={() => {
                setLogType(LogType.Login)
              }}
            >
              已有账户
            </Button>
            <Button type="link" htmlType="button">
              忘记密码
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  const loginForm = () => {
    return (
      <Form
        form={form}
        name="login"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, minWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<DataType>
          label="用户名"
          name="userName"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<DataType>
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<DataType>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              登陆
            </Button>
            <Button type="link" onClick={() => setLogType(LogType.Register)}>
              没有账户?
            </Button>
            <Button type="link" htmlType="button" onClick={() => {}}>
              忘记密码
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  return (
    <Card
      style={{ minWidth: 300, alignItems: 'center', justifyContent: 'center' }}
      title={logType === LogType.Login ? <span>登录</span> : <span>注册</span> }
    >
      {logType === LogType.Login ? loginForm() : registerForm()}
    </Card>
  )
}

export default Login
