import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

import 'element-theme-default' // 引入element-ui的样式
import ToolTip from './components/ToolTip'
import Login from './components/Login'
import { Spin } from 'antd'
import { useState } from 'react'

function App(): JSX.Element {
  const [spinning, setSpinning] = useState(false)
  const [spinPercent, setSpinPercent] = useState(0)

  const setSpin = (spin: boolean, percent: number) => {
    setSpinning(spin)
    setSpinPercent(percent)
  }

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
