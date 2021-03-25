import React from 'react'
import { Drawer } from 'antd'

class DrawerNew extends React.PureComponent {
  render() {
    const { children, ...rest } = this.props
    return <Drawer {...rest}>{children}</Drawer>
  }
}

export default DrawerNew
