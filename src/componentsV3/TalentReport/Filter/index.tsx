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

    // 打点
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      position_code: R.pathOr('', ['target', 'value'], e),
      active_code: selectMenuKey === '1-4' ? selectActiveCode : '',
    }
    this.trackClickEvent('jobs_pc_talent_report_select_checkbox', param)

    // 权限判断
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

    // 打点
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      position_code: selectPositionCode,
      active_code: R.pathOr('', ['target', 'value'], e),
    }
    this.trackClickEvent('jobs_pc_talent_report_select_checkbox', param)

    // 权限判断
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

  // 名词注释hover显示回调
  onVisibleChange = (visible) => {
    if (visible) {
      // 打点
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        type: 'noun_notes',
      }
      this.trackClickEvent('jobs_pc_talent_report_hover_help', param)
    }
  }

  // 核心岗位hover显示回调
  onVisibleChangeCorePosition = (visible) => {
    if (visible) {
      // 打点
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        type: 'core_position',
      }
      this.trackClickEvent('jobs_pc_talent_report_hover_help', param)
    }
  }

  // 求职行为hover显示回调
  onVisibleChangeActive = (visible) => {
    if (visible) {
      // 打点
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
      .join('、')

    const cannotSelect = isJobCheckBox !== 1

    return (
      <div className={styles.main}>
        <div className={styles.rightTips}>
          名词注释&nbsp;
          <Popover
            autoAdjustOverflow={true}
            placement="bottomRight"
            onVisibleChange={this.onVisibleChange}
            content={
              <div className={styles.hoverContent}>
                {this.getMenuTips()}
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>全行业</div>
                  <div className={styles.hoverContentItemRight}>
                    全行业包含互联网行业所有公司
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>头部大厂</div>
                  <div className={styles.hoverContentItemRight}>
                    头部大厂包含百度、京东、贝壳找房、猿辅导、快手、宜信、美团外卖、字节跳动、美团点评、滴滴、商汤科技、科大讯飞、OPPO、腾讯、华为、360、拼多多、涂鸦智能、阿里巴巴、网易
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>本团队</div>
                  <div className={styles.hoverContentItemRight}>
                    本团队包含人才银行管理员及其下全部子账号
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>对比公司</div>
                  <div className={styles.hoverContentItemRight}>
                    对比公司包含{companyName}
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>名校</div>
                  <div className={styles.hoverContentItemRight}>
                    名校包含国内985、211及海外Top500院校
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>求职者</div>
                  <div className={styles.hoverContentItemRight}>
                    求职者指脉脉平台有求职意向的用户，包括但不限于对企业/职位表示可以聊、接受职位邀约、主动投递及正向响应雇主的虚拟电话或明确带有招聘属性的IM对话等
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>招聘人才</div>
                  <div className={styles.hoverContentItemRight}>
                    招聘人才指对管理员及其下全部子账号发布的职位有过求职行为的人才
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>储备人才</div>
                  <div className={styles.hoverContentItemRight}>
                    储备人才指企业储备+管理员及其下全部子账号的个人储备
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>互动人才</div>
                  <div className={styles.hoverContentItemRight}>
                    互动人才指企业号粉丝，或转发、评论、点赞、访问企业号动态的人才
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>职位吸引力</div>
                  <div className={styles.hoverContentItemRight}>
                    职位吸引力中职位指管理员及其下全部子账号发布的职位
                  </div>
                </div>
                <div className={styles.hoverContentItem}>
                  <div className={styles.hoverContentItemLeft}>双聊</div>
                  <div className={styles.hoverContentItemRight}>
                    双聊指在招聘场、求职方知道招聘方在和自己沟通、招聘方也知道求职方在和自己沟通，沟通场景包含立即沟通、虚拟电话、极速联系、IM聊天
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
              核心岗位&nbsp;
              <Popover
                autoAdjustOverflow={false}
                placement="bottom"
                onVisibleChange={this.onVisibleChangeCorePosition}
                content={
                  <div className={styles.hoverContent}>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        核心岗位
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        包含研发、产品、运营、销售、人力、测试、设计、数据、商务/渠道、市场营销/品牌/公关
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
              求职行为&nbsp;
              <Popover
                autoAdjustOverflow={false}
                placement="bottom"
                onVisibleChange={this.onVisibleChangeActive}
                content={
                  <div className={styles.hoverContent}>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        查看职位
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        查看职位详情
                      </div>
                    </div>
                    <div className={styles.hoverContentItem}>
                      <div className={styles.hoverContentItemLeft}>
                        表达意向
                      </div>
                      <div className={styles.hoverContentItemRight}>
                        投递职位，或对职位表达可以聊、等待招聘方主动聊一聊
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
                showName="查看职位"
              >
                <span className={styles.selectStyle}>查看职位</span>
              </Radio>
              <Radio
                disabled={loading || cannotSelect}
                value={'2'}
                style={{ marginRight: '15px' }}
                showName="表达意向"
              >
                <span className={styles.selectStyle}>表达意向</span>
              </Radio>
            </Radio.Group>
          </div>
        ) : null}
      </div>
    )
  }
}
