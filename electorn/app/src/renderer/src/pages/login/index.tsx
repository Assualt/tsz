import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Form, Button, Input, message, Checkbox, Divider, Modal } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  DoubleRightOutlined,
  QrcodeOutlined
} from '@ant-design/icons'
import type { FormInstance } from 'antd/es/form'
import { login, register, getVerifyCode } from '@/api/user'
import { api } from '@renderer/api/index'
import { marked } from 'marked'
import DataType from './constant'
import Copyright from '@renderer/components/Copyright'
import QRCodeLogin from './QRCodeLogin'
import './style.css'

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

const onFinishFailed = (): void => {
  message.error('请检查输入是否正确')
}

const userNameRules = [{ required: true, message: '请输入用户名' }]
const emailRules = [{ required: true, message: '请输入有效的邮箱地址', type: 'email' as const }]
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

type UseCountdownReturnType = {
  verifyButtonText: string
  verifyButtonDisable: boolean
  startCountdown: () => void
}

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

  getVerifyCode(userName)
    .then((res) => {
      console.log('Verify code response:', JSON.stringify(res, null, 2))

      if (res && (res.code === 200 || res.message)) {
        message.success('验证码已发送，请查收邮箱')
        setVerifyCode('')
      } else {
        message.error('获取验证码失败')
      }
    })
    .catch((error) => {
      console.error('Get verify code failed:', error)
      message.error('获取验证码失败：' + (error?.message || '未知错误'))
    })
  return true
}

const SlideVerify: React.FC<{
  visible: boolean
  onSuccess: () => void
  onCancel: () => void
}> = ({ visible, onSuccess, onCancel }) => {
  const [sliderLeft, setSliderLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [startX, setStartX] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const sliderWidth = 44
  const trackWidth = 280

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (isVerified) return
    setIsDragging(true)
    setStartX(e.clientX - sliderLeft)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (!isDragging || isVerified) return
      let newLeft = e.clientX - startX
      if (newLeft < 0) newLeft = 0
      if (newLeft > trackWidth - sliderWidth) newLeft = trackWidth - sliderWidth
      setSliderLeft(newLeft)
    },
    [isDragging, isVerified, startX]
  )

  const handleMouseUp = useCallback((): void => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = trackWidth - sliderWidth - 5
    if (sliderLeft >= threshold) {
      setIsVerified(true)
      setSliderLeft(trackWidth - sliderWidth)
      setTimeout(() => {
        onSuccess()
        resetState()
      }, 600)
    } else {
      setSliderLeft(0)
    }
  }, [isDragging, sliderLeft, onSuccess])

  const resetState = (): void => {
    setSliderLeft(0)
    setIsDragging(false)
    setIsVerified(false)
    setStartX(0)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return (): void => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    if (!visible) {
      resetState()
    }
  }, [visible])

  const progressWidth = sliderLeft + sliderWidth / 2

  return (
    <Modal
      title="安全验证"
      open={visible}
      onCancel={() => {
        resetState()
        onCancel()
      }}
      footer={null}
      centered
      width={360}
      className="slide-verify-modal"
    >
      <div className="slide-verify-container">
        <p className="slide-verify-tip">请拖动滑块完成验证</p>
        <div className="slide-verify-track" ref={trackRef}>
          <div className="slide-verify-progress" style={{ width: progressWidth }} />
          {!isVerified && (
            <div
              className="slide-verify-slider"
              style={{ left: sliderLeft }}
              onMouseDown={handleMouseDown}
            >
              <DoubleRightOutlined />
            </div>
          )}
          {isVerified && <div className="slide-verify-success">✓ 验证成功</div>}
          {!isVerified && sliderLeft === 0 && (
            <div className="slide-verify-placeholder">向右拖动滑块完成验证</div>
          )}
        </div>
      </div>
    </Modal>
  )
}

