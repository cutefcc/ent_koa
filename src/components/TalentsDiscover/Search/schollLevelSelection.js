import React from 'react'
import { Switch } from 'antd'
import PropTypes from 'prop-types'

export default class SchoolLevel extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: 0,
  }

  handleChange = (value) => {
    this.props.onChange(value ? 1 : 0)
  }

  render() {
    const { value } = this.props

    return (
      <Switch
        checkedChildren="是"
        unCheckedChildren="否"
        onChange={this.handleChange}
        checked={value === 1}
      />
    )
  }
}
