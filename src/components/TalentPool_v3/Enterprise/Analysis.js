import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { isEmpty } from 'utils'
import { showMosaic } from 'utils/account'
import { Typography } from 'mm-ent-ui'
import TalentAnalysisChartTemplate from './TalentAnalysisChartTemplate'
// import { titleMap } from './TalentAnalysisConfig'
import TalentAnalysisConfig from './TalentAnalysisConfig'

import styles from './analysis.less'

@connect((state) => ({
  config: state.global.config,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class Analysis extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    advancedSearchValues: PropTypes.object,
    filter: PropTypes.object,
    navigatorParam: PropTypes.object,
    defaultNavigatorKey: PropTypes.string,
    currentNavigator: PropTypes.object,
  }

  static defaultProps = {
    value: {},
    onChange: () => {},
    onClear: () => {},
    advancedSearchValues: {},
    filter: {},
    navigatorParam: {},
    defaultNavigatorKey: '',
    currentNavigator: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      showDetail: false,
      filter: props.filter,
      data: {},
      advancedSearchValues: props.advancedSearchValues,
      navigatorParam: props.navigatorParam,
    }
  }

  componentDidMount() {
    // 如果没有默认选中项，需要等待 navigator 接口返回数据后才能获取数据
    if (!this.props.defaultNavigatorKey) {
      this.fetchData()
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.advancedSearchValues !== newProps.advancedSearchValues ||
      this.props.filter !== newProps.filter ||
      this.props.navigatorParam !== newProps.navigatorParam
    ) {
      this.setState(
        {
          advancedSearchValues: newProps.advancedSearchValues,
          navigatorParam: newProps.navigatorParam,
          filter: newProps.filter,
        },
        this.fetchData
      )
    }
  }

  fieldsMap = {
    positions: {
      label: '技能',
    },
    ever_companys: {
      label: '曾就职',
    },
    companys: {
      label: '现就职',
    },
    worktimes: {
      label: '经验',
      render: (value) =>
        R.propOr(
          value,
          'label',
          R.propOr([], 'talent_lib_worktimes', this.props.config).find(
            R.propEq('value', parseInt(value, 10))
          )
        ),
    },
    schools: {
      label: '就读',
    },
    pfmj: {
      label: '行业方向',
    },
    city: {
      label: '地区',
    },
  }

  testValues = {
    positions: '测试,开发',
    schools: '北京大学',
  }

  isDisabled = () => {
    const { currentUser, currentNavigator } = this.props
    const needShowMosaic = showMosaic(currentUser)
    return needShowMosaic && currentNavigator.action_code === 1
  }

  fetchData = () => {
    if (this.isDisabled()) {
      this.setState({
        data: {},
      })
      return
    }

    this.props
      .dispatch({
        type: 'talentPool/fetchAnalysis',
        payload: {
          filter: this.state.filter,
          search: {
            ...this.state.advancedSearchValues,
            ...this.state.navigatorParam,
          },
        },
      })
      .then(({ data }) => {
        this.setState({
          data,
        })
      })
  }

  handleToggleDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail,
    })
  }

  handleAnalysisValueChange = () => {
    // this.props.onChange(value)
  }

  handleClearValues = () => {
    this.setState({
      showDetail: false,
    })
    this.props.onClear({})
  }

  handleRemoveValue = (key, value = '') => () => {
    const { value: initValue } = this.props
    this.props.onChange({
      ...initValue,
      [key]: R.without(value, R.propOr('', key, initValue).split(',')).join(
        ','
      ),
    })
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
      },
    })
  }

  renderValues = () => {
    const { fieldsMap } = this
    const renderItem = (value, key) => {
      const fieldMap = R.propOr({}, key, fieldsMap)
      const fieldName = R.prop('label', fieldMap)
      const fieldRender = R.prop('render', fieldMap)
      const values =
        isEmpty(value) || !R.is(String, value) ? [] : value.split(',')
      return values.map((v) =>
        fieldName ? (
          <span
            onClick={this.handleRemoveValue(key, v)}
            key={v}
            className={styles.tag}
          >
            {`${fieldName}: ${fieldRender ? fieldRender(v) : v}`}
            <CloseOutlined />
          </span>
        ) : null
      )
    }
    return R.compose(
      R.flatten,
      R.values,
      R.mapObjIndexed(renderItem)
    )(this.props.value)
  }

  renderDisabledChart = () => {
    const titles = Object.values(TalentAnalysisConfig.titleMap)
    const renderItem = (name, index) => {
      return (
        <div
          key={name}
          style={{
            width: '50%',
            display: 'inline-block',
            height: '230px',
          }}
          className="cursor-pointer"
          onClick={this.handleShowUpgradeMember}
        >
          <Typography.Text
            size="14px"
            strong
            className="margin-top-24 display-block"
            type="stress"
          >
            {name}
          </Typography.Text>
          <img
            src={`${this.props.urlPrefix}/images/chart_legend/${index + 1}.png`}
            alt=""
            style={{ width: '100%', height: '184px', marginTop: '12px' }}
          />
        </div>
      )
    }
    return <div style={{ paddingBottom: '20px' }}>{titles.map(renderItem)}</div>
  }

  renderChart = () => {
    const disabled = this.isDisabled()
    if (disabled) {
      return this.renderDisabledChart()
    }
    const data = R.mapObjIndexed((num, key, obj) =>
      R.filter((y) => y.count > 0 || y.count > '0')(obj[key])
    )(this.state.data)
    return (
      <TalentAnalysisChartTemplate
        value={this.props.value}
        onChange={this.handleAnalysisValueChange}
        data={R.omit(['total'], data)}
        disabled={disabled}
      />
    )
  }

  render() {
    const title = this.isDisabled() ? (
      <span
        className="color-orange cursor-pointer"
        onClick={this.handleShowUpgradeMember}
      >
        开通高级会员可见{this.props.currentNavigator.title}
      </span>
    ) : (
      <span className="color-stress">
        共{R.propOr(0, 'total', this.state.data)}人符合条件{' '}
      </span>
    )
    return (
      <div className={styles.main}>
        <div className="flex space-between margin-top-16 margin-bottom-16">
          {title}
          <span>
            <Button
              className="like-link-button margin-right-16"
              onClick={this.handleToggleDetail}
              disabled={this.state.data.total === 0 && !this.state.showDetail}
            >
              {this.state.showDetail ? '收起数据' : '展开数据'}
            </Button>
            {(!R.isEmpty(this.props.advancedSearchValues) ||
              !R.isEmpty(this.props.filter)) && (
              <Button
                className="like-link-button"
                onClick={this.handleClearValues}
              >
                清空条件
              </Button>
            )}
          </span>
        </div>
        <div className="flex flex-wrap">{this.renderValues()}</div>
        <div className="padding-bottom-16">
          {this.state.showDetail && this.renderChart()}
        </div>
      </div>
    )
  }
}
