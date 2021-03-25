import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import { toPoint } from 'utils/numbers'
import { getCompanyNameByKey, companyKeyList } from 'utils/talentReport'
import BarNegative from 'componentsV3/TalentReport/Echarts/BarNegative'
import Source from 'componentsV3/TalentReport/Echarts/Source'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

const topColor = '#004CFF'
const bottomColor = '#A8C2FF'
export interface Props {
  dispatch?: (obj: object) => any
  selectPositionName: string
  selectPositionCode: string
  employeeTurnoverrRatioObj: Object
  employeeTurnoverrEntrySourceObj: Object
  employeeTurnoverrFlowLeaveObj: Object
  loading: boolean
  rights: boolean
}

export interface State {}

@connect((state: any) => ({
  selectPositionName: state.talentReport.selectPositionName,
  selectPositionCode: state.talentReport.selectPositionCode,
  employeeTurnoverrRatioObj: state.talentReport.employeeTurnoverrRatioObj,
  employeeTurnoverrEntrySourceObj:
    state.talentReport.employeeTurnoverrEntrySourceObj,
  employeeTurnoverrFlowLeaveObj:
    state.talentReport.employeeTurnoverrFlowLeaveObj,
}))
export default class EmployeeTurnover extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  getBarNegativeData = () => {
    const { employeeTurnoverrRatioObj } = this.props
    const info = R.pathOr({}, ['info'], employeeTurnoverrRatioObj)
    const topList = []
    const bottomList = []
    const titleList = []
    let topName = ''
    let bottomName = ''

    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      titleList.push(getCompanyNameByKey(key))
      if (tempList.length === 2) {
        const tempTop = toPoint(`${R.pathOr('', [0, 'per'], tempList)}`)
        const topPerNum =
          tempTop !== 0 ? Math.log(Number(tempTop) * 10000) : tempTop
        const tempBottom = toPoint(`${R.pathOr('', [1, 'per'], tempList)}`)
        const bottomPerNum = -(tempBottom !== 0
          ? Math.log(Number(tempBottom) * 10000)
          : tempBottom)
        topList.push({
          value: topPerNum,
          name: `${R.pathOr('', [0, 'per'], tempList)}`,
          itemStyle: {
            color: topColor,
          },
          emphasis: {
            itemStyle: {
              color: topColor,
            },
          },
        })
        bottomList.push({
          value: bottomPerNum,
          name: `-${R.pathOr('', [1, 'per'], tempList)}`,
          itemStyle: {
            color: bottomColor,
          },
          emphasis: {
            itemStyle: {
              color: bottomColor,
            },
          },
        })
        topName = R.pathOr('', [0, 'name'], tempList)
        bottomName = R.pathOr('', [1, 'name'], tempList)
      } else {
        topList.push({
          value: 0.15,
          name: `暂无数据`,
        })
        bottomList.push({
          value: -0.15,
          name: `暂无数据`,
        })
      }
    })
    return {
      barNegativeTopList: topList,
      barNegativeBottomList: bottomList,
      barNegativeTitleList: titleList,
      topName,
      bottomName,
    }
  }

  render() {
    const {
      selectPositionName,
      employeeTurnoverrRatioObj,
      employeeTurnoverrEntrySourceObj,
      employeeTurnoverrFlowLeaveObj,
      selectPositionCode,
      loading,
      rights,
    } = this.props

    const {
      barNegativeTopList,
      barNegativeBottomList,
      barNegativeTitleList,
      topName,
      bottomName,
    } = this.getBarNegativeData()

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.firstContentStyle}>
          <EchartsTitle title={`${selectPositionName}员工入职/离职率`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <BarNegative
              topList={barNegativeTopList}
              bottomList={barNegativeBottomList}
              titleList={barNegativeTitleList}
              topColor={topColor}
              bottomColor={bottomColor}
              topName={topName}
              bottomName={bottomName}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], employeeTurnoverrRatioObj)}
            comment="入职率=入职人数/平均在职人数 离职率=离职人数/平均在职人数"
          />
        </div>
        {selectPositionCode && selectPositionCode === 'all_core_positions' ? (
          <div>
            <div className={styles.commonContentStyle}>
              <EchartsTitle title={`${selectPositionName}员工来源企业`} />
              {showLoading ? (
                <CommonLoading height={'300px'} showDefault={showDefault} />
              ) : (
                <Source
                  number={10}
                  position="left"
                  dataObj={R.pathOr(
                    {},
                    ['info'],
                    employeeTurnoverrEntrySourceObj
                  )}
                />
              )}
              <EchartsBottom
                loading={showLoading}
                showDefault={showDefault}
                date={R.pathOr('', ['cycle'], employeeTurnoverrEntrySourceObj)}
              />
            </div>
            <div className={styles.commonContentStyle}>
              <EchartsTitle title={`${selectPositionName}员工去向企业`} />
              {showLoading ? (
                <CommonLoading height={'300px'} showDefault={showDefault} />
              ) : (
                <Source
                  number={10}
                  position="right"
                  dataObj={R.pathOr(
                    {},
                    ['info'],
                    employeeTurnoverrFlowLeaveObj
                  )}
                />
              )}
              <EchartsBottom
                loading={showLoading}
                showDefault={showDefault}
                date={R.pathOr('', ['cycle'], employeeTurnoverrFlowLeaveObj)}
              />
            </div>
          </div>
        ) : (
          <div className={styles.twoContentStyle}>
            <div className={styles.commonTwoContentStyle}>
              <EchartsTitle title={`${selectPositionName}员工来源企业`} />
              {showLoading ? (
                <CommonLoading height={'300px'} showDefault={showDefault} />
              ) : (
                <Source
                  number={3}
                  position="left"
                  dataObj={R.pathOr(
                    {},
                    ['info'],
                    employeeTurnoverrEntrySourceObj
                  )}
                />
              )}
              <EchartsBottom
                loading={showLoading}
                showDefault={showDefault}
                date={R.pathOr('', ['cycle'], employeeTurnoverrEntrySourceObj)}
              />
            </div>
            <div className={styles.commonTwoContentStyle}>
              <EchartsTitle title={`${selectPositionName}员工去向企业`} />
              {showLoading ? (
                <CommonLoading height={'300px'} showDefault={showDefault} />
              ) : (
                <Source
                  number={3}
                  position="right"
                  dataObj={R.pathOr(
                    {},
                    ['info'],
                    employeeTurnoverrFlowLeaveObj
                  )}
                />
              )}
              <EchartsBottom
                loading={showLoading}
                showDefault={showDefault}
                date={R.pathOr('', ['cycle'], employeeTurnoverrFlowLeaveObj)}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}
