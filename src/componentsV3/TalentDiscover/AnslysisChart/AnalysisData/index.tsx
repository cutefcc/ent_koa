import * as React from 'react'
import { connect } from 'react-redux'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  dispatch?: (obj: object) => any
  data: object[]
  mappingTags: object[]
  keyForData: string
  onMappingTagsChanged: Function
}

export interface State {
  showMore: boolean
}

@connect((state: any) => ({
  currentUser: state.global.currentUser,
}))
export default class AnalysisData extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showMore: false,
    }
  }

  handleCalcPercent = (count: number, renderData: object[]) => {
    return ((count * 100) / renderData[0].count).toFixed(2)
  }

  handleShowMore = () => {
    const tlv = R.pathOr(
      2,
      ['props', 'currentUser', 'talent_lib_version'],
      this
    )
    if (tlv === 2) {
      return
    }
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

  handleEachItemClick = (item: object, key: string) => () => {
    const tlv = R.pathOr(
      2,
      ['props', 'currentUser', 'talent_lib_version'],
      this
    )

    if (tlv === 2) {
      this.props.dispatch({
        type: 'global/setMemberUpgradeTip',
        payload: {
          show: true,
        },
      })
      return
    }
    this.props.onMappingTagsChanged(item, key)
  }

  render() {
    const { showMore } = this.state
    const {
      keyForData,
      data: { length },
      mappingTags = [],
    } = this.props
    const renderData = this.handleCalcRenderData(showMore)
    const tlv = R.pathOr(
      2,
      ['props', 'currentUser', 'talent_lib_version'],
      this
    )
    const styleObj =
      tlv === 2
        ? {
            filter: 'blur(3px)',
            pointerEvents: 'none',
            userSelect: 'none',
          }
        : {
            filter: 'blur(0px)',
          }
    return (
      <div>
        <div className={styles.topTitle}>
          <div className={`${styles.title} font-size-14`}>
            {R.prop(keyForData, ANALYSIS_TITLE_MAP)}
          </div>
          {length > 5 && (
            <div
              style={styleObj}
              className={`${styles.moreText} font-size-12`}
              onClick={this.handleShowMore}
            >
              {showMore ? '收起' : '更多'}
            </div>
          )}
        </div>
        {renderData.map((item) => {
          const bgWidth = `${this.handleCalcPercent(item.count, renderData)}%`
          return (
            <div
              style={styleObj}
              className={`${styles.eachItem} ${
                mappingTags.some(
                  (it) => it.key === keyForData && it.name === item.name
                )
                  ? styles.checked
                  : ''
              }`}
              key={item.name}
              onClick={this.handleEachItemClick(item, keyForData)}
            >
              <div className={styles.nameDiv}>
                <div
                  className={styles.bgPercent}
                  style={{ width: `${bgWidth}` }}
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
