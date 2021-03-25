import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react'
import DataSet from '@antv/data-set'
import { strToStr, dateFormat } from 'utils/date'

import styles from './used.less'
import commonStyles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['statCompany/fetchUsed'],
}))
export default class AssignedModal extends React.PureComponent {
  state = {
    data: {},
  }

  componentDidMount() {
    this.fetchData()
  }

  getDateRange = (start, end) => {
    return `${strToStr(start, dateFormat, 'M.D')}~${strToStr(
      end,
      dateFormat,
      'M.D'
    )}`
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'statCompany/fetchUsed',
      })
      .then(({ data }) => {
        this.setState({
          data,
        })
      })
  }

  renderOverviewItem = (data) => {
    return (
      <div className={styles.item} key={data.field}>
        <h5 className={styles.title}>
          {data.field} <span className={commonStyles.minimize}>消耗</span>
        </h5>
        <div className={styles.field}>
          <span className={commonStyles.stress}>
            {this.props.loading ? <LoadingOutlined /> : data.value}
          </span>
          <span className={commonStyles.minimize}>点</span>
        </div>
      </div>
    )
  }

  renderOverview = () => {
    const data = R.pathOr({}, ['data', 'used_all'], this.state)
    const showFields = [
      {
        field: '总',
        value: R.propOr(0, 'total', data),
      },
      {
        field: '加好友',
        value: R.propOr(0, 'add_fr', data),
      },
      {
        field: '极速联系',
        value: R.propOr(0, 'uh', data),
      },
      {
        field: '其他',
        value: R.propOr(0, 'other', data),
      },
    ]
    return showFields.map(this.renderOverviewItem)
  }

  renderChart = () => {
    const data = R.pathOr([], ['data', 'used_weekly_data'], this.state)
    const sourceData = data.map((item) => ({
      总消耗点数: R.pathOr(0, ['data', 'total'], item),
      加好友消耗点数: R.pathOr(0, ['data', 'add_fr'], item),
      极速联系消耗点数: R.pathOr(0, ['data', 'uh'], item),
      其他权益消耗点数: R.pathOr(0, ['data', 'other'], item),
      date: this.getDateRange(item.start_date, item.end_date),
    }))

    const dv = new DataSet.View().source(sourceData)
    dv.transform({
      type: 'fold',
      fields: [
        '总消耗点数',
        '加好友消耗点数',
        '极速联系消耗点数',
        '其他权益消耗点数',
      ],
      key: 'type',
      value: 'used',
    })

    const scale = [
      {
        dataKey: 'date',
        min: 0,
        max: 1,
      },
    ]

    return (
      <div className={styles.content}>
        <Chart forceFit height={300} data={dv.rows} scale={scale} width={550}>
          <Tooltip />
          <Axis />
          <Legend />
          <Line position="date*used" color="type" />
          <Point
            position="date*used"
            color="type"
            size={4}
            style={{ stroke: '#fff', lineWidth: 1 }}
            shape="circle"
          />
        </Chart>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.overview}>{this.renderOverview()}</div>
        <div className={styles.chart}>{this.renderChart()}</div>
      </div>
    )
  }
}
