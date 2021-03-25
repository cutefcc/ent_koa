import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { getLineColorByIndex, cityKeyList } from 'utils/talentReport'
import LineStack from 'componentsV3/TalentReport/Echarts/LineStack'
import BarSimple from 'componentsV3/TalentReport/Echarts/BarSimple'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  industryFlowSeekerObj: object
  industryFlowRecruitObj: object
  selectPositionName: string
  loading: boolean
  rights: boolean
}

export interface State {}

@connect((state: any) => ({
  industryFlowSeekerObj: state.talentReport.industryFlowSeekerObj,
  industryFlowRecruitObj: state.talentReport.industryFlowRecruitObj,
  selectPositionName: state.talentReport.selectPositionName,
}))
export default class IndustryFlow extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getLineStackData = () => {
    const { industryFlowSeekerObj } = this.props
    const info = R.pathOr({}, ['info'], industryFlowSeekerObj)
    const list = []
    const titleList = []
    const topList = []
    cityKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      list.push({
        name: key,
        data: item.map(temp => {
          if (titleList.length < item.length) {
            titleList.push(temp.d)
          }
          return parseFloat(temp.per)
        }),
      })
      topList.push({ name: key })
    })

    return {
      lineStackList: list,
      lineStackTitleList: titleList,
      lineStackTopList: topList,
    }
  }

  getBarSimpleData = () => {
    const { industryFlowRecruitObj } = this.props
    const info = R.pathOr({}, ['info'], industryFlowRecruitObj)
    const list = []
    const colorList = []
    const titleList = []
    cityKeyList.forEach((key, index) => {
      const temp = R.pathOr(null, [key], info)
      if (temp !== null) {
        list.push(R.pathOr(0, [key], info))
        colorList.push(getLineColorByIndex(index))
        titleList.push(key)
      }
    })
    return {
      barSimpleList: list,
      barSimpleTitleList: titleList,
      barSimpleColorList: colorList,
    }
  }

  render() {
    const {
      industryFlowSeekerObj,
      industryFlowRecruitObj,
      selectPositionName,
      loading,
      rights,
    } = this.props

    const {
      lineStackList,
      lineStackTitleList,
      lineStackTopList,
    } = this.getLineStackData()

    const {
      barSimpleList,
      barSimpleTitleList,
      barSimpleColorList,
    } = this.getBarSimpleData()

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.firstContentStyle}>
          <EchartsTitle title={`城市${selectPositionName}求职者人数变化趋势`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <LineStack
              topFlag={true}
              topList={lineStackTopList}
              dataList={lineStackList}
              titleList={lineStackTitleList}
              unit="月"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-40px' }}
            date={R.pathOr('', ['cycle'], industryFlowSeekerObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`城市${selectPositionName}的招聘竞争度`} />
          {showLoading ? (
            <CommonLoading height={'324px'} showDefault={showDefault} />
          ) : (
            <BarSimple
              dataList={barSimpleList}
              titleList={barSimpleTitleList}
              color="#004CFF"
              colorList={barSimpleColorList}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            comment="招聘竞争度=岗位有效JD总数/求职人数"
            style={{ marginTop: '-40px' }}
            date={R.pathOr('', ['cycle'], industryFlowRecruitObj)}
          />
        </div>
      </div>
    )
  }
}
