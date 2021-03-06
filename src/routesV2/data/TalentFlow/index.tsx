import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import {
  industryKeyList,
  cityKeyList,
  defaultMinBarOutNum,
} from 'utils/talentReport'
import BarXCategoryInverseStack from 'componentsV3/TalentReport/Echarts/BarXCategoryInverseStack'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'
import EchartsBottom from 'componentsV3/TalentReport/EchartsBottom'
import CommonTips from 'componentsV3/TalentReport/CommonTips'
import CommonLoading from 'componentsV3/TalentReport/CommonLoading'

export interface Props {
  dispatch?: (obj: object) => any
  talentFlowPersonInflowObj: object
  talentFlowPersonOutflowObj: object
  talentFlowPersonIndustryInflowObj: object
  talentFlowPersonIndustryOutflowObj: object
  selectPositionName: string
  compareCompanyList: Array<object>
  loading: boolean
  rights: boolean
}

export interface State {}

@connect((state: any) => ({
  talentFlowPersonInflowObj: state.talentReport.talentFlowPersonInflowObj,
  talentFlowPersonOutflowObj: state.talentReport.talentFlowPersonOutflowObj,
  talentFlowPersonIndustryInflowObj:
    state.talentReport.talentFlowPersonIndustryInflowObj,
  talentFlowPersonIndustryOutflowObj:
    state.talentReport.talentFlowPersonIndustryOutflowObj,
  selectPositionName: state.talentReport.selectPositionName,
  compareCompanyList: state.talentReport.compareCompanyList,
}))
export default class TalentFlow extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getHorintalBar = (data, city) => {
    const originInfo = R.pathOr({}, ['info'], data)
    const worktimeMaps = {}
    const tempFilter = city ? cityKeyList : industryKeyList
    tempFilter.forEach(key => {
      const temp = R.pathOr(null, [key], originInfo)
      if (temp === null) {
        return
      }
      if (temp.length > 0) {
        originInfo[key].map(({ name, per }, index) => {
          const temp = parseFloat(per.replace('%', ''))
          if (worktimeMaps[index] && worktimeMaps[index].info) {
            worktimeMaps[index].info[key] = {
              value: temp < 5 ? temp + defaultMinBarOutNum : temp,
              name: key === name ? '' : name,
              isMin: temp < 5,
            }
          } else {
            worktimeMaps[index] = {}
            worktimeMaps[index].info = {}
            worktimeMaps[index].info[key] = {
              value: temp < 5 ? temp + defaultMinBarOutNum : temp,
              name: key === name ? '' : name,
              isMin: temp < 5,
            }
          }
        })

        // ??????????????????
        const temp = city ? 6 : 3
        if (originInfo[key].length < temp) {
          for (let i = originInfo[key].length; i <= temp; i++) {
            if (worktimeMaps[i] && worktimeMaps[i].info) {
              worktimeMaps[i].info[key] = {
                value: 0,
                name: '',
              }
            } else {
              worktimeMaps[i] = {}
              worktimeMaps[i].info = {}
              worktimeMaps[i].info[key] = {
                value: 0,
                name: '',
              }
            }
          }
        }
      } else if (temp.length === 0) {
        // ?????????
        worktimeMaps[0] = worktimeMaps[0] || {}
        worktimeMaps[0].info = worktimeMaps[0].info || {}
        worktimeMaps[0].info[key] = '????????????'
        worktimeMaps[1] = worktimeMaps[1] || {}
        worktimeMaps[1].info = worktimeMaps[1].info || {}
        worktimeMaps[1].info[key] = '????????????'
        worktimeMaps[2] = worktimeMaps[2] || {}
        worktimeMaps[2].info = worktimeMaps[2].info || {}
        worktimeMaps[2].info[key] = '????????????'
        worktimeMaps[3] = worktimeMaps[3] || {}
        worktimeMaps[3].info = worktimeMaps[3].info || {}
        worktimeMaps[3].info[key] = '????????????'
        if (city) {
          worktimeMaps[4] = worktimeMaps[4] || {}
          worktimeMaps[4].info = worktimeMaps[4].info || {}
          worktimeMaps[4].info[key] = '????????????'
          worktimeMaps[5] = worktimeMaps[5] || {}
          worktimeMaps[5].info = worktimeMaps[5].info || {}
          worktimeMaps[5].info[key] = '????????????'
          worktimeMaps[6] = worktimeMaps[6] || {}
          worktimeMaps[6].info = worktimeMaps[6].info || {}
          worktimeMaps[6].info[key] = '????????????'
          worktimeMaps[7] = worktimeMaps[7] || {}
          worktimeMaps[7].info = worktimeMaps[7].info || {}
          worktimeMaps[7].info[key] = '????????????'
        }
      }
    })

