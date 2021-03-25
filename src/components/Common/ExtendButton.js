import React from 'react'
import { Popover } from 'antd'
import { Icon } from 'mm-ent-ui'

import styles from './extendButton.less'

export default class ExtendButton extends React.PureComponent {
  handleStopPropagation = (e) => {
    e.stopPropagation()
  }

  renderExtendButton = () => {
    return (
      <ul className={styles.pop}>
        {this.props.children.map((item, index) => (
          <li key={item.key || `item${index}`}>{item}</li>
        ))}
      </ul>
    )
  }

  render() {
    return (
      <Popover
        content={this.renderExtendButton()}
        placement="bottom"
        trigger="click"
        onClick={this.handleStopPropagation}
      >
        <Icon type="ellipsis" className={styles.extendButtonsIcon} />
      </Popover>
    )
  }
}
