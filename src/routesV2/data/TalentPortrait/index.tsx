import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { toPoint } from 'utils/numbers'
import { cityKeyList } from 'utils/talentReport'
import CircularProcessBar from 'components/CircularProcessBar'
import HorizontalBar from 'componentsV3/TalentReport/Echarts/HorizontalBar'
import HalfPieDoughnut from 'componentsV3/TalentReport/Echarts/HalfPieDoughnut'
import BarXCategoryStack from 'componentsV3/TalentReport/Echarts/BarXCategoryStack'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'
export interface Props {
  dispatch?: (obj: object) => any
  talentPortraitNumObj: object
  talentPortraitEduObj: object
  talentPortraitSchoolObj: object
  talentPortraitWorkYearObj: object
  selectPositionName: string
  positionKeyIndex: string
  selectPositionCode: string
  loading: boolean
  rights: boolean
}

export interface State {}

@connect((state: any) => ({
  talentPortraitNumObj: state.talentReport.talentPortraitNumObj,
  talentPortraitEduObj: state.talentReport.talentPortraitEduObj,
  talentPortraitSchoolObj: state.talentReport.talentPortraitSchoolObj,
  talentPortraitWorkYearObj: state.talentReport.talentPortraitWorkYearObj,
  selectPositionName: state.talentReport.selectPositionName,
  positionKeyIndex: state.talentReport.positionKeyIndex,
  selectPositionCode: state.talentReport.selectPositionCode,
}))
export default class TalentPortrait extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getHalfPieDoughnutData = () => {
    const { talentPortraitNumObj } = this.props
    return R.pathOr({}, ['info'], talentPortraitNumObj)
  }

  getHalfPieDoughnutBottomList = () => {
    const { talentPortraitNumObj } = this.props
    const info = R.pathOr({}, ['info'], talentPortraitNumObj)
    const list = []
    let result = []
    cityKeyList.forEach(key => {
      const temp = R.pathOr(null, [key], info)
      if (temp !== null) {
        list.push(R.pathOr([], [key], info))
      }
    })
    if (list.length > 0) {
      result = list[0]
    }
    return result
  }

  getBarXCategoryStackData = () => {
    const { talentPortraitEduObj } = this.props
    const info = R.pathOr({}, ['info'], talentPortraitEduObj)
    const list = []
    const titleList = []
    cityKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      if (tempList.length === 0) {
        // ?????????????????????????????????
        tempList.push(
          {
            per: '????????????',
            name: '??????',
          },
          {
            per: '????????????',
            name: '??????',
          },
          {
            per: '????????????',
            name: '???????????????',
          },
          {
            per: '????????????',
            name: '??????',
          }
        )
      }
      titleList.push(key)
      tempList.forEach((item, index) => {
        if (list.length - 1 < index) {
          list.push([])
        }
        list[index].push({
          value: toPoint(R.pathOr('', ['per'], item)),
          name: R.pathOr('', ['per'], item),
          title: R.pathOr('', ['name'], item),
        })
      })
    })
    return {
      barXCategoryStackList: list,
      barXCategoryStacktTtleList: titleList,
    }
  }

  getBarXCategoryStackList = () => {
    const { talentPortraitEduObj } = this.props
    const info = R.pathOr({}, ['info'], talentPortraitEduObj)
    const list = []
    let result = []
    cityKeyList.forEach(key => {
      const temp = R.pathOr(null, [key], info)
      if (temp !== null) {
        list.push(R.pathOr([], [key], info))
      }
    })
    if (list.length > 0) {
      result = list[0]
    }
    return result
  }

  getCircularProcessBarData = () => {
    const { talentPortraitSchoolObj } = this.props
    const info = R.pathOr({}, ['info'], talentPortraitSchoolObj)
    const list = []
    cityKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      if (tempList.length > 0) {
        list.push({
          value: toPoint(R.pathOr('', [0, 'per'], tempList)),
          title: key,
          showName: R.pathOr('', [0, 'per'], tempList),
        })
      } else if (tempList.length === 0) {
        list.push({
          value: 0,
          title: key,
          showName: '????????????',
        })
      }
    })
    return list
  }

  getHorintalBarData = () => {
    const { talentPortraitWorkYearObj } = this.props
    const originInfo = R.pathOr({}, ['info'], talentPortraitWorkYearObj)
    const worktimeMaps = {}
    cityKeyList.forEach(key => {
      const temp = R.pathOr(null, [key], originInfo)
      if (temp === null) {
        return
      }
      if (temp.length > 0) {
        originInfo[key].map(({ name, per }) => {
          if (worktimeMaps[name] && worktimeMaps[name].info) {
            worktimeMaps[name].info[key] = per
          } else {
            worktimeMaps[name] = {}
            worktimeMaps[name].info = {}
            worktimeMaps[name].info[key] = per
          }
        })
      } else if (temp.length === 0) {
        worktimeMaps['1?????????'] = worktimeMaps['1?????????'] || {}
        worktimeMaps['1?????????'].info = worktimeMaps['1?????????'].info || {}
        worktimeMaps['1?????????'].info[key] = '????????????'
        worktimeMaps['1-3???'] = worktimeMaps['1-3???'] || {}
        worktimeMaps['1-3???'].info = worktimeMaps['1-3???'].info || {}
        worktimeMaps['1-3???'].info[key] = '????????????'
        worktimeMaps['3-5???'] = worktimeMaps['3-5???'] || {}
        worktimeMaps['3-5???'].info = worktimeMaps['3-5???'].info || {}
        worktimeMaps['3-5???'].info[key] = '????????????'
        worktimeMaps['5-10???'] = worktimeMaps['5-10???'] || {}
        worktimeMaps['5-10???'].info = worktimeMaps['5-10???'].info || {}
        worktimeMaps['5-10???'].info[key] = '????????????'
        worktimeMaps['10?????????'] = worktimeMaps['10?????????'] || {}
        worktimeMaps['10?????????'].info = worktimeMaps['10?????????'].info || {}
        worktimeMaps['10?????????'].info[key] = '????????????'
      }
    })

    const series = []
    let legend = []
    let title = []

    Object.keys(worktimeMaps).forEach((key, index) => {
      if (worktimeMaps[key].info) {
        legend.push(key)
        if (index === 0) {
          title = Object.keys(worktimeMaps[key].info).map(k => k)
        }
        const data = Object.values(worktimeMaps[key].info).map(item => {
          if (item === '????????????') {
            return {
              name: '????????????',
              value: 0,
            }
          } else {
            return item.replace('%', '')
          }
        })
        series.push({
          key,
          data,
        })
      }
    })

    return {
      series,
      legend,
      title,
    }
  }

  render() {
    const {
      talentPortraitNumObj,
      talentPortraitEduObj,
      talentPortraitSchoolObj,
      talentPortraitWorkYearObj,
      selectPositionName,
      selectPositionCode,
      positionKeyIndex,
      loading,
      rights,
    } = this.props

    const {
      barXCategoryStackList,
      barXCategoryStacktTtleList,
    } = this.getBarXCategoryStackData()

    const list = this.getCircularProcessBarData()
    const left = list.length % 3

    const worktimeData = this.getHorintalBarData()

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.halfPieDoughnutStyle}>
          <EchartsTitle title={`???????????????????????????????????????`} />
          {showLoading ? (
            <CommonLoading showDefault={showDefault} height={'322px'} />
          ) : (
            <HalfPieDoughnut
              notCompany={true}
              dataObj={this.getHalfPieDoughnutData()}
              topFlag={true}
              topList={this.getHalfPieDoughnutBottomList()}
              positionIndex={positionKeyIndex[selectPositionCode]}
            />
          )}
          <EchartsBottom
            showDefault={showDefault}
            loading={showLoading}
            date={R.pathOr('', ['cycle'], talentPortraitNumObj)}
          />
        </div>
        <div className={styles.barXCategoryStackStyle}>
          <EchartsTitle title={`??????${selectPositionName}?????????????????????`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <BarXCategoryStack
              dataList={barXCategoryStackList}
              titleList={barXCategoryStacktTtleList}
              topFlag={true}
              topList={this.getBarXCategoryStackList()}
            />
          )}
          <EchartsBottom
            showDefault={showDefault}
            loading={showLoading}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], talentPortraitEduObj)}
          />
        </div>
        <div className={styles.barSimpleStyle}>
          <EchartsTitle title={`??????${selectPositionName}?????????????????????`} />
          {showLoading ? (
            <CommonLoading showDefault={showDefault} height={'426px'} />
          ) : (
            <div className={styles.circularProcessSimpleStyle}>
              <div className={styles.topContentStyle}>
                <div className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: '#004cff' }}
                  />
                  <div className={styles.showIconWord}>??????</div>
                </div>
                <div className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: '#eee' }}
                  />
                  <div className={styles.showIconWord}>?????????</div>
                </div>
              </div>
              {list &&
                list.map((item, index) => (
                  <CircularProcessBar
                    title={item.title}
                    showName={item.showName}
                    percent={item.value}
                    key={index}
                  />
                ))}
              {left <= 2 && left !== 0 && (
                <div className={styles.circularProcessSimpleItemStyle} />
              )}
              {left <= 1 && left !== 0 && (
                <div className={styles.circularProcessSimpleItemStyle} />
              )}
            </div>
          )}
          <EchartsBottom
            showDefault={showDefault}
            loading={showLoading}
            style={{
              marginTop: '-40px',
            }}
            date={R.pathOr('', ['cycle'], talentPortraitSchoolObj)}
          />
        </div>
        <div className={styles.barSimpleStyle}>
          <EchartsTitle title={`??????${selectPositionName}???????????????????????????`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={6 * 67 + 'px'}
              marginBottom={'24px'}
            />
          ) : (
            <HorizontalBar data={worktimeData} color="#004CFF" />
          )}
          <EchartsBottom
            showDefault={showDefault}
            loading={showLoading}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], talentPortraitWorkYearObj)}
          />
        </div>
      </div>
    )
  }
}
