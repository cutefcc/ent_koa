import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import { checkIsTrial, getModuleName, getFr } from 'utils'
import { asyncExtraData, asyncExtraDataNew } from 'utils/index'
import { uidsUploader } from 'utils/hoc'
import {
  INIT_ADVANCE_SEARCH,
  INIT_ADVANCE_SEARCH_PRO,
  TABTYPEMAP,
} from 'constants/talentDiscover'
import Card from 'componentsV2/Common/TalentCard/CommonCardWithTrack'
import CompanyFansHoverEmpty from 'componentsV3/CompanyFansHover/CompanyFansHoverEmpty'

import * as styles from './index.less'
// const module = getModuleName() 此处调用的话只会执行一次，不能随着类的创建重新取值

export interface Props {
  className: string
  selectedIds: Array<Object>
  checkboxGroup: Array<Object>
  onSelectedItemsChange: Function
  urlPrefix: string
  currentTab: string
  scrollDom: HTMLBaseElement
  polarisVariables: object
}

export interface State {
  scrollDom: object
}

interface talentDiscoverState {
  paginationParam: object
  talentList: Array<Object>
  sid: string
  currentGroup: object
  advancedSearch: object
  currentTab: string
  debouncingFlag: boolean
}

interface groupsState {
  currentGroup: object
}

interface subscribeState {
  currCondition: object
}

interface loadingState {
  effects: Object
}

interface globalStoreState {
  currentUser: Object
  urlPrefix: string
  realPathname: string
  jobs: Array<Object>
}

interface companyFansState {
  rate: string
}

interface GlobalState {
  talentDiscover: talentDiscoverState
  groups: groupsState
  subscribe: subscribeState
  loading: loadingState
  global: globalStoreState
  companyFans: companyFansState
}

@connect((state: GlobalState) => ({
  // talentList: state.talentDiscover.talentList,
  currentUser: state.global.currentUser,
  realPathname: state.global.realPathname,
  sid: state.talentDiscover.sid,
  advancedSearch: state.talentDiscover.advancedSearch,
  currentGroup: state.groups.currentGroup,
  loading: state.loading.effects[`${getModuleName()}/fetchData`],
  debouncingFlag: state[`${getModuleName()}`]
    ? state[`${getModuleName()}`].debouncingFlag
    : state.talentDiscover.debouncingFlag,
  urlPrefix: state.global.urlPrefix,
  currentTab: state[`${getModuleName()}`]
    ? state[`${getModuleName()}`].currentTab
    : state.talentDiscover.currentTab,
  jobs: state.global.jobs,
  paginationParam: state.talentDiscover.paginationParam,
  rate: state.companyFans.rate,
  currCondition: state.subscribe.currCondition,
  polarisVariables: state.global.polarisVariables,
}))
@uidsUploader({ rootSelector: '#talentList', selector: '.talent-common-card' })
export default class TalentList extends React.PureComponent<
  Props & talentDiscoverState & loadingState & GlobalState & globalStoreState,
  State
