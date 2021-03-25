import React from 'react'
import { connect } from 'react-redux'
import { Chart, Tooltip, Axis, Legend, Bar } from 'viser-react'
import * as R from 'ramda'
import DataSet from '@antv/data-set'

import styles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['statCompany/fetchRightScenes'],
}))
export default class AssignedModal extends React.PureComponent {
  state = {
    data: {},
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'statCompany/fetchRightScenes',
      })
      .then(({ data = {} }) => {
        this.setState({
          data,
        })
      })
  }

  renderChart = () => {
    const { data } = this.state
    const sourceData = [
      {
        name: '频道',
        总权益用量: R.pathOr(0, ['channel', 'num'], data),
        加好友权益用量: R.pathOr(0, ['channel', 'add_fr'], data),
        极速联系权益用量: R.pathOr(0, ['channel', 'uh'], data),
      },
      {
        name: '搜索',
        总权益用量: R.pathOr(0, ['search', 'num'], data),
        加好友权益用量: R.pathOr(0, ['search', 'add_fr'], data),
        极速联系权益用量: R.pathOr(0, ['search', 'uh'], data),
      },
      {
        name: '其他',
        总权益用量: R.pathOr(0, ['other', 'num'], data),
        加好友权益用量: R.pathOr(0, ['other', 'add_fr'], data),
        极速联系权益用量: R.pathOr(0, ['other', 'uh'], data),
      },
    ]

    const dv = new DataSet.View().source(sourceData)
    dv.transform({
      type: 'fold',
      fields: ['总权益用量', '加好友权益用量', '极速联系权益用量'],
      key: 'type',
      value: '数量',
    })

    return (
      <div>
        <Chart forceFit height={350} data={dv.rows} width={550}>
          <Tooltip />
          <Axis />
          <Legend />
          <Bar
            position="type*数量"
            color="name"
            adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]}
          />
        </Chart>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        <h5 className={styles.chartTitle}>不同「场景」下「权益使用数量」</h5>
        {this.renderChart()}
      </div>
    )
  }
}
