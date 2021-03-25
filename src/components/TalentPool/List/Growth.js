import React from 'react'
import { connect } from 'react-redux'
import { strToStr, dateFormat } from 'utils/date'
import { LoadingOutlined } from '@ant-design/icons'
// import * as R from 'ramda'

// import {Chart, Geom, Axis, Tooltip, Legend, Coord} from 'bizcharts'

import { Chart, Tooltip, Axis, Line, Point } from 'viser-react'
import commonStyles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchAmountTrend'],
}))
export default class Growth extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  getFormatData = () => {
    const { data } = this.state
    return data.map((item) => ({
      ...item,
      date: strToStr(item.date, dateFormat, 'M.D'),
    }))
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchAmountTrend',
      })
      .then(({ data = [] }) => {
        this.setState({
          data: data.reverse(),
        })
      })
  }

  render() {
    const data = this.getFormatData()

    const scale = [
      {
        dataKey: 'total',
        min: 0,
      },
    ]

    return (
      <div>
        <h5 key="title" className={`${commonStyles.title} filterTitle`}>
          增长走势
          {this.props.loading && <LoadingOutlined />}
        </h5>
        <div
          style={{ width: '335px', marginLeft: '-80px', marginBottom: '-70px' }}
        >
          <Chart forceFit height={250} data={data} scale={scale}>
            <Tooltip />
            <Axis line={{ display: 'none' }} show={false} dataKey="total" />
            <Line position="date*total" />
            <Point position="date*total" shape="circle" />
          </Chart>
        </div>
      </div>
    )
  }
}
