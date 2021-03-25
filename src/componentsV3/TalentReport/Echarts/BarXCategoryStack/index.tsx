import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { getBarColorByIndex } from 'utils/talentReport'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 修改基于文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack

let chartDom = null

export interface Props {
  dataList: Array<Object>
  titleList: Array<string>
  topFlag?: boolean
  topList?: Array<Object>
  maxY?: number
}

export interface State {}

export default class BarXCategoryStack extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  onChartReadyCallback = chart => {}

  getOption = () => {
    const { dataList, titleList, maxY } = this.props
    if (!(dataList instanceof Array) || !(titleList instanceof Array)) {
      return {}
    }

    const series = []
    for (let i = 0; i < dataList.length; i++) {
      series.push({
        name: titleList[i],
        type: 'bar',
        stack: '总量',
        barMinHeight: 1,
        color: getBarColorByIndex(i),
        label: {
          show: true,
          position: 'inside',
          // color: '#fff',
          formatter: function(value) {
            const name = R.pathOr(0, ['name'], value)
            const seriesIndex = R.pathOr(0, ['seriesIndex'], value)
            if (name === '暂无数据') {
              if (seriesIndex === 0) {
                return `{a|暂无数据\n\n}`
              } else {
                return ``
              }
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
        data: dataList[i],
      })
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

    return {
      cursor: 'default',
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let str = ''
          if (params.length > 0) {
            str += R.pathOr('', [0, 'axisValue'], params)
          }
          for (let i = 0; i < params.length; i++) {
            str += '<br />'
            str += `${R.pathOr('', [i, 'data', 'title'], params)}：${R.pathOr(
              '',
              [i, 'data', 'name'],
              params
            )}`
          }
          return str
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      barMaxWidth: '40%',
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
        max: maxY || 1,
      },
      series,
    }
  }

  render() {
    const { topFlag, topList } = this.props
    return (
      <div className={styles.main}>
        {topFlag && (
          <div className={styles.topContentStyle}>
            {topList &&
              topList.map((item, index) => (
                <div key={index} className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: getBarColorByIndex(index) }}
                  />
                  <div className={styles.showIconWord}>
                    {R.pathOr('', ['name'], item)}
                  </div>
                </div>
              ))}
          </div>
        )}
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
