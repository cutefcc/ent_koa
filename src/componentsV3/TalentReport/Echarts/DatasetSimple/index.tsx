import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=dataset-simple0

export interface Props {
  sourceList: Array<Object>
  barList: Array<Object>
  dimensionsList: Array<Object>
  topFlag: boolean
}

export interface State {}

export default class DatasetSimple extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const { sourceList, barList, dimensionsList } = this.props
    if (!(barList instanceof Array)) {
      return {}
    }

    const newTitleList = []
    const newSourceList = []
    sourceList &&
      sourceList.forEach(item => {
        newTitleList.push({
          value: R.pathOr('', ['totalSiteMentions'], item),
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#6e727a',
            lineHeight: 28,
          },
        })
        newSourceList.push({
          ...item,

          label: {
            show: true,
            position: 'inside',
            formatter: function(value) {
              const temp = R.pathOr(
                0,
                ['data', R.pathOr('', ['seriesName'], value)],
                value
              )
              const seriesIndex = R.pathOr(0, ['seriesIndex'], value)
              if (temp === 0) {
                if (seriesIndex === 0) {
                  return `{a|暂无数据    }\n\n`
                }
                return `{a|    暂无数据}\n\n`
              }

              return temp
            },
            rich: {
              a: {
                color: '#15161f',
                fontSize: 10,
                fontWeight: 400,
                textBorderColor: '#15161f',
                textBorderWidth: 0.1,
              },
            },
          },
        })
      })

    return {
      cursor: 'default',
      dataset: {
        dimensions: dimensionsList,
        source: newSourceList,
      },
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
        show: false,
      },
      series: barList,
      barMaxWidth: '25%',
    }
  }

  render() {
    const { topFlag, barList } = this.props

    return (
      <div className={styles.main}>
        {topFlag && (
          <div className={styles.topContentStyle}>
            {barList &&
              barList.map((item, index) => (
                <div key={index} className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: R.pathOr('', ['color'], item) }}
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
        />
      </div>
    )
  }
}
