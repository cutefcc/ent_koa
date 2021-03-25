import * as React from 'react'
import { connect } from 'react-redux'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  dispatch?: (obj: object) => any
  data: object[]
  keyForData: string
}

export interface State {
  showMore: boolean
}

@connect((state: any) => ({}))
export default class AnalysisData extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showMore: false,
    }
  }

  handleCalcPercent = (count: number, renderData: object[]) => {
    return Math.ceil((390 * count) / renderData[0].count)
  }

  handleShowMore = () => {
    const { showMore } = this.state
    this.setState({
      showMore: !showMore,
    })
  }

  handleCalcRenderData = (showMore: boolean) => {
    let { data } = this.props
    data = data.sort((a, b) => b.count - a.count)
    const topFiveData = data.length >= 5 ? data.slice(0, 5) : data
    return showMore ? data : topFiveData
  }

  render() {
    const { showMore } = this.state
    const {
      keyForData,
      data: { length },
    } = this.props
    const renderData = this.handleCalcRenderData(showMore)
    return (
      <div>
        <div className={styles.topTitle}>
          <div className={`${styles.title} font-size-14`}>
            {R.prop(keyForData, ANALYSIS_TITLE_MAP)}
          </div>
          {length > 5 && (
            <div
              className={`${styles.moreText} font-size-12`}
              onClick={this.handleShowMore}
            >
              {showMore ? '收起' : '更多'}
            </div>
          )}
        </div>
        {renderData.map((item) => {
          const bgWidth = this.handleCalcPercent(item.count, renderData)
          return (
            <div className={styles.eachItem} key={item.name}>
              <div className={styles.nameDiv}>
                <div
                  className={styles.bgPercent}
                  style={{ width: `${bgWidth}px` }}
                ></div>
                <div className={`${styles.name} font-size-12`}>{item.name}</div>
              </div>
              <div className={`${styles.count} font-size-12`}>{item.count}</div>
            </div>
          )
        })}
      </div>
    )
  }
}
