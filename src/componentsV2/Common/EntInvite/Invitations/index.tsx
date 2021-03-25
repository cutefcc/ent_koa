import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import { DEFAULT_COMPANY_OPTIONS } from 'constants'
import { nFormatter, asyncExtraData } from 'utils'
import * as styles from './index.less'
import * as R from 'ramda'

export interface Props {
  visible: boolean
  onCancel: Function
  onCurrentSubscriptionChange: Function
  onShowInviteModal: Function
  onShowPopChange: Function
  invitations: object[]
  strongIntentions: object
}

export interface EntInvite {
  invitations: Array<Object>
}

export interface Loading {
  effects: Object
}

export interface GlobalState {
  entInvite: EntInvite
  loading: Loading
}

export interface State {}

@connect((state: GlobalState) => ({
  invitations: state.entInvite.invitations,
  loading: state.loading.effects['entInvite/fetch'],
  config: state.global.config,
  profession: state.global.profession,
  groupList: state.talentDiscover.groupList,
  currentUser: state.global.currentUser,
  strongIntentions: state.talentDiscover.strongIntentions,
}))
@withRouter
export default class Invitations extends React.Component<Props, State> {
  handleCombMainTitle = (item: object) => {
    const { config } = this.props
    // 标题: 关键词 / 公司1、公司n / 职位技能1、职位技能n / 城市1、城市n / 工作年限1、工作年限n
    let strArr = []
    let worktimes = R.propOr('', 'worktimes', item)
    //公司
    let companys = ''
    DEFAULT_COMPANY_OPTIONS.filter((obj) => {
      return R.propOr('', 'companys', item).split(',').includes(obj.value)
    }).forEach((obj) => {
      companys += `,${obj.label}`
    })
    if (companys) companys = companys.slice(1)
    // 工作年限
    let worktimesStr = ''
    R.propOr([], 'worktime', config)
      .filter((obj) => {
        return worktimes.split(',').includes(String(obj.value))
      })
      .forEach((obj) => {
        worktimesStr += `,${obj.label}`
      })
    if (worktimesStr) worktimesStr = worktimesStr.slice(1)

    strArr.push(
      R.propOr('', 'search_query', item), //关键词
      companys, //公司
      R.propOr('', 'positions', item), //职位技能
      R.propOr('', 'provinces', item), //城市1、城市n
      worktimesStr //工作年限
    )
    strArr = strArr.filter((str) => str !== '')
    return strArr.join('/')
  }

  handleCombSubTitle = (item: object) => {
    // 副标题: 学校1、学校n / 学历1、学历n / 行业方向1、行业方向n
    const { config, profession } = this.props
    let subTitleArr = []
    // 学校
    let schools = item.is_985 === 1 ? '985' : ''
    schools += schools
      ? item.is_211 === 1
        ? ',211'
        : ''
      : item.is_211 === 1
      ? '211'
      : ''
    if (schools) {
      schools += item.schools ? `,${item.schools}` : ''
    } else {
      schools += item.schools ? item.schools : ''
    }
    // 学历
    let degreesStr = ''
    let degrees = R.propOr('', 'degrees', item)
    R.propOr([], 'degree', config)
      .filter((obj) => {
        return degrees.split(',').includes(String(obj.value))
      })
      .forEach((obj) => {
        degreesStr += `,${obj.label}`
      })
    if (degreesStr) degreesStr = degreesStr.slice(1)
    //行业方向
    let professionsStr = ''
    let professions = R.propOr('', 'professions', item)
    profession
      .filter((obj) => {
        return professions.split(',').includes(String(obj.code))
      })
      .forEach((obj) => {
        professionsStr += `,${obj.name}`
      })
    if (professionsStr) professionsStr = professionsStr.slice(1)

    subTitleArr.push(schools, degreesStr, professionsStr)
    subTitleArr = subTitleArr.filter((str) => str !== '')
    return subTitleArr.join('/')
  }

  handleItemClick = (item: object) => {
    // 新版用
    if (this.props.isNewVersion) {
      this.props.onCurrentSubscriptionChange(item)
    } else {
      this.props.onOldVersionChange(item)
    }
  }

  handleInvitationOption = () => {
    const { groupList = [] } = this.props
    const parseList = this.parseGroupList(groupList)
    const [jobInvite] = parseList.filter((item) => {
      return item.key === 'job_invite'
    })

    const [enterpriseInvite] =
      jobInvite &&
      jobInvite.options.filter((item) => {
        return item.key === 'batch_invite'
      })
    return enterpriseInvite
  }

  parseGroupList = (vals) => {
    if (!vals || vals.length === 0) {
      return []
    }

    const res = vals.map((items) => {
      const total = R.sum(
        R.map(R.propOr(0, 'total'), R.propOr([], 'options', items))
      )
      return {
        ...items,
        total,
        formatTotal: nFormatter(total, 1),
      }
    })
    return res
  }

  renderInvitationItem = (item: object) => {
    const mainTitle = this.handleCombMainTitle(item)
    const subTitle = this.handleCombSubTitle(item)
    return (
      <div
        className={styles.invitationsConItem}
        onClick={() => this.handleItemClick(item)}
      >
        <div className={styles.mainTitleAndStatus}>
          <div className={styles.mainTitle} title={mainTitle}>
            {mainTitle}
          </div>
          <div
            className={styles.status}
            onClick={(e) => {
              this.props.onShowPopChange(false)
              this.props.onShowInviteModal(item)
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
          >
            {item.invite_state === 1 ? '人工确认中>' : '预约下发成功>'}
          </div>
        </div>
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.invitationTime}>邀约时间：{item.crtime}</div>
        <div
          className={styles.invitationReflow}
          onClick={(e) => {
            const {
              dispatch,
              isNewVersion,
              strongIntentions,
              onClear,
            } = this.props
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            if (isNewVersion) {
              const group = this.handleInvitationOption()
              dispatch({
                type: 'talentDiscover/setCurrentGroup',
                payload: group,
              })
              const list = R.pathOr([], ['strong_intentions'], strongIntentions)
              const find = R.find(R.propEq('key', R.propOr('', 'key', group)))(
                list
              )
              if (find) {
                dispatch({
                  type: 'talentDiscover/setViewedStrong',
                  payload: find,
                })
              }
              onClear()
              dispatch({
                type: 'talentDiscover/fetchData',
                payload: {},
              }).then((data) => {
                if (data) {
                  const { list = [] } = data
                  asyncExtraData(dispatch, list)
                }
              })
            } else {
              this.props.history.push(
                `${
                  this.props.currentUser.talentPoolUrl ||
                  '/ent/talents/pool/enterprise_v3'
                }?nav=comany_job_invite`
              )
            }
          }}
        >
          前往智能邀约分组查看意向回流人才
        </div>
      </div>
    )
  }

  render() {
    const { invitations = [] } = this.props
    return (
      <div className={styles.invitationsCon}>
        {invitations.map((item) => this.renderInvitationItem(item))}
      </div>
    )
  }
}
