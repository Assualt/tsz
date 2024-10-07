import { Component, ReactNode } from 'react'
class ToolTips extends Component {
  render() {
    return <div className="tooltip">
        如果查询结果中没有满足需求的车次，你还可以使用中转换乘功能，将车次添加到中转站，然后通过中转站进行查询。
        显示的卧铺票价均为上铺票价，供您参考。具体票价以您确认支付时实际购买的铺别票价为准。如因运力原因或者不可抗力因素导致列车调度调整时，当前车型可能会发生变动
    </div>
  }
}

export default ToolTips
