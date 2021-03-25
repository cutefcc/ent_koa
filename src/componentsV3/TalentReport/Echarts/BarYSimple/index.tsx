import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=bar-simple

export interface Props {
  dataList: Array<Object>
  titleList: Array<string>
  color: string
}

export interface State {}

export default class BarYSimple extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const { dataList, titleList, color } = this.props
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
          },
        })
      })

    // 计算数据最大值，以将折线与柱状图分开距离
    let maxNum = 0
    for (let i = 0; i < dataList.length; i++) {
      const sum = R.pathOr(0, [i, 'value'], dataList)
      if (maxNum < sum) {
        maxNum = sum
      }
    }

    return {
      cursor: 'default',
      xAxis: {
        type: 'value',
        show: false,
        max: maxNum + maxNum / 10,
      },
      yAxis: {
        type: 'category',
        axisTick: {
          show: false,
        },
        inverse: true,
        interval: 20,
        data: newTitleList,
        axisLine: {
          lineStyle: {
            color: '#D1D3DE',
          },
        },
      },
      series: [
        {
          data: dataList,
          color,
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            formatter: function(value) {
              return [
                `{a|${R.pathOr('0', ['name', 0], value)}}`,
                `{b|${R.pathOr('0', ['name', 1], value)}}`,
              ].join('')
            },
            rich: {
              a: {
                color: '#333',
                fontSize: 14,
                fontWeight: 400,
              },
              b: {
                color: '#6e727a',
                fontSize: 12,
                fontWeight: 400,
              },
            },
          },
          barWidth: 35,
        },
      ],
      // barMaxWidth: '80%',
    }
  }

  render() {
    const { titleList } = this.props
    return (
      <div className={styles.main}>
        <ReactEchartsCore
          echarts={echarts}
          style={{ width: '100%', height: (titleList.length + 1) * 66 }}
          option={this.getOption()}
          notMerge={false}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    )
  }
}
