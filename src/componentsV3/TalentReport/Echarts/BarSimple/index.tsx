import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-simple

export interface Props {
  dataList: Array<number>
  titleList: Array<string>
  colorList?: Array<string>
  color?: string
  unit?: string
}

export interface State {}

export default class BarSimple extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const { dataList, titleList, color, unit, colorList } = this.props
    if (!(dataList instanceof Array)) {
      return {}
    }

    const newTitleList = []
    titleList &&
      titleList.forEach(item => {
        newTitleList.push({
          value: item,
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#6e727a',
            lineHeight: 28,
          },
        })
      })

    const newDataList = []
    dataList &&
      dataList.forEach((item, index) => {
        if (!isNaN(item)) {
          newDataList.push({
            value: item,
            label: {
              show: true,
              position: 'inside',
              formatter: params => {
                return `${params.value}${unit || ''}`
              },
            },
            itemStyle: {
              normal: {
                color: R.pathOr(color, [index], colorList),
              },
              emphasis: {
                color: R.pathOr(color, [index], colorList),
              },
            },
          })
        } else {
          newDataList.push({
            value: 0,
            label: {
              show: true,
              position: 'outside',
              formatter: '暂无数据',
              fontSize: '12',
            },
            itemStyle: {
              normal: {
                color: R.pathOr(color, [index], colorList),
              },
              emphasis: {
                color: R.pathOr(color, [index], colorList),
              },
            },
          })
        }
      })

    return {
      cursor: 'default',
      xAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: newTitleList,
        axisLine: {
          lineStyle: {
            color: '#D1D3DE',
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          data: newDataList,
          color,
          type: 'bar',
          barMinHeight: 1,
          barWidth: 45,
        },
      ],
      // barMaxWidth: '25%',
    }
  }

  render() {
    return (
      <div className={styles.main}>
        <ReactEchartsCore
          echarts={echarts}
          style={{ width: '100%', height: 300 }}
          option={this.getOption()}
          notMerge={false}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    )
  }
}
