import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'
import { WORKTIME_OPTIONS } from 'constants/position'

// import styles from './advancedSearch.less'

export default class Worktime extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    value: undefined,
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { value } = this.props
    const labels = [
      <Radio.Button key="全部" value={undefined}>
        全部
      </Radio.Button>,
      ...WORKTIME_OPTIONS.map(({ label }) => (
        <Radio.Button key={label} value={label}>
          {label}
        </Radio.Button>
      )),
    ]

    return (
      <div>
        <Radio.Group
          value={value}
          buttonStyle="solid"
          onChange={this.handleChange}
        >
          {labels}
        </Radio.Group>
      </div>
    )
  }
}
