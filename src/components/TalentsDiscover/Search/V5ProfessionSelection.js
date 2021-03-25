import React from 'react'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

@connect((state) => ({
  profession: state.global.profession,
}))
export default class Profession extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
  }

  static defaultProps = {
    value: ['全部', '全部'],
  }

  componentDidMount() {
    this.fetchProfession()
  }

  getOptions = () => {
    const { profession } = this.props
    return profession.map((item) => ({
      value: item.code,
      label: item.name,
    }))

    // const getMajorOption = ({name}) => ({
    //   value: name,
    //   label: name,
    // })

    // return pfmj.map(({name, majors = []}) => ({
    //   value: name,
    //   label: name,
    //   children: majors.map(getMajorOption),
    // }))
  }

  fetchProfession = () =>
    this.props.dispatch({ type: 'global/fetchProfession' })

  handleChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    const style = { width: '100%' }

    return (
      <Cascader
        options={this.getOptions()}
        onChange={this.handleChange}
        size="large"
        value={this.props.value}
        changeOnSelect
        expandTrigger="hover"
        placeholder="请选择行业"
        style={style}
        showSearch
      />
    )
  }
}
