import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

export default class JobSelect extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    allowClear: PropTypes.bool,
  }

  static defaultProps = {
    value: '',
    allowClear: true,
  }

  handleChange = (jid) => {
    this.props.onChange(jid)
  }

  render() {
    const jobOptions = this.props.data.map((item) => {
      const val = `${item.position} - ${item.province}·${item.city}`
      return (
        <Select.Option key={item.jid} value={item.jid} title={val}>
          {val}
        </Select.Option>
      )
    })
    const { value } = this.props

    return (
      <Select
        showSearch
        allowClear={this.props.allowClear}
        style={{ width: 200 }}
        placeholder="全部职位"
        optionFilterProp="children"
        onChange={this.props.onChange}
        value={!value ? undefined : value}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        notFoundContent="没有匹配的职位"
      >
        {jobOptions}
      </Select>
    )
  }
}
