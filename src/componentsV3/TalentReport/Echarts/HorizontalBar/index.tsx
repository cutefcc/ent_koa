import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { getBarColorByIndex, getCompanyNameByKey } from 'utils/talentReport'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 修改基于文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack

let chartDom = null

export interface Props {
  data: {
    series: Array<Object>
    legend: Array<String>
    title: Array<String>
  }
  color: string
}

export interface State {}

export default class HorizontalBar extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  onChartReadyCallback = chart => {}

  getOption = () => {
    const { data } = this.props
    let opacity = 1
    const series = []

    const newTitleList = []
    data.title &&
      data.title.forEach(item => {
        newTitleList.push({
          value: `${item}  `,
          textStyle: {
            fontSize: '14',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#6e727a',
          },
        })
      })

    data.series.forEach(item => {
      const { key, data } = item
      opacity -= 0.15
      series.push({
        name: key,
        type: 'bar',
        stack: '总量',
        barMinHeight: 1,
        barWidth: 35,
        label: {
          show: true,
          position: 'inside',
          // formatter: params => `${params.value}%`,
          formatter: function(value) {
            const name = R.pathOr(0, ['name'], value)
            const temp = R.pathOr(0, ['value'], value)
            const seriesIndex = R.pathOr(0, ['seriesIndex'], value)
            if (name === '暂无数据') {
              if (seriesIndex === 0) {
                return `{a|               暂无数据}`
              } else {
                return ``
              }
            }
            return `${temp}%`
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
        data,
        itemStyle: {
          color: `rgba(0, 76, 255, ${opacity})`,
        },
      })
    })

    return {
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let str = ''
          if (params.length > 0) {
            str += R.pathOr('', [0, 'axisValue'], params)
          }
          for (let i = 0; i < params.length; i++) {
            str += '<br />'
            const name =
              R.pathOr('', [i, 'data', 'name'], params) === '暂无数据'
                ? '暂无数据'
                : `${R.pathOr('', [i, 'data'], params)}%`
            str += `${R.pathOr('', [i, 'seriesName'], params)}：${name}`
          }
          return str
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      cursor: 'default',
      legend: {
        data: data.legend,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        selectedMode: false,
      },
      // grid: {
      //   // left: '3%',
      //   // right: '4%',
      //   // bottom: '3%',
      //   // containLabel: true
      // },
      xAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: false,
        show: false,
        max: 100,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        inverse: true,
        splitLine: true,
        type: 'category',
        data: newTitleList,
      },
      series,
    }
  }

  render() {
    const { data } = this.props
    return (
      <ReactEchartsCore
        echarts={echarts}
        style={{
          width: '100%',
          height: R.pathOr(6, ['title', 'length'], data) * 67,
        }}
        option={this.getOption()}
        notMerge={false}
        lazyUpdate={true}
        theme={'theme_name'}
        onChartReady={this.onChartReadyCallback}
      />
    )
  }
}
