import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, Form, Button, Input, message, Checkbox, Space, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd/es/form'
import { login, register, getVerifyCode } from '@/api/user'
import DataType from './constant'
import './style.css'
const { Title } = Typography

// Types and Constants
enum LogType {
  Login = 'login',
  Register = 'register'
}

interface LoginProps {
  setSpin: (loading: boolean, timeout?: number) => void
}

const formItemLayout = {
  wrapperCol: { span: 24 }
}

const onFinishFailed = (_): void => {
  message.error('请检查输入是否正确')
}

// 提取表单验证规则
const userNameRules = [{ required: true, message: '请输入用户名' }]
const telRules = [{ required: true, message: '请输入有效的邮箱地址', type: 'email' }]
const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码长度不能小于6位' },
  { max: 16, message: '密码长度不能大于16位' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/,
    message: '密码必须包含大小写字母和数字'
  }
]
const rePasswordRules = [
  { required: true, message: '请再次输入密码' },
  ({ getFieldValue }): { validator: (_, value: string) => Promise<void> } => ({
    validator(_, value): Promise<void> {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('两次输入的密码不一致'))
    }
  })
]
const verifyCodeRules = [{ required: true, message: '请输入验证码' }]

// 自定义 Hook 处理验证码倒计时
// 定义 useCountdown 函数的返回类型
type UseCountdownReturnType = {
  verifyButtonText: string
  verifyButtonDisable: boolean
  startCountdown: () => void
}

// 为函数添加返回类型
const useCountdown = (): UseCountdownReturnType => {
  const [verifyButtonText, setVerifyButtonText] = useState('获取验证码')
  const [verifyButtonDisable, setVerifyButtonDisable] = useState(false)
  const timerRef = useRef<number | null>(null)

  const startCountdown = (): void => {
    setVerifyButtonDisable(true)
    let count = 60
    setVerifyButtonText(`${count}s后重试`)

    timerRef.current = window.setInterval(() => {
      count--
      if (count <= 0) {
        window.clearInterval(timerRef.current!)
        setVerifyButtonDisable(false)
        setVerifyButtonText('获取验证码')
        return
      }
      setVerifyButtonText(`${count}s后重试`)
    }, 1000)
  }

  useEffect(() => {
    // 为返回的清理函数添加返回类型
    return (): void => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  return { verifyButtonText, verifyButtonDisable, startCountdown }
}

const handleVerifyCode = (
  form: FormInstance<DataType>,
  setVerifyCode: (code: string) => void
): boolean => {
  const userName = form.getFieldValue('userName')
  if (!userName) {
    message.error('请输入用户名')
    return false
  }

  message.loading('正在发送验证码', 2.5, () => {
    getVerifyCode(userName)
      .then((res) => {
        message.success('验证码已发送')
        setVerifyCode(res.data.verifyCode)
      })
      .catch((err) => {
        message.error(err)
      })
  })
  return true
}

/**
 * 登录组件
 * 处理用户登录和注册功能
 * @param {Object} props - 组件属性
 * @param {Function} props.setSpin - 设置加载状态的函数
 */
const Login: React.FC<LoginProps> = ({ setSpin }) => {
  const [form] = Form.useForm<DataType>()
  const [logType, setLogType] = useState<LogType>(LogType.Login)
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { verifyButtonText, verifyButtonDisable, startCountdown } = useCountdown()

  useEffect(() => {
    // 为函数添加返回类型 void，表示该函数不返回任何值
    const handleRequestLoginState = (_, targetId: number): void => {
      const loginData = {
        token: localStorage.getItem('stoken'),
        userInfo: localStorage.getItem('userInfo')
      }
      if (loginData.token && loginData.userInfo) {
        window.api.sendLoginState(targetId, loginData)
      }
    }

    window.api.onRequestLoginState(handleRequestLoginState)

    return (): void => {
      window.api.removeAllListeners('sync-login-state')
      window.api.removeAllListeners('request-login-state')
      window.api.removeAllListeners('receive-login-state')
    }
  }, [])

  const onRegisterFinish = async (values: DataType): Promise<void> => {
    const { userName, password, verifyCode: inputCode } = values

    if (inputCode !== verifyCode) {
      message.error('验证码错误')
      return
    }

    try {
      setIsLoading(true)
      setSpin(true, 0)
      await register(userName, password, inputCode)
      message.success('注册成功')

      setTimeout(() => {
        message.info('1s 后跳转到登录界面')
        setLogType(LogType.Login)
      }, 1000)
    } catch (err) {
      message.error('注册失败')
    } finally {
      setIsLoading(false)
      setSpin(false, 100)
    }
  }

  const applyVerifyCode = useCallback(() => {
    if (!handleVerifyCode(form, setVerifyCode)) {
      return
    }
    startCountdown()
  }, [form])

  const onLoginFinish = async (values: DataType): Promise<void> => {
    try {
      setIsLoading(true)
      const [userName, password] = [values['userName'], values['password']]
      await login(userName, password)
      message.success('登录成功')
      // 同步登录状态到其他窗口
      await window.api.getLoginState()
      // 打开主窗口
      const success = await window.api.openNewWindow()
      if (!success) {
        message.error('打开主窗口失败，请重试')
      }
    } catch (err) {
      console.error('登录失败:', err)
      message.error('登录失败，请重试')
      // 清除可能存在的无效登录信息
      localStorage.removeItem('stoken')
      localStorage.removeItem('userInfo')
    } finally {
      setIsLoading(false)
    }
  }

  const registerForm = (): JSX.Element => {
    return (
      <Form
        form={form}
        name="register"
        {...formItemLayout}
        onFinish={onRegisterFinish}
        onFinishFailed={onFinishFailed}
        size="large"
      >
        <Form.Item<DataType> name="userName" rules={userNameRules}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<DataType> name="tel" rules={telRules}>
          <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
        </Form.Item>

        <Form.Item<DataType> name="password" rules={passwordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item<DataType> name="rePassword" dependencies={['password']} rules={rePasswordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>

        <Form.Item<DataType> name="verifyCode" rules={verifyCodeRules}>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="验证码" />
            <Button onClick={applyVerifyCode} disabled={verifyButtonDisable}>
              {verifyButtonText}
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button className="styled-button" type="primary" htmlType="submit" loading={isLoading}>
              注册
            </Button>
            <Button type="link" onClick={() => setLogType(LogType.Login)}>
              已有账号？立即登录
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  const loginForm = (): JSX.Element => {
    return (
      <Form
        form={form}
        name="login"
        {...formItemLayout}
        initialValues={{ remember: true }}
        onFinish={onLoginFinish}
        onFinishFailed={onFinishFailed}
        size="large"
      >
        <Form.Item<DataType> name="userName" rules={userNameRules}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<DataType> name="password" rules={passwordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <Button className="styled-button" type="primary" htmlType="submit" loading={isLoading}>
              登录
            </Button>
            <Button type="link" onClick={() => setLogType(LogType.Register)}>
              没有账号？立即注册
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  return (
    <div className="login-wrapper">
      <Card className="styled-card">
        <div className="logo">
          <Title level={2}>12306 抢票助手</Title>
          <p>{logType === LogType.Login ? '欢迎回来' : '创建新账号'}</p>
        </div>
        {logType === LogType.Login ? loginForm() : registerForm()}
      </Card>
    </div>
  )
}

export default Login
