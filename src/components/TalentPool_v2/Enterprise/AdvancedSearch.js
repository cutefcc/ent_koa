import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Select, Cascader, AutoComplete } from 'antd'
import {
  DEFAULT_SCHOOL_OPTIONS_V2,
  DEFAULT_POSITION_OPTIONS,
  DEFAULT_COMPANY_OPTIONS_V2,
  MUNICIPALITY,
  WORK_TIME_OPTIONS,
} from 'constants'
import styles from './advancedSearch.less'

@connect((state) => ({
  dictionary: state.global.dictionary,
}))
export default class AdvancedSearch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }

  state = {
    companySugs: DEFAULT_COMPANY_OPTIONS_V2.map((item) => ({
      name: item.label,
    })),
    positionSugs: DEFAULT_POSITION_OPTIONS.map((item) => ({
      name: item.label,
    })),
    schoolSugs: DEFAULT_SCHOOL_OPTIONS_V2.map((item) => ({ name: item.label })),
  }

  getCityOptions = () => {
    const { loc = [] } = this.props.dictionary

    const getCityOption = (province) => ({ city }) => ({
      value: `${province}-${city}`,
      label: city,
    })

    return [
      ...loc.map(({ province, cities = [] }) => ({
        value: province,
        label: province,
        children: MUNICIPALITY.includes(province)
          ? [
              {
                value: province,
                label: province,
              },
            ]
          : [
              {
                value: `${province}-全部`,
                label: '全部',
              },
              ...cities.map(getCityOption(province)),
            ],
      })),
    ]
  }

  getOptions = (values) => {
    return values.map((item) => (
      <Select.Option
        value={item.value === 0 ? item.value : item.value || item.name}
        key={item.value || item.name}
      >
        {item.label || item.name}
      </Select.Option>
    ))
  }

  fetchCompanySugs = (keyword) => () => {
    this.props
      .dispatch({
        type: 'global/fetchCompanySugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          companySugs: data || [],
        })
      })
  }

  fetchPositionSugs = (keyword) => () => {
    this.props
      .dispatch({
        type: 'global/fetchPositionSugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          positionSugs: data || [],
        })
      })
  }

  fetchSchoolSugs = (keyword) => () => {
    this.props
      .dispatch({
        type: 'global/fetchSchoolSugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          schoolSugs: data || [],
        })
      })
  }

  handleSearch = (func) => (value) => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(func(value), 500)
  }

  handleInputChange = (key) => (value) => {
    // this.props.onChange({
    //   ...this.props.value,
    //   [key]: value,
    // })
    if (this.props.value[key] === value) {
      return
    }
    const formatValue = {
      ...this.props.value,
    }
    if (key === 'worktime') {
      formatValue.workyearmin = R.propOr(0, 0, value.split('-'))
      formatValue.workyearmax = R.propOr(0, 1, value.split('-'))
    } else if (key === 'city') {
      formatValue.province = R.prop(0, value)
      formatValue.city =
        !R.prop(1, value) || R.prop(1, value[1].split('-')) === '全部'
          ? undefined
          : R.prop(1, value[1].split('-'))
    } else {
      formatValue[key] = value
    }

    this.props.onChange(formatValue)
  }

  worktimeOptions = [
    {
      label: '不限',
      value: 0,
    },
    {
      label: '专科',
      value: 0,
    },
  ]

  render() {
    return (
      <div className={styles.main}>
        <AutoComplete
          dataSource={this.state.positionSugs.map(R.prop('name'))}
          placeholder="职位技能"
          onSelect={this.handleInputChange('positions')}
          onBlur={this.handleInputChange('positions')}
          onSearch={this.handleSearch(this.fetchPositionSugs)}
          className={styles.select}
          filterOption={false}
        />
        <Select
          placeholder="工作年限"
          onChange={this.handleInputChange('worktime')}
          className={styles.select}
        >
          {this.getOptions(
            WORK_TIME_OPTIONS.map((item, index) =>
              index < WORK_TIME_OPTIONS.length - 1 ? item : `${item}及以上`
            )
          )}
        </Select>
        <AutoComplete
          dataSource={this.state.companySugs.map(R.prop('name'))}
          placeholder="就职公司"
          onSelect={this.handleInputChange('companys')}
          onBlur={this.handleInputChange('companys')}
          onSearch={this.handleSearch(this.fetchCompanySugs)}
          className={styles.select}
          filterOption={false}
        />
        <Cascader
          placeholder="城市地区"
          options={this.getCityOptions()}
          onChange={this.handleInputChange('city')}
          className={styles.select}
          expandTrigger="hover"
        />
        <AutoComplete
          dataSource={this.state.schoolSugs.map(R.prop('name'))}
          placeholder="毕业学校"
          onSelect={this.handleInputChange('schools')}
          onBlur={this.handleInputChange('schools')}
          onSearch={this.handleSearch(this.fetchSchoolSugs)}
          className={styles.select}
          filterOption={false}
        />
      </div>
    )
  }
}
