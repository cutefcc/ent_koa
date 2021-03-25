import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import { getCompanyNameByKey, companyKeyList } from 'utils/talentReport'
import { toPoint } from 'utils/numbers'
import HalfPieDoughnut from 'componentsV3/TalentReport/Echarts/HalfPieDoughnut'
import BarXCategoryStack from 'componentsV3/TalentReport/Echarts/BarXCategoryStack'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import HorizontalBar from 'componentsV3/TalentReport/Echarts/HorizontalBar'
import CircularProcessBar from 'components/CircularProcessBar'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  reserveTalentPortraitsNumObj: object
  reserveTalentPortraitsEduObj: object
  reserveTalentPortraitsSchoolObj: object
  reserveTalentPortraitsWorkYearObj: object
  selectPositionName: string
  selectPositionCode: string
  positionKeyIndex: object
  loading: boolean
  rights: boolean
  compareCompanyList: Array<object>
}

export interface State {}

@connect((state: any) => ({
  reserveTalentPortraitsNumObj: state.talentReport.reserveTalentPortraitsNumObj,
  reserveTalentPortraitsEduObj: state.talentReport.reserveTalentPortraitsEduObj,
  reserveTalentPortraitsSchoolObj:
    state.talentReport.reserveTalentPortraitsSchoolObj,
  reserveTalentPortraitsWorkYearObj:
    state.talentReport.reserveTalentPortraitsWorkYearObj,
  selectPositionName: state.talentReport.selectPositionName,
  selectPositionCode: state.talentReport.selectPositionCode,
  positionKeyIndex: state.talentReport.positionKeyIndex,
  compareCompanyList: state.talentReport.compareCompanyList,
}))
export default class ReserveTalentPortraits extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  getHalfPieDoughnutData = () => {
    const { reserveTalentPortraitsNumObj } = this.props
    return R.pathOr({}, ['info'], reserveTalentPortraitsNumObj)
  }

  getWordCloudBottomList = () => {
    const { reserveTalentPortraitsNumObj } = this.props
    const info = R.pathOr({}, ['info'], reserveTalentPortraitsNumObj)
    const list = []
    let result = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      list.push(tempList)
    })
    if (list.length > 0) {
      result = list[0]
    }
    return result
  }

  getBarXCategoryStackData = () => {
    const { reserveTalentPortraitsEduObj } = this.props
    const info = R.pathOr({}, ['info'], reserveTalentPortraitsEduObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      if (tempList.length === 0) {
        // 获取不到数据，特殊处理
        tempList.push(
          {
            per: '暂无数据',
            name: '本科',
          },
          {
            per: '暂无数据',
            name: '硕士',
          },
          {
            per: '暂无数据',
            name: '博士及以上',
          },
          {
            per: '暂无数据',
            name: '其他',
          }
        )
      }
      titleList.push(getCompanyNameByKey(key))
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

  getCircularProcessBarData = () => {
    const { reserveTalentPortraitsSchoolObj } = this.props
    const info = R.pathOr({}, ['info'], reserveTalentPortraitsSchoolObj)
    const list = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      if (tempList.length > 0) {
        list.push({
          value: toPoint(R.pathOr('', [0, 'per'], tempList)),
          title: getCompanyNameByKey(key),
          showName: R.pathOr('', [0, 'per'], tempList),
        })
      } else if (tempList.length === 0) {
        list.push({
          value: 0,
          title: getCompanyNameByKey(key),
          showName: '暂无数据',
        })
      }
    })
    return list
  }

  getBarXCategoryStackList = () => {
    const { reserveTalentPortraitsEduObj } = this.props
    const info = R.pathOr({}, ['info'], reserveTalentPortraitsEduObj)
    const list = []
    let result = []
    companyKeyList.forEach(key => {
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

  getHorintalBarData = () => {
    const { reserveTalentPortraitsWorkYearObj } = this.props
    const originInfo = R.pathOr({}, ['info'], reserveTalentPortraitsWorkYearObj)
    const worktimeMaps = {}
    companyKeyList.forEach(key => {
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
        worktimeMaps['1年以内'] = worktimeMaps['1年以内'] || {}
        worktimeMaps['1年以内'].info = worktimeMaps['1年以内'].info || {}
        worktimeMaps['1年以内'].info[key] = '暂无数据'
        worktimeMaps['1-3年'] = worktimeMaps['1-3年'] || {}
        worktimeMaps['1-3年'].info = worktimeMaps['1-3年'].info || {}
        worktimeMaps['1-3年'].info[key] = '暂无数据'
        worktimeMaps['3-5年'] = worktimeMaps['3-5年'] || {}
        worktimeMaps['3-5年'].info = worktimeMaps['3-5年'].info || {}
        worktimeMaps['3-5年'].info[key] = '暂无数据'
        worktimeMaps['5-10年'] = worktimeMaps['5-10年'] || {}
        worktimeMaps['5-10年'].info = worktimeMaps['5-10年'].info || {}
        worktimeMaps['5-10年'].info[key] = '暂无数据'
        worktimeMaps['10年以上'] = worktimeMaps['10年以上'] || {}
        worktimeMaps['10年以上'].info = worktimeMaps['10年以上'].info || {}
        worktimeMaps['10年以上'].info[key] = '暂无数据'
      }
    })

    const series = []
    let legend = []
    let title = []

    Object.keys(worktimeMaps).forEach((key, index) => {
      if (worktimeMaps[key].info) {
        legend.push(key)
        if (index === 0) {
          title = Object.keys(worktimeMaps[key].info).map(k =>
            getCompanyNameByKey(k)
          )
        }
        const data = Object.values(worktimeMaps[key].info).map(item => {
          if (item === '暂无数据') {
            return {
              name: '暂无数据',
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
      positionKeyIndex,
      selectPositionCode,
      selectPositionName,
      reserveTalentPortraitsNumObj,
      reserveTalentPortraitsEduObj,
      reserveTalentPortraitsSchoolObj,
      reserveTalentPortraitsWorkYearObj,
      loading,
      rights,
      compareCompanyList,
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
        <div className={styles.firstContentStyle}>
          <EchartsTitle title={`核心岗位储备人才的人数分布`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={compareCompanyList.length > 3 ? '472px' : '322px'}
            />
          ) : (
            <HalfPieDoughnut
              dataObj={this.getHalfPieDoughnutData()}
              topFlag={true}
              topList={this.getWordCloudBottomList()}
              positionIndex={positionKeyIndex[selectPositionCode]}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            date={R.pathOr('', ['cycle'], reserveTalentPortraitsNumObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}储备人才的学历分布`} />
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
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], reserveTalentPortraitsEduObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}储备人才的名校占比`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={compareCompanyList.length > 3 ? '692px' : '692px'}
            />
          ) : (
            <div className={styles.circularProcessSimpleStyle}>
              <div className={styles.topContentStyle}>
                <div className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: '#004cff' }}
                  />
                  <div className={styles.showIconWord}>名校</div>
                </div>
                <div className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: '#eee' }}
                  />
                  <div className={styles.showIconWord}>非名校</div>
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
            loading={showLoading}
            showDefault={showDefault}
            style={{
              marginTop: left !== 0 ? '-75px' : '-40px',
            }}
            date={R.pathOr('', ['cycle'], reserveTalentPortraitsSchoolObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}储备人才的工作年限分布`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={compareCompanyList.length > 3 ? '536px' : '536px'}
              marginBottom={'24px'}
            />
          ) : (
            <HorizontalBar data={worktimeData} color="#004CFF" />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], reserveTalentPortraitsWorkYearObj)}
          />
        </div>
      </div>
    )
  }
}
