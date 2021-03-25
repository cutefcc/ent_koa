import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import {
  getCompanyNameByKey,
  companyKeyList,
  wordCloudMagnification,
} from 'utils/talentReport'
import WordCloud from 'componentsV3/TalentReport/Echarts/WordCloud'
import Rank from 'componentsV3/TalentReport/Echarts/Rank'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  employeeTurnoverData: object
  selectPositionName: string
  loading: boolean
  rights: boolean
}

export interface State {
  selectWordCloudBottom: string
}

@connect((state: any) => ({
  employeeTurnoverData: state.talentReport.employeeTurnoverData,
  selectPositionName: state.talentReport.selectPositionName,
}))
export default class StaffSkills extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectWordCloudBottom: 'all',
    }
  }

  getWordCloudDataList = () => {
    const { employeeTurnoverData } = this.props
    const { selectWordCloudBottom } = this.state
    const info = R.pathOr({}, ['info'], employeeTurnoverData)
    const list = R.pathOr([], [selectWordCloudBottom], info)
    list.forEach((item, index) => {
      // item.per
      // eslint-disable-next-line no-param-reassign
      item.value =
        (list.length - index) * R.pathOr(1, [index], wordCloudMagnification)
      // (list.length - index) * (list.length - index) * (list.length - index)
      // if (index < 10) {
      //   item.value = (list.length - index) * 2
      // } else {
      //   item.value = list.length - index
      // }
    })
    return list
  }

  getWordCloudBottomList = () => {
    const { employeeTurnoverData } = this.props
    const info = R.pathOr({}, ['info'], employeeTurnoverData)
    const list = []
    companyKeyList.forEach(key => {
      const temp = R.pathOr(null, [key], info)
      if (temp === null) {
        return
      }
      list.push({ name: getCompanyNameByKey(key), key })
    })
    return list
  }

  selectWordCloud = key => {
    this.setState({
      selectWordCloudBottom: key,
    })
  }

  render() {
    const { selectWordCloudBottom } = this.state
    const {
      employeeTurnoverData,
      selectPositionName,
      loading,
      rights,
    } = this.props

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.RankStyle}>
          <EchartsTitle title={`${selectPositionName}员工的技能标签Top5`} />
          {showLoading ? (
            <CommonLoading height={'152px'} showDefault={showDefault} />
          ) : (
            <Rank dataObj={R.pathOr({}, ['info'], employeeTurnoverData)} />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            date={R.pathOr('', ['cycle'], employeeTurnoverData)}
          />
        </div>
        <div className={styles.wordCloudStyle}>
          <EchartsTitle title={`${selectPositionName}员工的技能标签云`} />
          {showLoading ? (
            <CommonLoading height={'346px'} showDefault={showDefault} />
          ) : (
            <WordCloud
              dataList={this.getWordCloudDataList()}
              bottomFlag={true}
              selectBottom={selectWordCloudBottom}
              bottomList={this.getWordCloudBottomList()}
              handleWordCloudSelect={this.selectWordCloud}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            date={R.pathOr('', ['cycle'], employeeTurnoverData)}
          />
        </div>
      </div>
    )
  }
}