    // ??????????????????
    worktimeMaps[Object.keys(worktimeMaps).length] = worktimeMaps[0]
    delete worktimeMaps[0]

    const series = []
    let title = []
    Object.keys(worktimeMaps).forEach((key, index) => {
      if (worktimeMaps[key].info) {
        if (index === 0) {
          title = Object.keys(worktimeMaps[key].info).map(k => k)
        }
        const data = Object.values(worktimeMaps[key].info).map(item => {
          if (item === '????????????') {
            return {
              name: '????????????',
              value: 0.01, // ??????????????????inverse??????barMinHeight???????????????
            }
          } else {
            return item
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
      title,
      barList: city
        ? ['Top1', 'Top2', 'Top3', 'Top4', 'Top5', '??????']
        : ['Top1', 'Top2', 'Top3', '??????'],
    }
  }

  render() {
    const {
      talentFlowPersonInflowObj,
      talentFlowPersonOutflowObj,
      talentFlowPersonIndustryInflowObj,
      talentFlowPersonIndustryOutflowObj,
      selectPositionName,
      loading,
      rights,
    } = this.props

    const worktimeDataInflow = this.getHorintalBar(
      talentFlowPersonInflowObj,
      true
    )

    const worktimeDataOutflow = this.getHorintalBar(
      talentFlowPersonOutflowObj,
      true
    )

    const worktimeDataIndustryInflow = this.getHorintalBar(
      talentFlowPersonIndustryInflowObj,
      false
    )

    const worktimeDataIndustryOutflow = this.getHorintalBar(
      talentFlowPersonIndustryOutflowObj,
      false
    )

    const showDefault = !rights
    const showLoading = loading || showDefault

    return (
      <div className={styles.main}>
        <CommonTips />
        <div className={styles.firstContentStyle}>
          <EchartsTitle
            title={`${selectPositionName}????????????????????????????????????`}
          />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={'522px'}
              marginBottom={'24px'}
            />
          ) : (
            <BarXCategoryInverseStack
              topFlag={true}
              data={worktimeDataInflow}
              color="#004CFF"
              inout="in"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            comment="????????????=????????????????????????/??????????????????????????????????????????"
            showDefault={showDefault}
            style={{ marginTop: '-65px', marginBottom: '30px' }}
            date={R.pathOr('', ['cycle'], talentFlowPersonInflowObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}??????????????????????????????`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={'522px'}
              marginBottom={'24px'}
            />
          ) : (
            <BarXCategoryInverseStack
              topFlag={true}
              data={worktimeDataOutflow}
              color="#004CFF"
              inout="out"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            comment="????????????=????????????????????????/??????????????????????????????????????????"
            showDefault={showDefault}
            style={{ marginTop: '-65px', marginBottom: '30px' }}
            date={R.pathOr('', ['cycle'], talentFlowPersonOutflowObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}???????????????????????????`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={'522px'}
              marginBottom={'24px'}
            />
          ) : (
            <BarXCategoryInverseStack
              topFlag={true}
              data={worktimeDataIndustryInflow}
              color="#004CFF"
              inout="in"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            comment="????????????=????????????????????????/??????????????????????????????????????????"
            showDefault={showDefault}
            style={{ marginTop: '-65px', marginBottom: '30px' }}
            date={R.pathOr('', ['cycle'], talentFlowPersonIndustryInflowObj)}
          />
        </div>
        <div className={styles.commonContentStyle}>
          <EchartsTitle title={`${selectPositionName}???????????????????????????`} />
          {showLoading ? (
            <CommonLoading
              showDefault={showDefault}
              height={'522px'}
              marginBottom={'24px'}
            />
          ) : (
            <BarXCategoryInverseStack
              topFlag={true}
              data={worktimeDataIndustryOutflow}
              color="#004CFF"
              inout="out"
            />
          )}
          <EchartsBottom
            loading={showLoading}
            comment="????????????=????????????????????????/??????????????????????????????????????????"
            showDefault={showDefault}
            style={{ marginTop: '-65px', marginBottom: '30px' }}
            date={R.pathOr('', ['cycle'], talentFlowPersonIndustryOutflowObj)}
          />
        </div>
      </div>
    )
  }
}
