import * as React from 'react'
import * as R from 'ramda'
import { Radio, Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import * as styles from './index.less'
import { connect } from 'react-redux'
import {
  getReportTips,
  getReportMenuName,
  talentReportAuthority,
} from 'utils/talentReport'

export interface Props {
  dispatch?: (obj: object) => any
  selectMenuKey: string
  positionObj: object
  selectPositionCode: string
  selectPositionName: string
  selectActiveCode: string
  selectActiveName: string
  compareCompanyList: Array<object>
  loading: boolean
  isJobCheckBox: number
  talentReportVersion: number
}

export interface State {}

@connect((state: any) => ({
  selectMenuKey: state.talentReport.selectMenuKey,
  positionObj: state.talentReport.positionObj,
  selectPositionCode: state.talentReport.selectPositionCode,
  selectPositionName: state.talentReport.selectPositionName,
  selectActiveCode: state.talentReport.selectActiveCode,
  selectActiveName: state.talentReport.selectActiveName,
  compareCompanyList: state.talentReport.compareCompanyList,
  isJobCheckBox: state.talentReport.isJobCheckBox,
  talentReportVersion: state.talentReport.talentReportVersion,
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
    state.loading.effects['talentReport/fetchReserveTalentPortraitsWorkYear'] ||
    state.loading.effects['talentReport/fetchJobAttractivenessNum'] ||
    state.loading.effects['talentReport/fetchJobAttractivenessPerson'] ||
    state.loading.effects['talentReport/fetchJobAttractivenessSeeRate'] ||
    state.loading.effects['talentReport/fetchIndustryFlowSeeker'] ||
    state.loading.effects['talentReport/fetchIndustryFlowRecruit'] ||
    state.loading.effects['talentReport/fetchTalentFlowPersonInflow'] ||
    state.loading.effects['talentReport/fetchTalentFlowPersonOutflow'] ||
    state.loading.effects['talentReport/fetchTalentFlowPersonIndustryInflow'] ||
    state.loading.effects[
      'talentReport/fetchTalentFlowPersonIndustryOutflow'
    ] ||
    state.loading.effects['talentReport/fetchTalentPortraitNum'] ||
    state.loading.effects['talentReport/fetchTalentPortraitEdu'] ||
    state.loading.effects['talentReport/fetchTalentPortraitSchool'] ||
    state.loading.effects['talentReport/fetchTalentPortraitWorkYear'] ||
    state.loading.effects['talentReport/fetchTalentPortraitJob'] ||
    state.loading.effects['talentReport/fetchJobAttractivenessTalk'],
}))
export default class Filter extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  trackClickEvent = (eventName, param) => {
    if (window.voyager) {
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  handlePositionRadioChange = (e) => {
    const {
      loading,
      selectMenuKey,
      selectActiveCode,
      selectActiveName,
      dispatch,
      talentReportVersion,
    } = this.props
    if (loading) {
      return
    }

    // ??????
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      position_code: R.pathOr('', ['target', 'value'], e),
      active_code: selectMenuKey === '1-4' ? selectActiveCode : '',
    }
    this.trackClickEvent('jobs_pc_talent_report_select_checkbox', param)

    // ????????????
    const rightsSet = R.pathOr(
      new Set([]),
      [talentReportVersion],
      talentReportAuthority
    )
    if (rightsSet.has(selectMenuKey)) {
      dispatch({
        type: 'talentReport/fetchData',
        payload: {
          code: R.pathOr('', ['target', 'value'], e),
          name: R.pathOr('', ['target', 'showName'], e),
          isFilter: true,
        },
      })
    } else {
      dispatch({
        type: 'talentReport/setSelectCode',
        payload: {
          selectPositionCode: R.pathOr('', ['target', 'value'], e),
          selectPositionName: R.pathOr('', ['target', 'showName'], e),
          selectActiveCode: selectActiveCode,
          selectActiveName: selectActiveName,
        },
      })
    }
  }

  handleActiveRadioChange = (e) => {
    const {
      loading,
      selectPositionCode,
      selectPositionName,
      dispatch,
      selectMenuKey,
      talentReportVersion,
    } = this.props
    if (loading) {
      return
    }

    // ??????
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      position_code: selectPositionCode,
      active_code: R.pathOr('', ['target', 'value'], e),
    }
    this.trackClickEvent('jobs_pc_talent_report_select_checkbox', param)

    // ????????????
    const rightsSet = R.pathOr(
      new Set([]),
      [talentReportVersion],
      talentReportAuthority
    )
    if (rightsSet.has(selectMenuKey)) {
      dispatch({
        type: 'talentReport/fetchData',
        payload: {
          active: R.pathOr('', ['target', 'value'], e),
          activeName: R.pathOr('', ['target', 'showName'], e),
          isFilter: true,
        },
      })
    } else {
      dispatch({
        type: 'talentReport/setSelectCode',
        payload: {
          selectPositionCode: selectPositionCode,
          selectPositionName: selectPositionName,
          selectActiveCode: R.pathOr('', ['target', 'value'], e),
          selectActiveName: R.pathOr('', ['target', 'showName'], e),
        },
      })
    }
  }

  getMenuTips = () => {
    const { selectMenuKey } = this.props
    const tips = getReportTips(selectMenuKey)
    if (!tips) {
      return null
    }

    return (
      <div className={styles.hoverContentItem}>
        <div className={styles.hoverContentItemLeft}>
          {getReportMenuName(selectMenuKey)}
        </div>
        <div className={styles.hoverContentItemRight}>{tips}</div>
      </div>
    )
  }

  // ????????????hover????????????
  onVisibleChange = (visible) => {
    if (visible) {
      // ??????
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        type: 'noun_notes',
      }
      this.trackClickEvent('jobs_pc_talent_report_hover_help', param)
    }
  }

  // ????????????hover????????????
  onVisibleChangeCorePosition = (visible) => {
    if (visible) {
      // ??????
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        type: 'core_position',
      }
      this.trackClickEvent('jobs_pc_talent_report_hover_help', param)
    }
  }

  // ????????????hover????????????
  onVisibleChangeActive = (visible) => {
    if (visible) {
      // ??????
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        type: 'job_hunting',
      }
      this.trackClickEvent('jobs_pc_talent_report_hover_help', param)
    }
  }

  render() {
    const {
      positionObj,
      selectPositionCode,
      loading,
      selectMenuKey,
      selectActiveCode,
      compareCompanyList,
      isJobCheckBox,
    } = this.props

    const companyName = compareCompanyList
      .map((item) => R.pathOr('', ['name'], item))
      .join('???')

    const cannotSelect = isJobCheckBox !== 1

    return (
      <div className={styles.main}>
        <div className={styles.rightTips}>
          ????????????&nbsp;
          <Popover
            autoAdjustOverflow={true}
            placement="bottomRight"
            onVisibleChange={this.onVisibleChange}
            content={
              <div className={styles.hoverContent}>
                {this.getMenuTips()}
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>?????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ??????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????OPPO?????????????????????360???????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>?????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ????????????????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ??????????????????{companyName}
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>??????</div>
                  <div className={styles.hoverContentItemRight}>
                    ??????????????????985???211?????????Top500??????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>?????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ??????????????????????????????????????????????????????????????????????????????/???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????IM?????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ?????????????????????????????????????????????????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ???????????????????????????+????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ?????????????????????????????????????????????????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>???????????????</div>
                  <div className={styles.hoverContentItemRight}>
                    ???????????????????????????????????????????????????????????????????????????
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>??????</div>
                  <div className={styles.hoverContentItemRight}>
                    ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????IM??????
                  </div>
                </div>
              </div>
            }
            trigger={'hover'}
          >
            <QuestionCircleOutlined style={{ color: '#b1b6c1' }} />
          </Popover>
        </div>
        {selectMenuKey !== '1-8' ? (
          <div>
            <span className={styles.showTitleStyle}>
              ????????????&nbsp;
              <Popover
                autoAdjustOverflow={false}
                placement="bottom"
                onVisibleChange={this.onVisibleChangeCorePosition}
                content={
                  <div className={styles.hoverContent}>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        ????????????
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        ????????????????????????????????????????????????????????????????????????????????????/?????????????????????/??????/??????
                      </div>
                    </div>
                  </div>
                }
                trigger={'hover'}
              >
                <QuestionCircleOutlined style={{ color: '#b1b6c1' }} />
              </Popover>
            </span>
            <Radio.Group
              onChange={this.handlePositionRadioChange}
              value={selectPositionCode}
            >
              {Object.keys(positionObj).map((key) => (
                <Radio
                  disabled={loading || cannotSelect}
                  key={R.pathOr('', [key, 'code'], positionObj)}
                  value={R.pathOr('', [key, 'code'], positionObj)}
                  style={{ marginRight: '15px' }}
                  showName={key}
                >
                  <span className={styles.selectStyle}>{key}</span>
                </Radio>
              ))}
            </Radio.Group>
          </div>
        ) : null}
        {selectMenuKey === '1-4' ? (
          <div className={styles.secondSelectContentStyle}>
            <span className={styles.showTitleStyle}>
              ????????????&nbsp;
              <Popover
                autoAdjustOverflow={false}
                placement="bottom"
                onVisibleChange={this.onVisibleChangeActive}
                content={
                  <div className={styles.hoverContent}>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        ????????????
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        ??????????????????
                      </div>
                    </div>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        ????????????
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        ???????????????????????????????????????????????????????????????????????????
                      </div>
                    </div>
                  </div>
                }
                trigger={'hover'}
              >
                <QuestionCircleOutlined style={{ color: '#b1b6c1' }} />
              </Popover>
            </span>
            <Radio.Group
              onChange={this.handleActiveRadioChange}
              value={selectActiveCode}
            >
              <Radio
                disabled={loading || cannotSelect}
                value={'1'}
                style={{ marginRight: '15px' }}
                showName="????????????"
              >
                <span className={styles.selectStyle}>????????????</span>
              </Radio>
              <Radio
                disabled={loading || cannotSelect}
                value={'2'}
                style={{ marginRight: '15px' }}
                showName="????????????"
              >
                <span className={styles.selectStyle}>????????????</span>
              </Radio>
            </Radio.Group>
          </div>
        ) : null}
      </div>
    )
  }
}
