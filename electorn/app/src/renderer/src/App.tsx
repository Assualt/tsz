import Versions from './components2/Versions'
import electronLogo from './assets/electron.svg'

import 'element-theme-default' // 引入element-ui的样式
import ToolTip from './components2/ToolTip'
import Login from './components2/Login'
import { Spin } from 'antd'
import { useState, useEffect } from 'react'

function App(): JSX.Element {
  const [spinning, setSpinning] = useState(false)
  const [spinPercent, setSpinPercent] = useState(0)

  const setSpin = (spin: boolean, percent: number) => {
    setSpinning(spin)
    setSpinPercent(percent)
  }

  useEffect(() => {
    // 监听其他窗口的登录状态请求
    window.api.onRequestLoginState((event: any, targetId: number) => {
      const loginData = {
        token: localStorage.getItem('stoken'),
        userInfo: localStorage.getItem('userInfo')
      }
      window.api.sendLoginState(targetId, loginData)
    })

    // 监听同步请求，在窗口加载完成时请求同步
    window.api.onSyncLoginState(() => {
      window.api.getLoginState()
    })

    // 清理监听器
    return () => {
      window.api.removeAllListeners('request-login-state')
      window.api.removeAllListeners('sync-login-state')
    }
  }, [])

  return (
    <>
      <Spin spinning={spinning} percent={spinPercent} fullscreen />
      <img alt="logo" className="logo" src={electronLogo} />
      <Login setSpin={setSpin}></Login>
      <ToolTip></ToolTip>
      <Versions></Versions>
    </>
  )
}

export default App
