import React from 'react'
import { Tag } from 'antd'

import styles from './checkableTag.less'

const { CheckableTag } = Tag

export default class MyTag extends React.Component {
  state = { checked: false }

  handleChange = (checked) => {
    this.setState({ checked })
    if (this.props.callback) {
      this.props.callback(checked)
    }
  }

  render() {
    return (
      <span className={styles.tag}>
        <CheckableTag
          checked={this.state.checked}
          onChange={this.handleChange}
          {...this.props}
        />
      </span>
    )
  }
}
