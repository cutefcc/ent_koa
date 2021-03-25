import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'
import { COMPANY_LEVEL } from 'constants/position'
import styles from './common.less'

export default class Worktime extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const { value } = this.props
    const labels = COMPANY_LEVEL.map(({ key, label }) => (
      <Radio.Button key={key} value={key}>
        {label}
      </Radio.Button>
    ))

    return (
      <div className={styles.companyLevel}>
        <h3>
          公司等级{' '}
          <span style={{ color: '#ccc', fontSize: '12px', fontWeight: '400' }}>
            (4为最高级别)
          </span>
        </h3>
        <div>
          <Radio.Group
            value={value}
            buttonStyle="solid"
            onChange={this.handleChange}
          >
            {labels}
          </Radio.Group>
        </div>
      </div>
    )
  }
}
