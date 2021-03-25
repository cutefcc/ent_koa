import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-negative

export interface Props {
  topList: Array<Object>
  bottomList: Array<Object>
  titleList: Array<string>
  topColor: string
  bottomColor: string
  topName?: string
  bottomName?: string
}

export interface State {}

export default class BarNegative extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const {
      topList,
      bottomList,
      titleList,
      topName,
      bottomName,
      topColor,
      bottomColor,
    } = this.props
    if (!(titleList instanceof Array)) {
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
            lineHeight: 50,
          },
        })
      })

    return {
      cursor: 'default',
      barMaxWidth: '30%',
      xAxis: [
        {
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
      ],
      yAxis: [
        {
          type: 'value',
          show: false,
        },
      ],
      series: [
        {
          name: topName,
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'top',
            color: '#6E727A',
            fontSize: 12,
            fontWeight: 400,
            formatter: function(value) {
              const name = R.pathOr(0, ['name'], value)
              if (name === '暂无数据') {
                return `{a|暂无数据}`
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
          color: topColor,
          data: topList,
        },
        {
          name: bottomName,
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'bottom',
            color: '#6E727A',
            fontSize: 12,
            fontWeight: 400,
            formatter: function(value) {
              const name = R.pathOr(0, ['name'], value)
              if (name === '暂无数据') {
                return `{a|暂无数据}`
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
          color: bottomColor,
          data: bottomList,
        },
      ],
    }
  }

  render() {
    const { topName, bottomName, topColor, bottomColor } = this.props
    return (
      <div className={styles.main}>
        {topName && bottomName && (
          <div className={styles.topContentStyle}>
            <div className={styles.showIconContent}>
              <div
                className={styles.showIconColor}
                style={{ backgroundColor: topColor }}
              />
              <div className={styles.showIconWord}>{topName}</div>
            </div>
            <div className={styles.showIconContent}>
              <div
                className={styles.showIconColor}
                style={{ backgroundColor: bottomColor }}
              />
              <div className={styles.showIconWord}>{bottomName}</div>
            </div>
          </div>
        )}
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
