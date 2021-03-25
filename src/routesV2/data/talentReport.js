import React, { useEffect } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'
import Menu from 'componentsV3/TalentReport/Menu'
import Filter from 'componentsV3/TalentReport/Filter'
import TalentFlow from './TalentFlow'
import EmployeePortrait from './EmployeePortrait'
import EmployeeTurnover from './EmployeeTurnover'
import EmployerInfluence from './EmployerInfluence'
import IndustryFlow from './IndustryFlow'
import InteractiveTalentPortrait from './InteractiveTalentPortrait'
import JobAttractiveness from './JobAttractiveness'
import RecruitmentPortrait from './RecruitmentPortrait'
import ReserveTalentPortraits from './ReserveTalentPortraits'
import StaffSkills from './StaffSkills'
import TalentPortrait from './TalentPortrait'
import LoadingError from 'componentsV3/TalentReport/LoadingError'
import { talentReportAuthority, defaultMenuKey } from 'utils/talentReport'

import styles from './talentReport.less'

function TalentReport(props) {
  const {
    selectMenuKey,
    dispatch,
    loading,
    loadingError,
    urlPrefix,
    talentReportVersion,
  } = props

  useEffect(() => {
    dispatch({
      type: 'talentReport/selectMenu',
      payload: {
        selectMenuKey: defaultMenuKey,
      },
    })
    dispatch({
      type: 'talentReport/fetchPosition',
    })
    dispatch({
      type: 'talentReport/fetchData',
    })
    // const rightsSet = R.pathOr(
    //   new Set([]),
    //   [talentReportVersion],
    //   talentReportAuthority
    // )
    // // 权限判断
    // if (rightsSet.has(selectMenuKey)) {
    //   dispatch({
    //     type: 'talentReport/fetchData',
    //   })
    // }
  }, [])

  const rightsSet = R.pathOr(
    new Set([]),
    [talentReportVersion],
    talentReportAuthority
  )

  const viewKeys = {
    '0-1': {
      key: '0-1',
      title: '市场行情',
      dom: <IndustryFlow loading={loading} rights={rightsSet.has('0-1')} />,
    },
    '0-2': {
      key: '0-2',
      title: '人才流动',
      dom: <TalentFlow loading={loading} rights={rightsSet.has('0-2')} />,
    },
    '0-3': {
      key: '0-3',
      title: '人才画像',
      dom: <TalentPortrait loading={loading} rights={rightsSet.has('0-3')} />,
    },
    '1-1': {
      key: '1-1',
      title: '员工流动',
      dom: <EmployeeTurnover loading={loading} rights={rightsSet.has('1-1')} />,
    },
    '1-2': {
      key: '1-2',
      title: '员工技能',
      dom: <StaffSkills loading={loading} rights={rightsSet.has('1-2')} />,
    },
    '1-3': {
      key: '1-3',
      title: '员工画像',
      dom: <EmployeePortrait loading={loading} rights={rightsSet.has('1-3')} />,
    },
    '1-4': {
      key: '1-4',
      title: '招聘人才画像',
      dom: (
        <RecruitmentPortrait loading={loading} rights={rightsSet.has('1-4')} />
      ),
    },
    '1-5': {
      key: '1-5',
      title: '储备人才画像',
      dom: (
        <ReserveTalentPortraits
          loading={loading}
          rights={rightsSet.has('1-5')}
        />
      ),
    },
    '1-6': {
      key: '1-6',
      title: '互动人才画像',
      dom: (
        <InteractiveTalentPortrait
          loading={loading}
          rights={rightsSet.has('1-6')}
        />
      ),
    },
    '1-7': {
      key: '1-7',
      title: '职位吸引力',
      dom: (
        <JobAttractiveness loading={loading} rights={rightsSet.has('1-7')} />
      ),
    },
    '1-8': {
      key: '1-8',
      title: '雇主影响力',
      dom: (
        <EmployerInfluence loading={loading} rights={rightsSet.has('1-8')} />
      ),
    },
  }

  const reloadData = () => {
    dispatch({
      type: 'talentReport/fetchData',
    })
  }

  return (
    <div className={`ent-v3-main-grid`}>
      <div className={styles.mainWrap}>
        <div className={styles.content}>
          <Row gutter={16} className={styles.row}>
            <Col span={5} className={styles.leftCol}>
              <Menu />
            </Col>
            <Col span={19} className={styles.rightCol}>
              {selectMenuKey !== '1-8' && (
                <div className={styles.rightTop}>
                  <Filter />
                </div>
              )}
              <div
                className={
                  selectMenuKey !== '1-8'
                    ? styles.rightBottom
                    : styles.rightBottomOnly
                }
              >
                {loadingError ? (
                  <LoadingError
                    urlPrefix={urlPrefix}
                    tips="加载失败，请稍后重新尝试"
                    click={reloadData}
                  />
                ) : (
                  R.pathOr(null, [selectMenuKey, 'dom'], viewKeys)
                )}
              </div>
            </Col>
          </Row>
        </div>
        <Row gutter={16} className={styles.row}>
          <Col span={5}></Col>
          <Col span={19} className={styles.rightBottomWords}>
            注：数据采集自互联网行业&nbsp;&nbsp;&nbsp;&nbsp;数据来源：脉脉数据研究院
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    selectMenuKey: state.talentReport.selectMenuKey,
    talentReportVersion: state.talentReport.talentReportVersion,
    loadingError: state.talentReport.loadingError,
    urlPrefix: state.global.urlPrefix,
    dispatch,
    loading:
      state.loading.effects['talentReport/fetchPosition'] ||
      state.loading.effects['talentReport/fetchEmployeeTurnover'] ||
      state.loading.effects['talentReport/fetchEmployeePortraitNum'] ||
      state.loading.effects['talentReport/fetchEmployeePortraitEdu'] ||
      state.loading.effects['talentReport/fetchEmployeePortraitSchool'] ||
      state.loading.effects['talentReport/fetchEmployeePortraitWorkYear'] ||
      state.loading.effects['talentReport/fetchEmployeePortraitLength'] ||
      state.loading.effects['talentReport/fetchEmployeeTurnoverrRatio'] ||
      state.loading.effects['talentReport/fetchEmployeeTurnoverrEntrySource'] ||
      state.loading.effects['talentReport/fetchEmployeeTurnoverrFlowLeave'] ||
      state.loading.effects['talentReport/fetchEmployerInfluenceAffect'] ||
      state.loading.effects['talentReport/fetchEmployerInfluenceCardNum'] ||
      state.loading.effects['talentReport/fetchInteractiveTalentPortraitNum'] ||
      state.loading.effects['talentReport/fetchInteractiveTalentPortraitEdu'] ||
      state.loading.effects[
        'talentReport/fetchInteractiveTalentPortraitSchool'
      ] ||
      state.loading.effects[
        'talentReport/fetchInteractiveTalentPortraitWorkYear'
      ] ||
      state.loading.effects['talentReport/fetchRecruitmentPortraitNum'] ||
      state.loading.effects['talentReport/fetchRecruitmentPortraitEdu'] ||
      state.loading.effects['talentReport/fetchRecruitmentPortraitSchool'] ||
      state.loading.effects['talentReport/fetchRecruitmentPortraitWorkYear'] ||
      state.loading.effects['talentReport/fetchReserveTalentPortraitsNum'] ||
      state.loading.effects['talentReport/fetchReserveTalentPortraitsEdu'] ||
      state.loading.effects['talentReport/fetchReserveTalentPortraitsSchool'] ||
      state.loading.effects[
        'talentReport/fetchReserveTalentPortraitsWorkYear'
      ] ||
      state.loading.effects['talentReport/fetchJobAttractivenessNum'] ||
      state.loading.effects['talentReport/fetchJobAttractivenessPerson'] ||
      state.loading.effects['talentReport/fetchJobAttractivenessSeeRate'] ||
      state.loading.effects['talentReport/fetchIndustryFlowSeeker'] ||
      state.loading.effects['talentReport/fetchIndustryFlowRecruit'] ||
      state.loading.effects['talentReport/fetchTalentFlowPersonInflow'] ||
      state.loading.effects['talentReport/fetchTalentFlowPersonOutflow'] ||
      state.loading.effects[
        'talentReport/fetchTalentFlowPersonIndustryInflow'
      ] ||
      state.loading.effects[
        'talentReport/fetchTalentFlowPersonIndustryOutflow'
      ] ||
      state.loading.effects['talentReport/fetchTalentPortraitNum'] ||
      state.loading.effects['talentReport/fetchTalentPortraitEdu'] ||
      state.loading.effects['talentReport/fetchTalentPortraitSchool'] ||
      state.loading.effects['talentReport/fetchTalentPortraitWorkYear'] ||
      state.loading.effects['talentReport/fetchTalentPortraitJob'] ||
      state.loading.effects['talentReport/fetchJobAttractivenessTalk'],
  }))(TalentReport)
)
