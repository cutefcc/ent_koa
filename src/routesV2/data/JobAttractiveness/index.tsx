import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import {
  getCompanyNameByKey,
  getDataSetColorByIndex,
  companyKeyList,
} from 'utils/talentReport'
import { toPoint } from 'utils/numbers'
import BarSimple from 'componentsV3/TalentReport/Echarts/BarSimple'
import DatasetSimple from 'componentsV3/TalentReport/Echarts/DatasetSimple'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CircularProcessBar from 'components/CircularProcessBar'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  jobAttractivenessNumObj: object
  jobAttractivenessPersonObj: object
  jobAttractivenessSeeRateObj: object
  jobAttractivenessTalkObj: object
  selectPositionName: string
  loading: boolean
  rights: boolean
  compareCompanyList: Array<object>
}

export interface State {}

@connect((state: any) => ({
  jobAttractivenessNumObj: state.talentReport.jobAttractivenessNumObj,
  jobAttractivenessPersonObj: state.talentReport.jobAttractivenessPersonObj,
  jobAttractivenessSeeRateObj: state.talentReport.jobAttractivenessSeeRateObj,
  jobAttractivenessTalkObj: state.talentReport.jobAttractivenessTalkObj,
  selectPositionName: state.talentReport.selectPositionName,
  compareCompanyList: state.talentReport.compareCompanyList,
}))
export default class JobAttractiveness extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
  }

  getNumData = () => {
    const { jobAttractivenessNumObj } = this.props
    const info = R.pathOr({}, ['info'], jobAttractivenessNumObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      list.push(parseInt(R.pathOr('0', [key], info), 0))
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      numList: list,
      numTitleList: titleList,
    }
  }

  getTalkData = () => {
    const { jobAttractivenessTalkObj } = this.props
    const info = R.pathOr({}, ['info'], jobAttractivenessTalkObj)
    const list = []
    const titleList = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      list.push(parseInt(R.pathOr('0', [key], info), 0))
      titleList.push(getCompanyNameByKey(key))
    })
    return {
      talkList: list,
      talkTitleList: titleList,
    }
  }

  getTotalSiteMentionsData = () => {
    const { jobAttractivenessPersonObj } = this.props
    const info = R.pathOr({}, ['info'], jobAttractivenessPersonObj)
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
              name: R.pathOr('', ['name'], single),
              barMinHeight: 1,
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
          dimensionsList.push('查看职位')
          dimensionsList.push('表达意向')
          barList.push({
            type: 'bar',
            barGap: 0,
            color: getDataSetColorByIndex(0),
            name: '查看职位',
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
            name: '表达意向',
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
        tempList['查看职位'] = 0
        tempList['表达意向'] = 0
      }

      sourceList.push(tempList)
    })

    return {
      barList: barList,
      sourceList: sourceList,
      dimensionsList: dimensionsList,
    }
  }

  getCircularProcessBarData = () => {
    const { jobAttractivenessSeeRateObj } = this.props
    const info = R.pathOr({}, ['info'], jobAttractivenessSeeRateObj)
    const list = []
    companyKeyList.forEach(key => {
      const tempList = R.pathOr(null, [key], info)
      if (tempList === null) {
        return
      }
      if (tempList !== '') {
        list.push({
          value: toPoint(R.pathOr('', [key], info)),
          title: getCompanyNameByKey(key),
          showName: R.pathOr('', [key], info),
        })
      } else {
        list.push({
          value: 0,
          title: getCompanyNameByKey(key),
          showName: '暂无数据',
        })
      }
    })
    return list
  }

  render() {
    const {
      selectPositionName,
      jobAttractivenessNumObj,
      jobAttractivenessPersonObj,
      jobAttractivenessSeeRateObj,
      jobAttractivenessTalkObj,
      loading,
      rights,
      compareCompanyList,
    } = this.props
    const { numList, numTitleList } = this.getNumData()
    const { talkList, talkTitleList } = this.getTalkData()
    const {
      barList,
      sourceList,
      dimensionsList,
    } = this.getTotalSiteMentionsData()
    const list = this.getCircularProcessBarData()

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.firstContentStyle}>
          <EchartsTitle title={`${selectPositionName}JD发布数量`} />
          {showLoading ? (
            <CommonLoading height={'308px'} showDefault={showDefault} />
          ) : (
            <BarSimple
              dataList={numList}
              titleList={numTitleList}
              color="#004CFF"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], jobAttractivenessNumObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle
            title={`${selectPositionName}JD查看职位/表达意向人才数量`}
          />
          {showLoading ? (
            <CommonLoading height={'300px'} showDefault={showDefault} />
          ) : (
            <DatasetSimple
              sourceList={sourceList}
              barList={barList}
              dimensionsList={dimensionsList}
              topFlag={true}
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], jobAttractivenessPersonObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}JD查看转化率`} />
          {showLoading ? (
            <CommonLoading height={'222px'} showDefault={showDefault} />
          ) : (
            <div className={styles.circularProcessSimpleStyle}>
              {list &&
                list.map((item, index) => (
                  <CircularProcessBar
                    cardStyle={{
                      width: compareCompanyList.length > 3 ? '130px' : '200px',
                    }}
                    title={item.title}
                    showName={item.showName}
                    percent={item.value}
                    key={index}
                  />
                ))}
            </div>
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{
              marginTop: '-40px',
            }}
            date={R.pathOr('', ['cycle'], jobAttractivenessSeeRateObj)}
            comment="查看转化率=表达意向人数/查看职位人数"
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`企业会员达成双聊数`} />
          {showLoading ? (
            <CommonLoading height={'324px'} showDefault={showDefault} />
          ) : (
            <BarSimple
              dataList={talkList}
              titleList={talkTitleList}
              color="#004CFF"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            showDefault={showDefault}
            style={{ marginTop: '-30px' }}
            date={R.pathOr('', ['cycle'], jobAttractivenessTalkObj)}
          />
        </div>
      </div>
    )
  }
}
