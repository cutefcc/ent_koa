import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Select, Cascader, Input, TreeSelect } from 'antd'
// import PositionsSelection from 'components/Common/PositionSelection'
import {
  DEFAULT_SCHOOL_OPTIONS_V2,
  DEFAULT_POSITION_OPTIONS,
  DEFAULT_COMPANY_OPTIONS,
  MUNICIPALITY,
} from 'constants'
import styles from './advancedSearch.less'

@connect((state) => ({
  dictionary: state.global.dictionary,
  configLoading: state.loading.effects['global/fetchConfig'],
  config: state.global.config,
}))
export default class AdvancedSearch extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    wrapperDom: PropTypes.node.isRequired,
    currentNavigator: PropTypes.object,
  }

  static defaultProps = {
    value: {},
    currentNavigator: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      companySugs: DEFAULT_COMPANY_OPTIONS.map((item) => ({
        name: item.label,
      })),
      positionSugs: DEFAULT_POSITION_OPTIONS.map((item) => ({
        name: item.label,
      })),
      schoolSugs: DEFAULT_SCHOOL_OPTIONS_V2.map((item) => ({
        name: item.label,
      })),
      extraOptions: [],
      value: props.value,
      extraOptionsValue: [],
      sugsSearch: {},
    }
    this.fetchExtraOptions()
  }

  componentWillReceiveProps(newProps) {
    if (this.props.value !== newProps.value) {
      const { value } = newProps
      this.setState({
        value,
        extraOptionsValue: this.state.extraOptions
          .map(R.prop('key'))
          .filter((i) => value[i] === 1),
      })
    }
  }

  getCityOptions = () => {
    const { loc = [] } = this.props.dictionary

    const getCityOption = () => ({ city }) => ({
      value: city,
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
                value: '全部',
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

  getExtraOptions = () => {
    const res = this.state.extraOptions
      .filter(
        (item) =>
          !item.navigator_key ||
          this.props.currentNavigator.itemKey === item.navigator_key
      )
      .map((item) => ({
        title: `${item.name}${item.count ? `(${item.count})` : ''}`,
        value: item.key,
        key: item.key,
      }))
    return res
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

  fetchExtraOptions = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchExtraOptions',
        payload: this.state.value,
      })
      .then(({ data }) => {
        this.setState({
          extraOptions: R.propOr([], 'list', data),
        })
      })
  }

  handleSearch = (key, sugs, func) => (value) => {
    this.setState({
      [sugs]: [],
      sugsSearch: {
        ...this.state.sugsSearch,
        [key]: value,
      },
    })
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(func(value), 500)
  }

  handleInputChange = (key) => (value) => {
    const v = R.pathOr(value, ['target', 'value'], value)
    if (this.props.value[key] === v || (!this.props.value[key] && !v)) {
      return
    }

    const formatValue = {
      ...this.props.value,
    }

    if (key === 'worktime') {
      formatValue.workyearmin = R.propOr(0, 0, v.split('-'))
      formatValue.workyearmax = R.propOr(0, 1, v.split('-'))
    } else {
      formatValue[key] = v
    }

    this.props.onChange(formatValue)
  }

  handleQueryChange = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        query: R.pathOr(value, ['target', 'value'], value),
      },
    })
  }

  handleExtraOptionsChange = (value = []) => {
    const options = this.state.extraOptions.map(R.prop('key'))
    this.props.onChange({
      ...this.props.value,
      ...R.zipObj(
        options,
        options.map((item) => (value.includes(item) ? 1 : 0))
      ),
    })
  }

  handleSetTreeSelectDom = (dom) => {
    this.treeSelectDom = dom
  }

  render() {
    const { value, extraOptionsValue = [], sugsSearch } = this.state
    const extraOptionsEmpty = extraOptionsValue.length === 0
    const options = this.getExtraOptions()

    return (
      <div className={styles.main}>
        <Input.Search
          placeholder="关键词"
          onSearch={this.handleInputChange('query')}
          onBlur={this.handleInputChange('query')}
          onChange={this.handleQueryChange}
          className={styles.select}
          getPopupContainer={() => this.props.wrapperDom || document.body}
          value={value.query}
          allowClear
        />
        <Select
          placeholder="职位技能"
          onChange={this.handleInputChange('positions')}
          onSearch={this.handleSearch(
            'positions',
            'positionSugs',
            this.fetchPositionSugs
          )}
          className={styles.select}
          filterOption={false}
          value={value.positions}
          getPopupContainer={() => this.props.wrapperDom || document.body}
          notFoundContent=""
          showSearch
          allowClear
          attr="jobs_pc_talent_list"
        >
          {this.getOptions(
            R.uniqBy(R.prop('name'), [
              ...(sugsSearch.positions
                ? [{ name: sugsSearch.positions, cid: -1 }]
                : []),
              ...this.state.positionSugs,
            ])
          )}
        </Select>
        <Select
          placeholder="工作年限"
          onChange={this.handleInputChange('worktimes')}
          className={styles.select}
          value={value.worktimes}
          getPopupContainer={() => this.props.wrapperDom || document.body}
          notFoundContent=""
          allowClear
        >
          {this.getOptions(
            R.propOr([], 'talent_lib_worktimes', this.props.config).map(
              (v) => ({
                ...v,
                value: `${v.value}`,
              })
            )
          )}
        </Select>
        <Select
          placeholder="就职公司"
          onChange={this.handleInputChange('companys')}
          onSearch={this.handleSearch(
            'companys',
            'companySugs',
            this.fetchCompanySugs
          )}
          className={styles.select}
          value={value.companys}
          filterOption={false}
          getPopupContainer={() => this.props.wrapperDom || document.body}
          notFoundContent=""
          showSearch
          allowClear
        >
          {this.getOptions(
            R.uniqBy(R.prop('name'), [
              ...(sugsSearch.companys
                ? [{ name: sugsSearch.companys, cid: -1 }]
                : []),
              ...this.state.companySugs,
            ])
          )}
        </Select>
        <Cascader
          placeholder="城市地区"
          options={this.getCityOptions()}
          onChange={this.handleInputChange('city')}
          className={styles.select}
          expandTrigger="hover"
          value={value.city}
          getPopupContainer={() => this.props.wrapperDom || document.body}
        />
        <Select
          placeholder="毕业学校"
          onChange={this.handleInputChange('schools')}
          onSearch={this.handleSearch(
            'schools',
            'schoolSugs',
            this.fetchSchoolSugs
          )}
          className={styles.select}
          value={value.schools}
          filterOption={false}
          getPopupContainer={() => this.props.wrapperDom || document.body}
          notFoundContent=""
          allowClear
          showSearch
        >
          {this.getOptions(
            R.uniqBy(R.prop('name'), [
              ...(sugsSearch.schools
                ? [{ name: sugsSearch.schools, value: sugsSearch.schools }]
                : []),
              ...this.state.schoolSugs,
            ])
          )}
        </Select>
        <div className={`${styles.select} ${styles.extraSelect}`}>
          <span
            className={`ant-select ${styles.value} ${
              extraOptionsEmpty ? styles.valueEmpty : ''
            }`}
          >
            {extraOptionsEmpty
              ? '更多筛选'
              : `筛选 ${extraOptionsValue.length}`}
          </span>
          <TreeSelect
            treeData={options}
            value={this.state.extraOptionsValue}
            onChange={this.handleExtraOptionsChange}
            treeCheckable
            showCheckedStrategy="SHOW_PARENT"
            searchPlaceholder=""
            getPopupContainer={() => this.props.wrapperDom || document.body}
            ref={this.handleSetTreeSelectDom}
            dropdownClassName={styles.treeSelect}
          />
        </div>
      </div>
    )
  }
}
