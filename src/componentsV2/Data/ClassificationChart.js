import React from 'react'
import { Table, message } from 'antd'
import { Text, Tab, Icon } from 'mm-ent-ui'
// import {dateFormat} from 'utils/date'
import { connect } from 'react-redux'
import { Chart, SmoothLine, Tooltip, Axis } from 'viser-react'
// import {Chart, SmoothLine, Tooltip, Axis, Bar, Coord, Legend} from 'viser-react'
// import {fixed} from 'utils/numbers'
import DataSet from '@antv/data-set'
import * as R from 'ramda'
import { columns, columnsV3, dataTypeMap } from './constant'

import styles from './classificationChart.less'

@connect((state) => ({
  loading: state.loading.effects['statCompany/fetchDetail2'],
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class ClassificationChart extends React.PureComponent {
  state = {
    activeKeys: [1],
    // 榜单
    rankList: [],
    // 六种数据类型 1-6 对应 沟通过-在招职位
    dataType: 1,
    chartData: [],
  }

  componentDidMount() {
    this.getInitData()
    const title = this.getReachTitle()
    // try to modify const data dynamically
    dataTypeMap[2] = title
    columns[6].title = title
  }

  componentWillReceiveProps(newProps) {
    if (
      (!this.props.startDate || !this.props.endDate) &&
      newProps.startDate &&
      newProps.startDate
    ) {
      this.getLicenseRank(newProps.startDate, newProps.endDate)
      this.getCompanyDaily(newProps.startDate, newProps.endDate)
    }
    if (
      this.props.startDate &&
      this.props.endDate &&
      newProps.startDate &&
      newProps.endDate &&
      (this.props.startDate !== newProps.startDate ||
        this.props.endDate !== newProps.endDate)
    ) {
      this.getLicenseRank(newProps.startDate, newProps.endDate)
      this.getCompanyDaily(newProps.startDate, newProps.endDate)
    }
  }

  getReachTitle = () => {
    const {
      currentUser: { reach },
    } = this.props

    if (reach) {
      if (reach.reach_type === 2) {
        return '索要电话'
      } else if (reach.reach_type === 3) {
        return '电话沟通'
      }
    }

    return ''
  }

  getTabsConfig = () => {
    const { totalData = {} } = this.props
    const title = this.getReachTitle()

    return [
      {
        title: (
          <Text type="title" size={28} key="has_contact_total">
            {totalData.has_contact_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·沟通过</span>
          </Text>
        ),
        key: 1,
      },
      {
        title: (
          <Text type="title" size={28} key="addfr_total">
            {totalData.addfr_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·加好友</span>
          </Text>
        ),
        key: 2,
      },
      {
        title: (
          <Text type="title" size={28} key="reach_total">
            {totalData.reach_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·{title}</span>
          </Text>
        ),
        key: 3,
      },
      {
        title: (
          <Text type="title" size={28} key="has_intention_total">
            {totalData.has_intention_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·有意向</span>
          </Text>
        ),
        key: 4,
      },
      {
        title: (
          <Text type="title" size={28} key="resume_total">
            {totalData.resume_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·简历数</span>
          </Text>
        ),
        key: 5,
      },
      {
        title: (
          <Text type="title" size={28} key="jobs_total">
            {totalData.jobs_total || 0}
            <span style={{ fontSize: '16px', color: '#666' }}>·在招职位</span>
          </Text>
        ),
        key: 6,
      },
    ]
  }

  getInitData = () => {
    const { startDate, endDate } = this.props
    this.getLicenseRank(startDate, endDate)
    this.getCompanyDaily(startDate, endDate)
  }

  getLicenseRank = (startDate, endDate) => {
    const { dataType } = this.state
    if (startDate && endDate) {
      this.props
        .dispatch({
          type: 'statCompany/fetchLicenseRank',
          payload: {
            start: startDate,
            end: endDate,
            data_type: dataType,
          },
        })
        .then(({ data = {} }) => {
          const { list = [] } = data
          this.setState({
            rankList: list,
          })
        })
    }
  }

  getCompanyDaily = (startDate, endDate) => {
    const { dataType } = this.state
    if (startDate && endDate) {
      this.props
        .dispatch({
          type: 'statCompany/fetchCompanyDaily',
          payload: {
            start: startDate,
            end: endDate,
            data_type: dataType,
          },
        })
        .then(({ data = {} }) => {
          const { list: sourceData = [] } = data
          sourceData.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item['总数'] = item.total
            // eslint-disable-next-line no-param-reassign
            item['新增'] = item.new_cnt
            // eslint-disable-next-line no-param-reassign
            item.date =
              startDate.substr(0, 4) === endDate.substr(0, 4) &&
              item.date.length > 5
                ? item.date.substr(5, item.date.length - 1)
                : item.date
          })
          const dv = new DataSet.View().source(sourceData)
          dv.transform({
            type: 'fold',
            fields: ['总数', '新增'],
            key: 'city',
            value: 'temperature',
          })
          const chartData = dv.rows
          const scale = [
            {
              dataKey: 'percent',
              min: 0,
              formatter: '.2%',
            },
          ]
          this.setState({
            scale,
            chartData,
          })
        })
    }
  }

  handleTabChange = (config) => {
    const { startDate, endDate } = this.props
    this.setState(
      {
        activeKeys: [config.key],
        dataType: config.key,
      },
      () => {
        this.getLicenseRank(startDate, endDate)
        this.getCompanyDaily(startDate, endDate)
      }
    )
  }

  handleExportExcel = () => {
    if (
      !('download' in document.createElement('a')) ||
      window.navigator.userAgent.indexOf('Chrome') === -1
    ) {
      message.error('请使用Chrome浏览器下载')
      return false
    }
    const {
      currentUser: { isV3 },
    } = this.props
    const columnsData = isV3 ? columnsV3 : columns

    this.props.handleExportExcel(columnsData)
    return ''
  }

  renderRankItem = (item, index) => {
    const rankImg = [
      `url(${this.props.urlPrefix}/images/gold_medal.png)`,
      `url(${this.props.urlPrefix}/images/silver_medal.png)`,
      `url(${this.props.urlPrefix}/images/bronze_medal.png)`,
    ]
    const { dataType } = this.state
    return (
      <div
        className={`${styles.classificationChartContentRightItemCon} flex`}
        key={item.id}
      >
        <div className={`${styles.left} flex`}>
          <div
            className={styles.avator}
            style={{
              backgroundImage: `url(${item.avatar})`,
              backgroundSize: 'cover',
              position: 'relative',
            }}
          >
            {[0, 1, 2].includes(index) && (
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  position: 'absolute',
                  right: '-5px',
                  bottom: '-3px',
                  zIndez: 10000,
                  borderRadius: '8px',
                  backgroundImage: rankImg[index],
                  backgroundSize: 'cover',
                }}
              />
            )}
          </div>
          <Text
            type="text_primary"
            size={14}
            style={{ height: '32px', lineHeight: '32px', marginLeft: '16px' }}
          >
            {item.name}
          </Text>
        </div>
        <div className={styles.right}>
          <Text type="text_primary" size={14} style={{ color: '#999EAA' }}>
            {item.count}
            {dataType === 6 ? '个' : '人'}
          </Text>
        </div>
      </div>
    )
  }

  render() {
    const {
      startDate,
      endDate,
      currentUser: { isV3 },
    } = this.props

    const label = {
      offset: 20,
      rotate: 0,
      autoHide: true,
      autoEllipsis: true,
      autoRotate: false,
    }

    return (
      <div className={styles.classificationChart}>
        <div className={styles.classificationChartHeader}>
          <Tab
            tabs={this.getTabsConfig()}
            activeKeys={this.state.activeKeys}
            onChange={this.handleTabChange}
            type="large"
          />
        </div>
        <div className={styles.classificationChartContent}>
          <div className={styles.classificationChartContentLeft}>
            <Text
              type="title"
              size={14}
              style={{ padding: '24px 24px 24px 48px' }}
            >
              {`${startDate} ~ ${endDate}`}{' '}
              {dataTypeMap[this.state.activeKeys[0] - 1]} - 数据趋势
            </Text>
            {this.state.chartData && this.state.scale && (
              <Chart
                forceFit
                width={930}
                height={310}
                data={this.state.chartData}
                scale={this.state.scale}
              >
                <SmoothLine position="date*temperature" color="city" size="2" />
                <Tooltip />
                {/* <Legend /> */}
                <Axis dataKey="date" label={label} />
              </Chart>
            )}
          </div>
          <div className={styles.classificationChartContentRight}>
            <Text type="title" size={14} style={{ paddingLeft: '40px' }}>
              {dataTypeMap[this.state.activeKeys[0] - 1]} - 榜单
            </Text>
            {this.state.rankList.length !== 0 &&
              this.state.rankList.map(this.renderRankItem)}
            {this.state.rankList.length === 0 && (
              <div className={styles.blankRank}>无榜单排名</div>
            )}
          </div>
        </div>
        <div className={styles.classificationChartBottom}>
          <div className={`${styles.classificationChartBottomHeader} flex`}>
            <Text type="title" size={16}>
              子账号使用情况
            </Text>
            {!R.isEmpty(this.props.tableData) && (
              <div onClick={this.handleExportExcel}>
                <Text
                  type="text_primary"
                  size={13}
                  style={{ color: '#0052FF', cursor: 'pointer' }}
                >
                  <Icon type="download" className={styles.downloadIcon} />
                  <span style={{ marginLeft: '6px' }}>使用明细下载</span>
                </Text>
              </div>
            )}
          </div>
          <Table
            columns={isV3 ? columnsV3 : columns}
            dataSource={this.props.tableData}
            // scroll={{x: 1300}}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
