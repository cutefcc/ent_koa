import React from 'react'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'
import styles from './common.less'

export default class Category extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    const { value } = this.props
    const options = [
      { label: '有简历', value: 'hasResume', disabled: true },
      { label: '无简历', value: 'noResume', disabled: true },
      { label: '被拒绝', value: 'rejected', disabled: true },
    ]

    return (
      <div className={styles.category}>
        <h3>分类</h3>
        <Checkbox.Group
          options={options}
          onChange={this.handleChange}
          value={value}
        />
      </div>
    )
  }
}
