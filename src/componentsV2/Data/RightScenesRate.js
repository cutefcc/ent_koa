import React from 'react'
import { connect } from 'react-redux'
import { Chart, Tooltip, Axis, Bar, Coord, Legend } from 'viser-react'
import { fixed } from 'utils/numbers'
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

  getFormatData = () => {
    const { data } = this.state
    const fixedNumber = (v) => fixed(parseFloat(v) * 100, 1)
    const evolve = {
      uh_reply_rate: fixedNumber,
      add_fr_agree_rate: fixedNumber,
    }
    return R.mapObjIndexed(R.evolve(evolve), data)
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
    // const {data} = this.state
    const data = this.getFormatData()
    const sourceData = [
      {
        name: '极速联系回复率',
        频道: R.pathOr(0, ['channel', 'uh_reply_rate'], data),
        搜索: R.pathOr(0, ['search', 'uh_reply_rate'], data),
        其他: R.pathOr(0, ['other', 'uh_reply_rate'], data),
      },
      {
        name: '加好友通过率',
        频道: R.pathOr(0, ['channel', 'add_fr_agree_rate'], data),
        搜索: R.pathOr(0, ['search', 'add_fr_agree_rate'], data),
        其他: R.pathOr(0, ['other', 'add_fr_agree_rate'], data),
      },
    ]

    const dv = new DataSet.View().source(sourceData)
    dv.transform({
      type: 'fold',
      fields: ['频道', '搜索', '其他'],
      key: 'type',
      value: 'value',
    })

    return (
      <div>
        <Chart forceFit height={350} data={dv.rows} width={550}>
          <Coord type="rect" direction="LT" />
          <Tooltip
            itemTpl={`<li data-index={index}>
              <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
              {name}: {value}%
            </li>`}
          />
          <Legend />
          <Axis dataKey="value" position="right" />
          <Axis dataKey="type" label={{ offset: 12 }} />
          <Bar
            position="type*value"
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
        <h5 className={styles.chartTitle}>不同「场景」下「极速联系回复率」</h5>
        {this.renderChart()}
      </div>
    )
  }
}
