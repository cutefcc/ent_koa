import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import { toPoint } from 'utils/numbers'
import {
  getCompanyNameByKey,
  getDataSetColorByIndex,
  companyKeyList,
} from 'utils/talentReport'
import BarYSimple from 'componentsV3/TalentReport/Echarts/BarYSimple'
import DatasetSimple from 'componentsV3/TalentReport/Echarts/DatasetSimple'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  employerInfluenceAffectObj: object
  employerInfluenceCardNumObj: object
  loading: boolean
  rights: boolean
}

export interface State {}

@connect((state: any) => ({
  employerInfluenceAffectObj: state.talentReport.employerInfluenceAffectObj,
  employerInfluenceCardNumObj: state.talentReport.employerInfluenceCardNumObj,
}))
export default class EmployerInfluence extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  getCorporateInfluenceData = () => {
    const { employerInfluenceAffectObj } = this.props
    const info = R.pathOr({}, ['info', 'affect'], employerInfluenceAffectObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      list.push({
        value: parseInt(R.pathOr(0, ['index'], item), 0),
        name:
          R.pathOr(0, ['rank'], item) === 0
            ? [`暂无排名`, `（该企业未开通企业号）`]
            : [
                `排名${R.pathOr(0, ['rank'], item)}，`,
                `影响力${R.pathOr('0', ['index'], item)}`,
              ],
      })
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      corporateInfluenceList: list,
      corporateInfluenceTitleList: titleList,
    }
  }

  getContentExposureData = () => {
    const { employerInfluenceAffectObj } = this.props
    const info = R.pathOr({}, ['info', 'content'], employerInfluenceAffectObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      list.push({
        value: parseInt(R.pathOr(0, ['index'], item), 0),
        name:
          R.pathOr(0, ['rank'], item) === 0
            ? [`暂无排名`, `（该企业未开通企业号）`]
            : [
                `排名${R.pathOr(0, ['rank'], item)}，`,
                `曝光指数${R.pathOr('0', ['index'], item)}`,
              ],
      })
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      contentExposureList: list,
      contentExposureTitleList: titleList,
    }
  }

  getEmployeeRecognitionData = () => {
    const { employerInfluenceAffectObj } = this.props
    const info = R.pathOr({}, ['info', 'approval'], employerInfluenceAffectObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      list.push({
        value: parseInt(R.pathOr(0, ['index'], item), 0),
        name:
          R.pathOr(0, ['rank'], item) === 0
            ? [`暂无排名`, `（该企业未开通企业号）`]
            : [
                `排名${R.pathOr(0, ['rank'], item)}，`,
                `认可指数${R.pathOr('0', ['index'], item)}`,
              ],
      })
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      employeeRecognitionList: list,
      employeeRecognitionTitleList: titleList,
    }
  }

  getFanInteractionData = () => {
    const { employerInfluenceAffectObj } = this.props
    const info = R.pathOr({}, ['info', 'interact'], employerInfluenceAffectObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      list.push({
        value: parseInt(R.pathOr(0, ['index'], item), 0),
        name:
          R.pathOr(0, ['rank'], item) === 0
            ? [`暂无排名`, `（该企业未开通企业号）`]
            : [
                `排名${R.pathOr(0, ['rank'], item)}，`,
                `互动指数${R.pathOr('0', ['index'], item)}`,
              ],
      })
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      fanInteractionList: list,
      fanInteractionTitleList: titleList,
    }
  }

  getTotalSiteMentionsData = () => {
    const { employerInfluenceCardNumObj } = this.props
    const info = R.pathOr({}, ['info'], employerInfluenceCardNumObj)
    const dimensionsList = ['totalSiteMentions']
    const sourceList = []
    const barList = []
    companyKeyList.forEach(key => {
      const item = R.pathOr(null, [key], info)
      if (item === null) {
        return
      }
      const tempList = {
        totalSiteMentions: getCompanyNameByKey(key),
      }
      if (item && item.length === 2) {
        item.forEach((single, index) => {
          if (item.length + 1 !== dimensionsList.length) {
            dimensionsList.push(R.pathOr('', ['name'], single))
            barList.push({
              type: 'bar',
              barGap: 0,
              color: getDataSetColorByIndex(index),
              barMinHeight: 1,
              name: R.pathOr('', ['name'], single),
              itemStyle: {
                color: getDataSetColorByIndex(index),
              },
              emphasis: {
                itemStyle: {
                  color: getDataSetColorByIndex(index),
                },
              },
            })
          }
          tempList[R.pathOr('', ['name'], single)] = R.pathOr(
            '',
            ['num'],
            single
          )
        })
      } else {
        if (barList.length === 0) {
          dimensionsList.push('实名帖')
          dimensionsList.push('匿名帖')
          barList.push({
            type: 'bar',
            barGap: 0,
            color: getDataSetColorByIndex(0),
            name: '实名帖',
            barMinHeight: 1,
            itemStyle: {
              color: getDataSetColorByIndex(0),
            },
            emphasis: {
              itemStyle: {
                color: getDataSetColorByIndex(0),
              },
            },
          })
          barList.push({
            type: 'bar',
            barGap: 0,
            color: getDataSetColorByIndex(1),
            name: '匿名帖',
            barMinHeight: 1,
            itemStyle: {
              color: getDataSetColorByIndex(1),
            },
            emphasis: {
              itemStyle: {
                color: getDataSetColorByIndex(1),
              },
            },
          })
        }
        tempList['实名帖'] = 0
        tempList['匿名帖'] = 0
      }

      sourceList.push(tempList)
    })

    return {
      totalSiteMentionsBarList: barList,
      totalSiteMentionsSourceList: sourceList,
      totalSiteMentionsDimensionsList: dimensionsList,
    }
  }

  render() {
    const {
      employerInfluenceAffectObj,
      employerInfluenceCardNumObj,
      loading,
      rights,
    } = this.props
    const {
      corporateInfluenceList,
      corporateInfluenceTitleList,
    } = this.getCorporateInfluenceData()
    const {
      contentExposureList,
      contentExposureTitleList,
    } = this.getContentExposureData()
    const {
      employeeRecognitionList,
      employeeRecognitionTitleList,
    } = this.getEmployeeRecognitionData()
    const {
      fanInteractionList,
      fanInteractionTitleList,
    } = this.getFanInteractionData()
    const {
      totalSiteMentionsBarList,
      totalSiteMentionsSourceList,
      totalSiteMentionsDimensionsList,
    } = this.getTotalSiteMentionsData()

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.firstContentStyle}>
          <EchartsTitle title={`企业影响力指数及排名`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <div style={{ marginTop: '-50px' }}>
              <BarYSimple
                dataList={corporateInfluenceList}
                titleList={corporateInfluenceTitleList}
                color="#004CFF"
              />
            </div>
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], employerInfluenceAffectObj) || '实时'}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`内容曝光度指数及排名`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <div style={{ marginTop: '-50px' }}>
              <BarYSimple
                dataList={contentExposureList}
                titleList={contentExposureTitleList}
                color="#004CFF"
              />
            </div>
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], employerInfluenceAffectObj) || '实时'}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`员工认可度指数及排名`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <div style={{ marginTop: '-50px' }}>
              <BarYSimple
                dataList={employeeRecognitionList}
                titleList={employeeRecognitionTitleList}
                color="#004CFF"
              />
            </div>
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], employerInfluenceAffectObj) || '实时'}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`粉丝互动指数及排名`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <div style={{ marginTop: '-50px' }}>
              <BarYSimple
                dataList={fanInteractionList}
                titleList={fanInteractionTitleList}
                color="#004CFF"
              />
            </div>
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-70px' }}
            date={R.pathOr('', ['cycle'], employerInfluenceAffectObj) || '实时'}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`全站提及帖量`} />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <DatasetSimple
              sourceList={totalSiteMentionsSourceList}
              barList={totalSiteMentionsBarList}
              dimensionsList={totalSiteMentionsDimensionsList}
              topFlag={true}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={
              R.pathOr('', ['cycle'], employerInfluenceCardNumObj) || '实时'
            }
          />
        </div>
      </div>
    )
  }
}
