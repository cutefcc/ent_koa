import React from 'react'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'

export default class City extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
    pfmj: PropTypes.array,
  }

  static defaultProps = {
    value: ['全部', '全部'],
    pfmj: [],
  }

  getOptions = () => {
    const { pfmj } = this.props

    const getMajorOption = ({ name }) => ({
      value: name,
      label: name,
    })

    return pfmj.map(({ name, majors = [] }) => ({
      value: name,
      label: name,
      children: majors.map(getMajorOption),
    }))
  }

  handleChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    const style = {
      width: '100%',
    }

    return (
      <Cascader
        options={this.getOptions()}
        onChange={this.handleChange}
        size="large"
        value={this.props.value}
        changeOnSelect
        expandTrigger="hover"
        placeholder="请选择行业/方向"
        style={style}
        showSearch
      />
    )
  }
}
