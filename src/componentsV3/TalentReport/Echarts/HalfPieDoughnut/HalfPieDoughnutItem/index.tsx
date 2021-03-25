import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import {
  getPieColorByIndex,
  defaultTalentReportColor,
} from 'utils/talentReport'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=pie-doughnut

let chartDom = null

export interface Props {
  dataList: Array<Object>
  title: string
  dataIndex?: number
}

export interface State {}

export default class HalfPieDoughnutItem extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
    this.charts = null
  }

  onChartReadyCallback = chart => {
    const { dataIndex } = this.props
    if (dataIndex === undefined || !chart) {
      return
    }
    this.charts = chart
    setTimeout(() => {
      const { dataList, title } = this.props
      dataList.forEach((item, index) => {
        if (index !== dataIndex) {
          chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index,
          })
        } else {
          chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: dataIndex,
          })
        }
      })
    }, 200)
  }

  getOption = () => {
    const { dataList, title } = this.props
    const newDataList = []
    let sum = 0

    // 循环数据 累计sum值
    dataList.map((item, index) => {
      if (dataList.length === 1) {
        newDataList.push({
          ...item,
          itemStyle: {
            normal: {
              color: defaultTalentReportColor,
            },
            emphasis: {
              color: defaultTalentReportColor,
            },
          },
        })
      } else {
        newDataList.push({
          ...item,
          itemStyle: {
            normal: {
              color: getPieColorByIndex(index),
            },
          },
        })
      }

      sum += R.pathOr(0, ['value'], item) * 1
    })

    // 给数据加上总数sum 通过颜色及透明度设置不显示
    newDataList.push({
      name: ' ',
      value: sum,
      itemStyle: { normal: { color: 'rgba(0, 0, 0, 0)' } },
      tooltip: {
        show: false,
      },
      cursor: 'default',
    })

    return {
      tooltip: {
        trigger: 'item',
        formatter: params => {
          return dataList.length === 1
            ? `${R.pathOr('', ['data', 'title'], params)}`
            : `${R.pathOr('', ['data', 'title'], params)}：${params.name}`
        },
      },
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '39%',
          style: {
            text: dataList.length === 1 ? '暂无数据' : '',
            fill: '#15161f',
            fontSize: 12,
            fontFamily: 'PingFangSC-Medium, PingFang SC',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: title,
            textAlign: 'center',
            fill: '#6e727a',
            fontSize: 14,
            fontFamily: 'PingFangSC-Medium, PingFang SC',
          },
        },
      ],
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          hoverOffset: 10,
          startAngle: 180,
          label: {
            show: true,
            position: 'inside',
            formatter: function(value) {
              const name = R.pathOr(0, ['name'], value)
              if (name === '暂无数据') {
                return `{a|}`
              }
              return name
            },
            rich: {
              a: {
                color: '#15161f',
                fontSize: 12,
                fontWeight: 400,
                textBorderColor: '#15161f',
                textBorderWidth: 0.1,
              },
            },
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '30',
          //     fontWeight: 'bold',
          //   },
          // },
          labelLine: {
            show: true,
          },
          data: newDataList,
        },
      ],
    }
  }

  render() {
    this.onChartReadyCallback(this.charts)

    return (
      <div className={styles.halfPieDoughnutItemMain}>
        <ReactEchartsCore
          echarts={echarts}
          style={{ width: '100%', height: 300 }}
          option={this.getOption()}
          notMerge={false}
          lazyUpdate={true}
          theme={'theme_name'}
          onChartReady={this.onChartReadyCallback}
        />
      </div>
    )
  }
}
