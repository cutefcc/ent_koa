import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { getLineColorByIndex } from 'utils/talentReport'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/lib/echarts'

// 文档：https://echarts.apache.org/examples/zh/editor.html?c=line-stack

export interface Props {
  dataList: Array<Object>
  titleList: Array<string>
  topFlag?: boolean
  topList?: Array<Object>
  unit?: string
}

export interface State {}

export default class LineStack extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getOption = () => {
    const { dataList, titleList, unit } = this.props
    if (!(dataList instanceof Array)) {
      return {}
    }

    const newTitleList = []
    titleList &&
      titleList.forEach(item => {
        newTitleList.push({
          value: `${item}${unit || ''}`,
          textStyle: {
            fontSize: 14,
            fontFamily: 'PingFangSC-Regular, PingFang SC',
            fontWeight: 400,
            color: '#6e727a',
          },
        })
      })

    const newDataList = []
    dataList &&
      dataList.forEach((item, index) => {
        newDataList.push({
          name: R.pathOr('', ['name'], item),
          type: 'line',
          // stack: '总量',
          symbol: 'circle',
          smooth: true,
          color: getLineColorByIndex(index),
          data: R.pathOr('', ['data'], item),
        })
      })

    return {
      cursor: 'default',
      xAxis: {
        type: 'category',
        data: newTitleList,
        axisTick: {
          show: false,
        },
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
      series: newDataList,
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
                    style={{ backgroundColor: getLineColorByIndex(index) }}
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
