import React, { useState, useEffect, useRef } from 'react'
import { Modal, Spin, message, Button } from 'antd'
import QRCodeLib from 'qrcode'
import { generateQRCode, checkQRCodeStatus } from '@/api/user'

interface QRCodeLoginProps {
  visible: boolean
  onClose: () => void
  onLoginSuccess: (token: string, userInfo: unknown) => void
}

type QRStatus = 'idle' | 'loading' | 'waiting' | 'expired' | 'error' | 'confirmed'

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ visible, onClose, onLoginSuccess }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [expireSeconds, setExpireSeconds] = useState<number>(60)
  const [status, setStatus] = useState<QRStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const sessionIdRef = useRef<string>('')
  const pollTimerRef = useRef<number | null>(null)
  const countdownTimerRef = useRef<number | null>(null)
  const isPollingRef = useRef(false)

  const clearTimers = (): void => {
    if (pollTimerRef.current) {
      window.clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
    isPollingRef.current = false
  }

  const startCountdown = (seconds: number): void => {
    setExpireSeconds(seconds)
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current)
    }
    countdownTimerRef.current = window.setInterval(() => {
      setExpireSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdownTimerRef.current!)
          setStatus('expired')
          isPollingRef.current = false
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const pollStatus = async (sid: string): Promise<void> => {
    if (!isPollingRef.current) return
    try {
      const res = await checkQRCodeStatus(sid)
      if (res && res.code === 200 && res.data) {
        const data = res.data
        const currentStatus: string = data.status

        if (currentStatus === 'confirmed') {
          isPollingRef.current = false
          clearTimers()
          setStatus('confirmed')

          const { access_token, user } = data
          localStorage.setItem('stoken', access_token)
          localStorage.setItem('userInfo', JSON.stringify(user))

          message.success('扫码登录成功')
          onLoginSuccess(access_token, user)
          return
        } else if (currentStatus === 'expired') {
          isPollingRef.current = false
          clearTimers()
          setStatus('expired')
          return
        }
      }
    } catch (error: unknown) {
      console.error('Check QR code status failed:', error)
      const errMsg = error instanceof Error ? error.message : ''
      if (errMsg.includes('401') || errMsg.includes('403')) {
        isPollingRef.current = false
        clearTimers()
        setStatus('error')
        setErrorMsg('登录状态已失效，请重新登录')
        return
      }
    }

    if (isPollingRef.current) {
      pollTimerRef.current = window.setTimeout(() => {
        pollStatus(sid)
      }, 2000) as unknown as number
    }
  }

  const startPolling = (sid: string): void => {
    clearTimers()
    isPollingRef.current = true
    pollStatus(sid)
  }

  const fetchAndGenerateQR = async (): Promise<void> => {
    setStatus('loading')
    setErrorMsg('')
    setQrCodeUrl('')

    try {
      const res = await generateQRCode()
      if (res && res.code === 200 && res.data) {
        const data = res.data
        const newSessionId: string = data.session_id
        const qrContent: string = data.qr_content
        const expireSecondsVal: number = data.expire_seconds || 60

        sessionIdRef.current = newSessionId

        const url = await QRCodeLib.toDataURL(qrContent, {
          width: 200,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        })
        setQrCodeUrl(url)
        setStatus('waiting')
        startCountdown(expireSecondsVal)
        startPolling(newSessionId)
      } else {
        setStatus('error')
        setErrorMsg(res?.message || '生成二维码失败')
      }
    } catch (error: unknown) {
      console.error('Generate QR code failed:', error)
      const errMsg = error instanceof Error ? error.message : '未知错误'
      setStatus('error')
      if (errMsg.includes('401') || errMsg.includes('403') || errMsg.includes('Authorization')) {
        setErrorMsg('登录状态已失效，请重新登录')
      } else if (errMsg.includes('Network Error') || errMsg.includes('timeout')) {
        setErrorMsg('无法连接服务器，请检查网络或后端服务是否启动')
      } else {
        setErrorMsg(`生成二维码失败：${errMsg}`)
      }
    }
  }

  useEffect(() => {
    if (visible) {
      fetchAndGenerateQR()
    } else {
      clearTimers()
    }
    const cleanup = (): void => {
      clearTimers()
    }
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleRegenerate = (): void => {
    fetchAndGenerateQR()
  }

  const renderQRContent = (): React.ReactNode => {
    if (status === 'error') {
      return (
        <div className="qrcode-expired">
          <p>{errorMsg}</p>
          <Button type="primary" onClick={handleRegenerate}>
            点击重试
          </Button>
        </div>
      )
    }

    if (status === 'loading') {
      return (
        <Spin spinning={true} tip="生成二维码中...">
          <div className="qrcode-wrapper-placeholder" />
        </Spin>
      )
    }

    if (status === 'expired') {
      return (
        <div className="qrcode-expired">
          <p>二维码已过期</p>
          <Button type="primary" onClick={handleRegenerate}>
            点击刷新
          </Button>
        </div>
      )
    }

    if (status === 'waiting' && qrCodeUrl) {
      return (
        <div className="qrcode-wrapper">
          <img src={qrCodeUrl} alt="QR Code" className="qrcode-image" />
        </div>
      )
    }

    return null
  }

  return (
    <Modal
      title="扫码登录"
      open={visible}
      onCancel={() => {
        clearTimers()
        onClose()
      }}
      footer={null}
      centered
      width={360}
      className="qrcode-login-modal"
    >
      <div className="qrcode-login-container">
        {renderQRContent()}

        {status === 'waiting' && (
          <div className="qrcode-info">
            <p className="qrcode-tip">请使用 12306 抢票助手 APP 扫一扫</p>
            <p className="qrcode-countdown">
              二维码将在 <span className="countdown-number">{expireSeconds}</span> 秒后过期
            </p>
          </div>
        )}

        {status === 'confirmed' && (
          <div className="qrcode-success">
            <p>扫码登录成功，正在跳转...</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default QRCodeLogin
