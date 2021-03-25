import * as React from 'react'
import * as R from 'ramda'
import { Radio, Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import * as styles from './index.less'
// echarts
import ReactEchartsCore from 'echarts-for-react/lib/core'
import 'echarts-wordcloud'
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'

// 文档：https://github.com/ecomfe/echarts-wordcloud

export interface Props {
  dataList: Array<Object>
  bottomFlag?: boolean
  selectBottom?: string
  bottomList?: Array<Object>
  handleWordCloudSelect?: Function
}

export interface State {}

export default class WordCloud extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  handleRadioChange = e => {
    const { handleWordCloudSelect } = this.props
    if (handleWordCloudSelect instanceof Function) {
      handleWordCloudSelect(R.pathOr('', ['target', 'value'], e))
    }
  }

  getOption = () => {
    const { dataList } = this.props
    return {
      backgroundColor: '#fff',
      series: [
        {
          type: 'wordCloud',
          shape: 'circle',
          gridSize: 12,
          drawOutOfBound: false,
          sizeRange: [12, 48],
          rotationRange: [0, 0],
          textStyle: {
            normal: {
              color: function() {
                return (
                  'rgb(' +
                  Math.round(Math.random() * 255) +
                  ', ' +
                  Math.round(Math.random() * 255) +
                  ', ' +
                  Math.round(Math.random() * 255) +
                  ')'
                )
              },
            },
          },
          left: 'center',
          top: null,
          right: null,
          bottom: 0,
          width: '100%',
          height: '100%',
          data: dataList,
        },
      ],
    }
  }

  render() {
    const { bottomFlag, selectBottom, bottomList } = this.props
    return (
      <div className={styles.main}>
        <div className={styles.hiddenPointerStyle} />
        <ReactEchartsCore
          echarts={echarts}
          style={{ width: '100%', height: 300 }}
          option={this.getOption()}
          notMerge={false}
          lazyUpdate={true}
          theme={'theme_name'}
        />
        <div className={styles.bottomContentStyle}>
          {bottomFlag && (
            <Radio.Group onChange={this.handleRadioChange} value={selectBottom}>
              {bottomList &&
                bottomList.map((item, index) => (
                  <Radio key={index} value={R.pathOr('', ['key'], item)}>
                    <span className={styles.selectStyle}>
                      {R.pathOr('', ['name'], item)}
                    </span>
                  </Radio>
                ))}
            </Radio.Group>
          )}
        </div>
      </div>
    )
  }
}
