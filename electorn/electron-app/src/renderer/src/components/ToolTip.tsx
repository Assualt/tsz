import { Button } from 'element-react'
import { Component } from 'react'

class ToolTip extends Component {
  render() {
    return (
      <div>
        {/* <Button plain onClick={this.onClick.bind(this)}>Click me!</Button> */}
      </div>
    )
  }

  onClick(event) {
    console.log(event, this.props)
    
  }
}

export default ToolTip