const Login: React.FC<LoginProps> = ({ setSpin }) => {
  const [form] = Form.useForm<DataType>()
  const [logType, setLogType] = useState<LogType>(LogType.Login)
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [slideVerifyVisible, setSlideVerifyVisible] = useState(false)
  const [policyModalVisible, setPolicyModalVisible] = useState(false)
  const [policyTitle, setPolicyTitle] = useState('')
  const [policyContent, setPolicyContent] = useState('')
  const [policyLoading, setPolicyLoading] = useState(false)
  const [qrCodeLoginVisible, setQrCodeLoginVisible] = useState(false)
  const { verifyButtonText, verifyButtonDisable, startCountdown } = useCountdown()

  useEffect(() => {
    if (!window.api) return

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
    if (!agreementChecked) {
      message.warning('请先阅读并同意用户协议')
      return
    }
    const userName = values.userName
    const password = values.password
    const email = values.email
    const code = values.verifyCode
    try {
      setIsLoading(true)
      await register(userName, password, email, code)
      message.success('注册成功')

      setTimeout(() => {
        message.info('1s 后跳转到登录界面')
        setLogType(LogType.Login)
      }, 1000)
    } catch {
      message.error('注册失败')
    } finally {
      setIsLoading(false)
    }
  }

  const onSlideVerifySuccess = useCallback(() => {
    setSlideVerifyVisible(false)
    if (!handleVerifyCode(form, setVerifyCode)) {
      return
    }
    startCountdown()
  }, [form])

  const applyVerifyCode = useCallback(() => {
    if (!agreementChecked) {
      message.warning('请先阅读并同意用户协议')
      return
    }
    const userName = form.getFieldValue('userName')
    if (!userName) {
      message.error('请输入用户名')
      return
    }
    setSlideVerifyVisible(true)
  }, [form, agreementChecked])

  const onLoginFinish = async (values: DataType): Promise<void> => {
    try {
      setIsLoading(true)
      const [userName, password] = [values['userName'], values['password']]
      await login(userName, password)
      message.success('登录成功')
      await window.api.getLoginState()
      const success = await window.api.openNewWindow()
      if (success) {
        window.close()
      } else {
        message.error('打开主窗口失败，请重试')
      }
    } catch {
      message.error('登录失败，请重试')
      localStorage.removeItem('stoken')
      localStorage.removeItem('userInfo')
    } finally {
      setIsLoading(false)
    }
  }

  const onQRCodeLoginSuccess = async (_token: string, _userInfo: unknown): Promise<void> => {
    setQrCodeLoginVisible(false)
    message.success('扫码登录成功')
    try {
      await window.api.getLoginState()
      const success = await window.api.openNewWindow()
      if (success) {
        window.close()
      } else {
        message.error('打开主窗口失败，请重试')
      }
    } catch {
      message.error('跳转失败，请手动登录')
    }
  }

  const switchLogType = () => {
    form.resetFields()
    setAgreementChecked(false)
    setLogType(logType === LogType.Login ? LogType.Register : LogType.Login)
  }

  const openPolicyModal = async (type: 'agreement' | 'privacy') => {
    const defaultTitle = type === 'agreement' ? '用户服务协议' : '隐私政策'
    const url = type === 'agreement' ? '/static/user-agreement' : '/static/privacy-policy'
    setPolicyTitle(defaultTitle)
    setPolicyContent('')
    setPolicyModalVisible(true)
    setPolicyLoading(true)
    try {
      const res = await api.get(url)
      console.log('Policy API response:', res)
      const data = res?.data
      if (data) {
        const title = data.title || defaultTitle
        const updatedAt = data.updated_at ? `（更新于 ${data.updated_at}）` : ''
        setPolicyTitle(title + updatedAt)
        const markdownContent = data.content || ''
        if (markdownContent) {
          const htmlContent = await marked(markdownContent)
          setPolicyContent(htmlContent)
        } else {
          setPolicyContent('<p>暂无内容</p>')
        }
      } else {
        setPolicyContent('<p>暂无内容</p>')
      }
    } catch (err) {
      console.error('Policy API error:', err)
      setPolicyContent('<p>获取内容失败，请稍后重试</p>')
    } finally {
      setPolicyLoading(false)
    }
  }

  const formKey = logType

  const registerForm = (): JSX.Element => {
    return (
      <Form
        form={form}
        name="register"
        {...formItemLayout}
        onFinish={onRegisterFinish}
        onFinishFailed={onFinishFailed}
        size="large"
        className="login-form"
      >
        <div className="form-header">
          <h2>创建新账号</h2>
          <p>请填写以下信息完成注册</p>
        </div>

        <Form.Item<DataType> name="userName" rules={userNameRules}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<DataType> name="email" rules={emailRules}>
          <Input prefix={<MailOutlined />} placeholder="邮箱地址" />
        </Form.Item>

        <Form.Item<DataType> name="password" rules={passwordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item<DataType> name="rePassword" dependencies={['password']} rules={rePasswordRules}>
          <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
        </Form.Item>

        <Form.Item<DataType> name="verifyCode" rules={verifyCodeRules}>
          <div className="verify-code-wrapper">
            <Input prefix={<SafetyCertificateOutlined />} placeholder="验证码" />
            <Button
              onClick={applyVerifyCode}
              disabled={verifyButtonDisable}
              className="verify-code-btn"
            >
              {verifyButtonText}
            </Button>
          </div>
        </Form.Item>

        <div className="agreement-wrapper">
          <Checkbox
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          >
            <span className="agreement-text">
              我已阅读并同意
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openPolicyModal('agreement')
                }}
              >
                《用户服务协议》
              </a>
              和
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openPolicyModal('privacy')
                }}
              >
                《隐私政策》
              </a>
            </span>
          </Checkbox>
        </div>

        <Form.Item>
          <Button className="submit-button" type="primary" htmlType="submit" loading={isLoading}>
            注册
          </Button>
        </Form.Item>

        <div className="form-footer">
          <span>已有账号？</span>
          <Button type="link" onClick={switchLogType}>
            立即登录
          </Button>
        </div>
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
        className="login-form"
      >
        <div className="form-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账号</p>
        </div>

        <Form.Item<DataType> name="userName" rules={userNameRules}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item<DataType> name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item>
          <Button className="submit-button" type="primary" htmlType="submit" loading={isLoading}>
            登录
          </Button>
        </Form.Item>

        <Divider plain>或</Divider>

        <div className="form-footer">
          <span>没有账号？</span>
          <Button type="link" onClick={switchLogType}>
            立即注册
          </Button>
        </div>
      </Form>
    )
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-content">
          <div className="brand-icon">
            <RocketOutlined />
          </div>
          <h1>12306 抢票助手</h1>
          <p>快速、便捷的火车票预订平台</p>
          <div className="brand-features">
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>智能抢票，一键下单</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>实时余票查询</span>
            </div>
            <div className="feature-item">
              <div className="feature-dot"></div>
              <span>多账号同时抢票</span>
            </div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-wrapper" key={formKey}>
          <div className="form-animate">
            {logType === LogType.Login ? loginForm() : registerForm()}
          </div>
        </div>
        <div className="login-footer-wrapper">
          <Copyright />
        </div>
        {/* 右下角扫码登录按钮 - 仅在登录模式下显示 */}
        {logType === LogType.Login && (
          <div className="qrcode-login-entry" onClick={() => setQrCodeLoginVisible(true)}>
            <QrcodeOutlined className="qrcode-login-icon" />
            <span className="qrcode-login-text">扫码登录</span>
          </div>
        )}
      </div>
      <SlideVerify
        visible={slideVerifyVisible}
        onSuccess={onSlideVerifySuccess}
        onCancel={() => setSlideVerifyVisible(false)}
      />
      <QRCodeLogin
        visible={qrCodeLoginVisible}
        onClose={() => setQrCodeLoginVisible(false)}
        onLoginSuccess={onQRCodeLoginSuccess}
      />
      <Modal
        title={policyTitle}
        open={policyModalVisible}
        onCancel={() => setPolicyModalVisible(false)}
        footer={<Button onClick={() => setPolicyModalVisible(false)}>关闭</Button>}
        width={640}
        centered
        className="policy-modal"
      >
        <div className="policy-content">
          {policyLoading ? (
            <div className="policy-loading">加载中...</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: policyContent }} />
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Login
