import React from 'react'
import { connect } from 'react-redux'
import { Checkbox, Select } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './search.less'

@connect((state) => ({
  dictionary: state.global.dictionary,
}))
export default class Search extends React.Component {
  static propTypes = {
    search: PropTypes.object,
    onSearchChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    search: {
      pfmj: '',
      loc: '',
    },
  }

  componentDidMount() {}

  getLocOptions = () => {
    const { loc = [] } = this.props.dictionary
    const getCityOption = (city) => ({
      value: city.city,
      label: city.city,
    })
    const getCitiesOption = R.map(getCityOption)
    const options = loc.map((province) => ({
      value: province.province,
      label: province.province,
      children: getCitiesOption(R.propOr([], 'cities', province)),
    }))
    return options
  }

  getProvinceOptions = () => {
    // const {data} = this.state
    // return R.uniq(data.map(R.propOr('其他', 'province'))).map(province => (
    //   <Option value={province}>{province}</Option>
    // ))
    const { loc = [] } = this.props.dictionary
    const provinceList = loc.map(R.prop('province'))
    return provinceList.map((province) => (
      <Select.Option value={province} key={province}>
        {province}
      </Select.Option>
    ))
  }

  getPfmjOptions = () => {
    const { pfmj = [] } = this.props.dictionary
    const getMajorOption = (major) => ({
      value: major.id,
      label: major.name,
    })
    const getMajorsOption = R.map(getMajorOption)
    const options = pfmj.map((profession) => ({
      value: profession.id,
      label: profession.name,
      children: getMajorsOption(R.propOr([], 'majors', profession)),
    }))
    return options
  }

  handleSearchChange = (type) => (value) => {
    this.props.onSearchChange(
      type,
      type === 'onlyWithPhone' ? value.target.checked : value
    )
  }

  render() {
    return (
      <div className={styles.main}>
        {/* <Cascader
          options={this.getLocOptions()}
          onChange={this.handleSearchChange('loc')}
          value={this.props.search.loc}
          placeholder="所在地区"
          key="loc"
          expandTrigger="hover"
          showSearch
        /> */}
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="所在地区"
          optionFilterProp="children"
          onChange={this.handleSearchChange('loc')}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          value={this.props.search.loc}
          allowClear
        >
          {this.getProvinceOptions()}
        </Select>
        {/* <Cascader
          options={this.getPfmjOptions()}
          onChange={this.handleSearchChange('pfmj')}
          value={this.props.search.pfmj}
          className={styles.profession}
          placeholder="行业"
          key="pfmj"
          expandTrigger="hover"
        /> */}
        <div className={styles.fr}>
          <Checkbox
            onChange={this.handleSearchChange('onlyWithPhone')}
            checked={this.props.search.onlyWithPhone}
          >
            仅查看有手机号的
          </Checkbox>
        </div>
      </div>
    )
  }
}
