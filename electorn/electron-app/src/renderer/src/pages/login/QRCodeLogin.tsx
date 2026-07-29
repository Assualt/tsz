import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  const [totalSeconds, setTotalSeconds] = useState<number>(60)
  const [status, setStatus] = useState<QRStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const sessionIdRef = useRef<string>('')
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPollingRef = useRef(false)
  const isCountingDownRef = useRef(false)

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  const clearCountdownTimer = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current)
      countdownTimerRef.current = null
    }
  }, [])

  const clearAllTimers = useCallback(() => {
    clearPollTimer()
    clearCountdownTimer()
    isPollingRef.current = false
    isCountingDownRef.current = false
  }, [clearPollTimer, clearCountdownTimer])

  const stopCountdown = useCallback(() => {
    clearCountdownTimer()
    isCountingDownRef.current = false
  }, [clearCountdownTimer])

  const startCountdown = useCallback((seconds: number) => {
    clearCountdownTimer()
    isCountingDownRef.current = true

    const endTime = Date.now() + seconds * 1000

    countdownTimerRef.current = setInterval(() => {
      const remaining = Math.round((endTime - Date.now()) / 1000)

      if (remaining <= 0) {
        clearCountdownTimer()
        isCountingDownRef.current = false
        setExpireSeconds(0)
        setStatus('expired')
        isPollingRef.current = false
      } else {
        setExpireSeconds(remaining)
      }
    }, 100)
  }, [clearCountdownTimer])

  const pollStatus = useCallback(async (sid: string) => {
    if (!isPollingRef.current) return

    try {
      const res = await checkQRCodeStatus(sid)
      if (res && res.code === 200 && res.data) {
        const data = res.data
        const currentStatus: string = data.status

        if (currentStatus === 'confirmed') {
          isPollingRef.current = false
          clearAllTimers()
          setStatus('confirmed')

          const { access_token, user } = data
          localStorage.setItem('stoken', access_token)
          localStorage.setItem('userInfo', JSON.stringify(user))

          message.success('扫码登录成功')
          onLoginSuccess(access_token, user)
          return
        } else if (currentStatus === 'expired') {
          isPollingRef.current = false
          clearAllTimers()
          setStatus('expired')
          return
        }
      }
    } catch (error: unknown) {
      console.error('Check QR code status failed:', error)
      const errMsg = error instanceof Error ? error.message : ''
      if (errMsg.includes('401') || errMsg.includes('403')) {
        isPollingRef.current = false
        clearAllTimers()
        setStatus('error')
        setErrorMsg('登录状态已失效，请重新登录')
        return
      }
    }

    if (isPollingRef.current) {
      pollTimerRef.current = setTimeout(() => {
        pollStatus(sid)
      }, 2000)
    }
  }, [clearAllTimers, onLoginSuccess])

  const startPolling = useCallback((sid: string) => {
    clearPollTimer()
    isPollingRef.current = true
    pollStatus(sid)
  }, [clearPollTimer, pollStatus])

  const fetchAndGenerateQR = useCallback(async () => {
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
        setTotalSeconds(expireSecondsVal)
        setExpireSeconds(expireSecondsVal)
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
  }, [startCountdown, startPolling])

  useEffect(() => {
    if (visible) {
      fetchAndGenerateQR()
    } else {
      clearAllTimers()
    }

    return (): void => {
      clearAllTimers()
    }
  }, [visible, fetchAndGenerateQR, clearAllTimers])

  const handleRegenerate = (): void => {
    stopCountdown()
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

    if ((status === 'waiting' || status === 'expired') && qrCodeUrl) {
      const progress = totalSeconds > 0 ? (expireSeconds / totalSeconds) * 100 : 0

      return (
        <div className="qrcode-container">
          <div className="qrcode-wrapper">
            <img src={qrCodeUrl} alt="QR Code" className="qrcode-image" />
            {status === 'expired' && (
              <div className="qrcode-overlay">
                <div className="qrcode-overlay-content">
                  <p className="qrcode-overlay-text">二维码已失效</p>
                  <Button type="primary" size="small" onClick={handleRegenerate}>
                    点击刷新
                  </Button>
                </div>
              </div>
            )}
          </div>
          {status === 'waiting' && (
            <div className="qrcode-progress-wrapper">
              <div
                className="qrcode-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
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
        clearAllTimers()
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

        {status === 'expired' && (
          <div className="qrcode-info">
            <p className="qrcode-expired-tip">二维码已失效，请点击上方按钮刷新</p>
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
