import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import * as styles from './index.less'
import {
  getHorizontalColorByIndex,
  defaultTalentReportBackgroundColor,
  defaultMinBarOutNum,
} from 'utils/talentReport'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 修改基于文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-y-category-stack

export interface Props {
  urlPrefix?: string
  data: {
    series: Array<{ key; data }>
    title: Array<String>
    barList?: Array<String>
  }
  color: string
  topFlag?: boolean
  inout?: string
}

export interface State {}

@connect(state => ({
  urlPrefix: state.global.urlPrefix,
}))
export default class BarXCategoryInverseStack extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const { data, inout, urlPrefix } = this.props
    const series = []

    const newTitleList = []
    data.title &&
      data.title.forEach(item => {
        newTitleList.push({
          value: `${item}`,
          textStyle: {
            fontSize: '14',
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#6e727a',
          },
        })
      })

    const seriesEnd = data.series.length - 1
    data.series.forEach((item, index) => {
      const { key, data } = item
      series.push({
        name: key,
        type: 'bar',
        stack: '总量',
        barMinHeight: 1,
        barWidth: 35,
        color:
          index === seriesEnd
            ? defaultTalentReportBackgroundColor
            : getHorizontalColorByIndex(index),
        label: {
          show: true,
          position: 'inside',
          formatter: function(value) {
            const name = R.pathOr(0, ['name'], value)
            const temp = R.pathOr(0, ['value'], value)
            const isMin = R.pathOr(0, ['data', 'isMin'], value)
            const seriesIndex = R.pathOr(0, ['seriesIndex'], value)
            if (name === '暂无数据') {
              if (seriesIndex === 0) {
                return `{a|\n\n\n\n\n暂\n无\n数\n据}`
              } else {
                return ``
              }
            } else if (index === seriesEnd || name === '') {
              return `` // ${temp}%
            }
            return `${name}${
              isMin ? (temp - defaultMinBarOutNum).toFixed(1) : temp
            }%`
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
      })
    })

    return {
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          let temp = R.pathOr('', [0, 'axisValue'], params)
          let str = ''
          if (params.length > 0) {
            str += temp
          }
          for (let i = 0; i < params.length; i++) {
            if (R.pathOr('', [i, 'data', 'name'], params) === '') {
              continue
            }
            str += '<br />'
            const isMin = R.pathOr('', [i, 'data', 'isMin'], params)
            const tempValue = R.pathOr('', [i, 'data', 'value'], params)
            const name =
              R.pathOr('', [i, 'data', 'name'], params) === '暂无数据'
                ? '暂无数据'
                : `${
                    isMin
                      ? (tempValue - defaultMinBarOutNum).toFixed(1)
                      : tempValue
                  }%`
            str += `${R.pathOr('', [i, 'data', 'name'], params)}：${name}`
          }
          return str
        },
        axisPointer: {
          type: 'shadow',
        },
      },
      cursor: 'default',
      yAxis: {
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
        inverse: true,
      },
      xAxis: {
        type: 'category',
        position: 'top',
        axisTick: {
          show: false,
        },
        data: newTitleList,
        axisLabel: {
          interval: 0,
          formatter: function(value) {
            return value + '\n\n{imageValue|}'
          },
          rich: {
            imageValue: {
              height: 20,
              width: 20,
              align: 'center',
              backgroundColor: {
                image:
                  inout === 'in'
                    ? `${urlPrefix}/images/icon_top.png`
                    : `${urlPrefix}/images/icon_bottom.png`,
              },
            },
          },
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#D1D3DE',
          },
        },
      },
      series,
    }
  }

  render() {
    const {
      topFlag,
      data: { barList },
    } = this.props
    return (
      <div className={styles.main}>
        {topFlag && (
          <div className={styles.topContentStyle}>
            {barList &&
              barList.map((item, index) => (
                <div key={index} className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{
                      backgroundColor: getHorizontalColorByIndex(index),
                    }}
                  />
                  <div className={styles.showIconWord}>{item}</div>
                </div>
              ))}
          </div>
        )}

        <ReactEchartsCore
          echarts={echarts}
          style={{
            width: '100%',
            height: 480,
          }}
          option={this.getOption()}
          notMerge={false}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    )
  }
}
