import React from 'react'
import { Tooltip } from 'antd'
import styles from './index.less'

class MUITooltip extends React.PureComponent {

  render() {
    const { theme = 'black' } = this.props

    return (
      <Tooltip
        {...this.props}
        getPopupContainer={triggerNode => triggerNode.parentElement}
        overlayClassName={`${this.props.className} ${styles.tooltip} ${
          theme === 'white' ? styles.white : ''
        }`}
      >
        {this.props.children}
      </Tooltip>
    )
  }
}

export default MUITooltip
