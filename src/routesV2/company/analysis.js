import React from 'react'
import {
  Tab,
  Text,
  TalentPortraitChart,
  Empty,
  Loading,
  Button,
} from 'mm-ent-ui'
import { injectUnmount, trackEvent } from 'utils'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { DatePicker } from 'antd'
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import styles from './analysis.less'
import { parse } from 'querystring'
const XLSX = require('xlsx')

const { RangePicker } = DatePicker

@connect((state) => ({
  loading: false, // state.loading.effects,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
@injectUnmount
export default class CompanyAnalysis extends React.PureComponent {
  state = {
    dateRange: [],
    currentTabKey: 1,
    tendencyData: [],
    fansPortraitData: {},
  }

  componentDidMount() {
    this.fetchTendencyData()
    this.fetchFansPortraitData()
    trackEvent('bprofile_company_manage_analysis_enter')
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentUser !== this.props.currentUser) {
      this.fetchTendencyData()
      this.fetchFansPortraitData()
    }
  }

  getTabsConfig = () => {
    return [
      {
        title: '粉丝数',
        key: 1,
        render: this.renderChart,
      },
      {
        title: '新增粉丝数',
        key: 2,
        render: this.renderChart,
      },
      {
        title: '动态曝光量',
        key: 3,
        render: this.renderChart,
      },
      {
        title: '企业号访问量',
        key: 4,
        render: this.renderChart,
      },
    ]
  }

  fetchTendencyData = () => {
    const { currentTabKey } = this.state
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      this.props.currentUser
    )
    if (!webcid) {
      return
    }

    const { dateRange = [] } = this.state

    const param = {
      data_type: currentTabKey,
      webcid,
      period_type: 1, // 1：按天，2：按周，3：按月  目前还不支持筛选
    }

    if (dateRange) {
      Object.assign(param, {
        start_date: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
        end_date: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
      })
    }
    this.props
      .dispatch({
        type: 'company/fetchTendencyData',
        payload: param,
      })
      .then(({ data = [] }) => {
        this.setState({
          tendencyData: data,
        })
      })
  }

  fetchFansPortraitData = () => {
    const cid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'cid'],
      this.props.currentUser
    )
    if (!cid) {
      return
    }

    const param = { cid }
    this.props
      .dispatch({
        type: 'company/fetchCompanyFansPortrait',
        payload: param,
      })
      .then(({ data = {} }) => {
        this.setState({
          fansPortraitData: data,
        })
      })
  }

  handleTabChange = (config) => {
    this.setState(
      {
        currentTabKey: config.key,
      },
      this.fetchTendencyData
    )
  }

  handleDateRangeChange = (dateRange) =>
    this.setState({ dateRange }, this.fetchTendencyData)

  renderChart = () => {
    const { tendencyData = [] } = this.state
    if (this.props.loading['company/fetchTendencyData']) {
      return (
        <div className={styles.loading}>
          <Loading />
        </div>
      )
    }

    if (R.isEmpty(tendencyData)) {
      return (
        <div className={styles.empty}>
          <Empty
            image={`${this.props.urlPrefix}/images/empty_position.png`}
            description="暂无内容"
          />
        </div>
      )
    }
    const data = tendencyData.reduce((res, item) => {
      return [
        ...res,
        ...R.propOr([], 'value', item).map((d) => ({ ...d, type: item.type })),
      ]
    }, [])
    const scale = [
      {
        dataKey: 'label',
        min: 0,
      },
    ]

    return (
      <div className={styles.content}>
        <Chart forceFit height={350} data={data} scale={scale} width={962}>
          <Tooltip />
          <Axis />
          <Legend />
          <Line position="label*count" color="type" />
          <Point
            position="label*count"
            color="type"
            size={4}
            style={{ stroke: '#fff', lineWidth: 1 }}
            shape="circle"
          />
        </Chart>
      </div>
    )
  }

  renderTabContent = () => {
    const { currentTabKey } = this.state
    const tabsConfig = this.getTabsConfig()
    const config = tabsConfig.find(R.propEq('key', currentTabKey))
    if (!config) {
      return null
    }
    return config.render()
  }

  downLoad = () => {
    /* 需要导出的JSON数据 */
    const { tendencyData } = this.state
    const { type, value } = tendencyData[0] || {}
    const targetResult = []
    value.forEach((item) => {
      targetResult.push({
        date: item.label,
        total: item.count,
      })
    })

    /* 创建worksheet */
    var ws = XLSX.utils.json_to_sheet(targetResult)

    /* 新建空workbook，然后加入worksheet */
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, type)

    /* 生成xlsx文件 */
    XLSX.writeFile(wb, `${type}.xlsx`)
  }

  renderChartTabs = () => {
    const { currentTabKey } = this.state
    const tabsConfig = this.getTabsConfig()
    return (
      <div className={styles.chartWrap}>
        <div className={styles.filter}>
          <Tab
            tabs={tabsConfig}
            activeKeys={[currentTabKey]}
            onChange={this.handleTabChange}
            type="large"
          />
          <div>
            <RangePicker onChange={this.handleDateRangeChange} />
          </div>
          <div>
            <Button onClick={this.downLoad}>导出当前数据</Button>
          </div>
        </div>
        <div className={styles.content}>{this.renderTabContent()}</div>
      </div>
    )
  }

  renderFansChart = (field) => {
    const { fansPortraitData = {} } = this.state
    const data = fansPortraitData[field] || []
    const title = ANALYSIS_TITLE_MAP[field]
    return (
      <TalentPortraitChart
        data={data}
        title={title}
        key={field}
        className={styles.fansChart}
      />
    )
  }

  renderFans = () => {
    const showFields = [
      'current_companys_analysis',
      'ever_companys_analysis',
      'pfmj_analysis',
      'worktimes_analysis',
      'schools_analysis',
      'province_city_analysis',
    ]
    const { fansPortraitData = {} } = this.state
    if (this.props.loading['company/fetchCompanyFansPortrait']) {
      return (
        <div className={styles.loading}>
          <Loading />
        </div>
      )
    }
    if (R.isEmpty(fansPortraitData)) {
      return (
        <div className={styles.empty}>
          <Empty
            image={`${this.props.urlPrefix}/images/empty_position.png`}
            description="暂无内容"
          />
        </div>
      )
    }
    return (
      <div className={styles.fans}>
        <Text type="title" size={16}>
          粉丝画像
        </Text>
        <div className={styles.content}>
          {showFields.map(this.renderFansChart)}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        {this.renderChartTabs()}
        {this.renderFans()}
      </div>
    )
  }
}