> {
  constructor(props) {
    super(props)
    this.state = {
      scrollDom: null,
    }
  }

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
    })
  }

  componentDidMount() {
    window.broadcast.bind('addFriendSuccess', this.handleAddFriendSuccess)
    window.broadcast.bind('askForPhoneSuccess', this.handleAskForPhoneSuccess)
    window.broadcast.bind(
      'connectForPhoneSuccess',
      this.handleConnectForPhoneSuccess
    )
    window.broadcast.bind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.bind(
      'directContactSuccess',
      this.handleDirectContactSuccess
    )
  }

  // handleAiCallFinish = () => {}
  componentWillUnmount() {
    window.broadcast.unbind('addFriendSuccess', this.handleAddFriendSuccess)
    window.broadcast.unbind('askForPhoneSuccess', this.handleAskForPhoneSuccess)
    window.broadcast.unbind(
      'connectForPhoneSuccess',
      this.handleConnectForPhoneSuccess
    )
    window.broadcast.unbind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.unbind(
      'directContactSuccess',
      this.handleDirectContactSuccess
    )
  }

  resetData = (data) => {
    // const { realPathname } = this.props
    // const moduleName = getModuleName(realPathname)
    const moduleName = getModuleName(window.location.pathname)
    const type = `${moduleName}/setTalentList`
    this.props.dispatch({
      type,
      payload: data,
    })
  }

  handleAddFriendSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map((talent) =>
      uids.includes(talent.id) ? { ...talent, friend_state: 1 } : talent
    )
    this.resetData(data)
  }

  handleAskForPhoneSuccess = (uid) => {
    const { talentList } = this.props
    const data = talentList.map((talent) =>
      uid === talent.id
        ? {
            ...talent,
            call_state: 1,
            call_state_new: 1,
            call_tip_new: '虚拟电话索要中',
            call_tip: '虚拟电话索要中',
          }
        : talent
    )
    this.resetData(data)
  }

  handleConnectForPhoneSuccess = (uid) => {
    const { talentList } = this.props
    const data = talentList.map((talent) =>
      uid === talent.id
        ? { ...talent, call_state: 2, call_state_new: 2 }
        : talent
    )
    this.resetData(data)
  }

  handleDirectImSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map((talent) =>
      uids.includes(talent.id) ? { ...talent, is_direct_im: 1 } : talent
    )
    this.resetData(data)
  }

  handleDirectContactSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map((talent) =>
      uids.includes(talent.id) ? { ...talent, recent_dc_chat: 1 } : talent
    )
    this.resetData(data)
  }

  handleOpFinish = (type: string, data: object, res: any) => {
    const { talentList } = this.props
    // 完成加好友操作
    // if (type == 'addFriend') {
    //   const formatData = R.compose(R.groupBy(R.prop('errorcode')))(res || [])
    //   const successIds = R.propOr([], 0, formatData).map(R.prop('to_uid'))
    //   const data = talentList.map(talent => (
    //     successIds.includes(talent.id) ? {...talent, friend_state: 1} : talent
    //   ))
    //   this.resetData(data)
    // }

    // 完成极速联系操作
    // if (type === 'directIm') {
    //   const formatData = R.compose(R.groupBy(R.prop('errorcode')))(res || [])
    //   const successIds = R.propOr([], 0, formatData).map(R.prop('to_uid'))
    //   const data = talentList.map(talent => (
    //     successIds.includes(talent.id) ? {...talent, is_direct_im: 1} : talent
    //   ))
    //   this.resetData(data)
    // }

    // 设置候选人是否合适的状态
    if (type === 'setState') {
      // talentListRes = talentList.filter(talent => (
      //   talent.id !== data.id
      // ))
      const list = talentList.filter((talent) => talent.id !== data.id)

      /**
       * because update group is async in backend
       * the delay time is not sure
       * so front end should fetch data twice to ensure group num is consistent with the actual situation
       */
      setTimeout(this.fetchNavigator, 2000)
      setTimeout(this.fetchNavigator, 5000)

      this.resetData(list)
    }
  }

  handleSelect = (id: number) => (selected: boolean) => {
    const { selectedIds } = this.props
    const res = selected ? [...selectedIds, id] : R.without([id], selectedIds)
    this.props.onSelectedItemsChange(res)
  }

  handleSetScrollDom = (scrollDom) => {
    this.setState({
      scrollDom,
    })
  }

  handleJobClick = (item) => () => {
    const { polarisVariables, dispatch } = this.props
    const search_basic_v3_switch = R.pathOr(
      'a',
      ['search_basic_v3_switch'],
      polarisVariables
    )
    dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...this.props.advancedSearch,
        positions: R.propOr('', 'position', item),
      },
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: { data_version: '3.0' },
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        if (search_basic_v3_switch === 'b') {
          asyncExtraDataNew(dispatch, list)
        } else {
          asyncExtraData(dispatch, list)
        }
      }
    })
  }

  renderEmptyImg = (currAdvancedSearchIsBlank, talentListIsBlank) => {
    const hasJobs = this.props.jobs.length > 0
    let src = `${this.props.urlPrefix}/images/empty_subscription.png`
    if (getModuleName() === 'talentDiscover') {
      if (currAdvancedSearchIsBlank) {
        src = `${this.props.urlPrefix}/images/talent_search_blank1.png`
      }
    }
    return <img src={src} alt="emptyImage" className={styles.emptyImage} />
  }

  renderJobsSelection = () => {
    const hasJobs = this.props.jobs.length > 0
    return (
      <div>
        {hasJobs ? (
          <p>
            {this.props.jobs.slice(0, 3).map((item) => (
              <span
                className={styles.jobTag}
                key={item.id}
                onClick={this.handleJobClick(item)}
              >
                {item.position}
              </span>
            ))}
          </p>
        ) : (
          <p className={styles.guideButtonText}>
            按职位、技能、公司等条件搜索人才
          </p>
        )}
      </div>
    )
  }

  renderGuide = (currAdvancedSearchIsBlank, talentListIsBlank, isFans) => {
    const { currentTab } = this.props
    const map = {
      talent: '暂无匹配人才',
      dynamic: '暂无匹配动态',
    }
    const moduleMap = ['subscribe', 'groups']
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>
            {this.renderEmptyImg(currAdvancedSearchIsBlank, talentListIsBlank)}
          </p>
        </div>
        {getModuleName() === 'talentDiscover' &&
          currAdvancedSearchIsBlank &&
          this.renderJobsSelection()}
        {getModuleName() === 'talentDiscover' &&
          !currAdvancedSearchIsBlank &&
          talentListIsBlank && (
            <p
              className={
                isFans ? styles.guideButtonTextV3 : styles.guideButtonText
              }
            >
              {map[currentTab]}
            </p>
          )}
        {moduleMap.includes(getModuleName()) && (
          <p
            className={
              isFans ? styles.guideButtonTextV3 : styles.guideButtonText
            }
          >
            {map[currentTab]}
          </p>
        )}
        {isFans && <CompanyFansHoverEmpty />}
      </div>
    )
  }

  renderList = () => {
    const {
      talentList = [],
      selectedIds,
      currentGroup,
      paginationParam,
      currentTab,
    } = this.props
    const isInappropriate = currentGroup.key === 'inappropriate'
    const isBank = !R.isEmpty(currentGroup)
    const isTrial = checkIsTrial()
    // 判断左边的高级搜索是否为空（JSON.stringify不是很好的办法，后续可以写一个util方法判断两个对象是否一致）
    const currAdvancedSearchIsBlank =
      JSON.stringify(this.props.advancedSearch) ===
        JSON.stringify(INIT_ADVANCE_SEARCH) ||
      JSON.stringify(this.props.advancedSearch) ===
        JSON.stringify(INIT_ADVANCE_SEARCH_PRO)
    const talentListIsBlank = talentList.length === 0
    const page_no =
      paginationParam && typeof paginationParam.page === 'number'
        ? paginationParam.page
        : 0
    // TODO： 看起来 (currAdvancedSearchIsBlank && !isBank) 这个条件的判断，可以用 models 中 isConditionEmpty 的判断
    // 引导用户去搜索
    // 判断是否选中企业粉丝
    const isFans =
      R.pathOr([], ['props', 'checkboxGroup'], this).find(
        (item) => item === 'is_fans'
      ) !== undefined

    if (currAdvancedSearchIsBlank && !isBank && talentListIsBlank) {
      return this.renderGuide(
        currAdvancedSearchIsBlank,
        talentListIsBlank,
        isFans
      )
    }

    if (talentListIsBlank) {
      return this.renderGuide(
        currAdvancedSearchIsBlank,
        talentListIsBlank,
        isFans
      )
    }

    const getOpButtons = (talent) => {
      const resume = talent.resume ? 'resume' : undefined
      const {
        currentUser: { isV3 },
      } = this.props

      return isTrial
        ? ['aiCallTrial', resume, 'directContactTrial']
        : [
            talent.is_special_attention === 1
              ? 'closeAttention'
              : 'openAttention',
            resume,
            'aiCall',
            talent.direct_contact_st === 1 || isV3
              ? 'directContact'
              : 'directIm',
          ]
    }

    const getFooterButtons = (talent) =>
      isTrial
        ? ['addRemarkTrial', 'groupTrial', 'addFriendTrial']
        : [
            'addRemark',
            talent.group_cnt > 0 ? 'editGroup' : 'group',
            talent.friend_state === 2 ? 'communicate' : '', // addFriend 去掉加好友
            'setState', // 全局不合适
          ]

    return talentList.map((talent: object, index: number) => (
      <Card
        data={talent}
        key={R.pathOr(0, ['id'], talent)}
        cardKey={R.pathOr(0, ['id'], talent)}
        onOpFinish={this.handleOpFinish}
        trackParam={{
          sid: this.props.sid,
          type: TABTYPEMAP[this.props.currentTab],
          page_position: index,
          u2: R.pathOr(0, ['id'], talent),
          isTrial,
          page_no,
          fr: getFr(currentTab),
          subid:
            'subscribeListForPc' === R.pathOr('', ['props', 'fr'], this)
              ? R.pathOr('', ['props', 'currCondition', 'id'], this)
              : '',
          search:
            'discoverListForPc' === R.pathOr('', ['props', 'fr'], this)
              ? R.pathOr('', ['props', 'advancedSearch'], this)
              : '',
        }}
        checked={selectedIds.includes(talent.id)}
        onCheck={this.handleSelect(talent.id)}
        opButtons={getOpButtons(talent)}
        footerButtons={getFooterButtons(talent)}
        scrollDom={this.props.scrollDom}
        showCheckbox
        showPhone
        setScrollDom={this.handleSetScrollDom}
        showSpecialAttention={true}
        version={'3.0'}
        fr={R.pathOr('', ['props', 'fr'], this)}
      />
    ))
  }

  renderLoading = () => {
    return (
      <p
        style={{ marginTop: '15%', paddingBottom: '30%' }}
        className="text-center margin-top-32"
      >
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }

  render() {
    const { loading = true, debouncingFlag } = this.props
    return (
      <div className={R.propOr('', 'className', this.props)}>
        {loading || debouncingFlag ? this.renderLoading() : this.renderList()}
      </div>
    )
  }
}
