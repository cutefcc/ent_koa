import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Loading, Typography, Empty, Button } from 'mm-ent-ui'
import EmptyTip from 'componentsV2/Common/EmptyTip'
import { checkIsTrial, getFr, asyncExtraData } from 'utils'
import { uidsUploader } from 'utils/hoc';
import { INIT_ADVANCE_SEARCH, TABTYPEMAP } from 'constants/talentDiscover'
import Card from 'componentsV2/Common/TalentCard/CommonCardWithTrack'

import * as styles from './index.less'

export interface Props {
  className: string,
  selectedIds: Array<Object>,
  onSelectedItemsChange: Function,
  urlPrefix: string,
  currentTab: string,
  scrollDom: HTMLBaseElement,
}

export interface State {
  scrollDom: object,
}

interface talentDiscoverState {
  paginationParam: object,
  talentList: Array<Object>,
  sid: string,
  currentGroup: object,
  advancedSearch: object,
  subscriptionIdForV2: string,
  currentTab: string,
}

interface loadingState {
  effects: Object,
}

interface globalStoreState {
  currentUser: Object,
  urlPrefix: string,
  jobs: Array<Object>,
}

interface GlobalState {
  talentDiscover: talentDiscoverState,
  loading: loadingState,
  global: globalStoreState,
}

@connect((state: GlobalState) => ({
  talentList: state.talentDiscover.talentList,
  currentUser: state.global.currentUser,
  sid: state.talentDiscover.sid,
  advancedSearch: state.talentDiscover.advancedSearch,
  subscriptionIdForV2: state.talentDiscover.subscriptionIdForV2,
  currentGroup: state.talentDiscover.currentGroup,
  loading: state.loading.effects['talentDiscover/fetchData'],
  urlPrefix: state.global.urlPrefix,
  currentTab: state.talentDiscover.currentTab,
  jobs: state.global.jobs,
  paginationParam: state.talentDiscover.paginationParam,
}))
@uidsUploader({ rootSelector: '#talentList', selector: '.talent-common-card' })
export default class TalentList extends React.PureComponent<Props & talentDiscoverState & loadingState & GlobalState & globalStoreState, State> {
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
    window.broadcast.bind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.bind('directContactSuccess', this.handleDirectContactSuccess)
  }

  // handleAiCallFinish = () => {}
  componentWillUnmount() {
    window.broadcast.unbind('addFriendSuccess', this.handleAddFriendSuccess)
    window.broadcast.unbind('askForPhoneSuccess', this.handleAskForPhoneSuccess)
    window.broadcast.unbind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.unbind('directContactSuccess', this.handleDirectContactSuccess)
  }

  resetData = data => {
    this.props.dispatch({
      type: 'talentDiscover/setTalentList',
      payload: data,
    })
  }

  handleAddFriendSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map(talent => (
      uids.includes(talent.id) ? { ...talent, friend_state: 1 } : talent
    ))
    this.resetData(data)
  }

  handleAskForPhoneSuccess = uid => {
    const { talentList } = this.props
    const data = talentList.map(talent => (
      uid === talent.id ? { ...talent, call_state: 1 } : talent
    ))
    this.resetData(data)
  }

  handleDirectImSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map(talent => (
      uids.includes(talent.id) ? { ...talent, is_direct_im: 1 } : talent
    ))
    this.resetData(data)
  }

  handleDirectContactSuccess = (uids = []) => {
    const { talentList } = this.props
    const data = talentList.map(talent => (
      uids.includes(talent.id) ? { ...talent, recent_dc_chat: 1 } : talent
    ))
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
      const data = talentList.map((talent = {}) => (
        `${data.id}` === `${talent.id}` ? { ...talent, op_state: res } : talent
      ))
      /**
       * because update group is async in backend
       * the delay time is not sure
       * so front end should fetch data twice to ensure group num is consistent with the actual situation
       */
      setTimeout(this.fetchNavigator, 2000)
      setTimeout(this.fetchNavigator, 5000)

      this.resetData(data)
    }
  }

  handleSelect = (id: number) => (selected: boolean) => {
    const { selectedIds } = this.props
    const res = selected ? [...selectedIds, id] : R.without([id], selectedIds)
    this.props.onSelectedItemsChange(res)
  }

  handleSetScrollDom = scrollDom => {
    this.setState({
      scrollDom,
    })
  }

  handleJobClick = item => () => {
    const { dispatch, advancedSearch } = this.props;

    dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...advancedSearch,
        positions: R.propOr('', 'position', item),
      },
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    }).then(data => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  renderEmptyImg = () => (
    <img src={`${this.props.urlPrefix}/images/empty.png`} alt="emptyImage" />
  )

  renderJobsSelection = () => (
    <div>
      <p className={styles.jobSelectionTitle}>可按发布过的职位搜索</p>
      <p>
        {this.props.jobs.slice(0, 3).map(item => (
          <span
            className={styles.jobTag}
            key={item.id}
            onClick={this.handleJobClick(item)}
          >
            {item.position}
          </span>
        ))}
      </p>
    </div>
  )

  renderGuide = () => {
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          <p className="color-dilution font-size-14 margin-top-16">
            请搜索人才
          </p>
        </div>
        {this.renderJobsSelection()}
      </div>
    )
  }

  renderList = () => {
    const { talentList = [], selectedIds, currentGroup, paginationParam, subscriptionIdForV2 } = this.props
    const isBank = !R.isEmpty(currentGroup)
    const isTrial = checkIsTrial()
    // 判断左边的高级搜索是否为空（JSON.stringify不是很好的办法，后续可以写一个util方法判断两个对象是否一致）
    const currAdvancedSearchIsBlank = ((JSON.stringify(this.props.advancedSearch) === JSON.stringify(INIT_ADVANCE_SEARCH)))
    const talentListIsBlank = talentList.length === 0
    const page_no = paginationParam && typeof paginationParam.page === 'number' ? paginationParam.page : 0;
    // TODO： 看起来 (currAdvancedSearchIsBlank && !isBank) 这个条件的判断，可以用 models 中 isConditionEmpty 的判断
    // 引导用户去搜索
    if (currAdvancedSearchIsBlank && !isBank && talentListIsBlank) {
      return this.renderGuide()
    }

    if (talentListIsBlank) {
      return <EmptyTip tip={'暂无人才'} />
    }

    const getOpButtons = talent => {
      const { currentUser: { isV3 } } = this.props
      return isTrial
        ? ['aiCallTrial', 'directContactTrial']
        : [
          'aiCall',
          talent.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
        ]
    }

    const getFooterButtons = talent =>
      isTrial
        ? ['addRemarkTrial', 'groupTrial', 'addFriendTrial']
        : [
          'addRemark',
          talent.group_cnt > 0 ? 'editGroup' : 'group',
          talent.friend_state === 2 ? 'communicate' : 'addFriend',
          isBank ? 'setState' : '',
        ]

    return talentList.map((talent: object, index: number) => (
      <Card
        data={talent}
        key={talent.id}
        cardKey={talent.id}
        onOpFinish={this.handleOpFinish}
        trackParam={{
          sid: this.props.sid,
          type: TABTYPEMAP[this.props.currentTab],
          page_position: index,
          u2: R.pathOr(0, ['id'], talent),
          isTrial,
          page_no,
          fr: getFr(this.props.currentTab),
          search: R.pathOr('', ['props', 'advancedSearch'], this),
          subid: subscriptionIdForV2,
          isV2: R.pathOr('0', ['props', 'currentUser', 'isV3'], this) ? '0' : '1',
        }}
        checked={selectedIds.includes(talent.id)}
        onCheck={this.handleSelect(talent.id)}
        opButtons={getOpButtons(talent)}
        footerButtons={getFooterButtons(talent)}
        scrollDom={this.props.scrollDom}
        showCheckbox
        showPhone
        setScrollDom={this.handleSetScrollDom}
        fr={R.pathOr('', ['props', 'fr'], this)}
      />
    ))
  }

  renderLoading = () => {
    return <p className="text-center margin-top-32" style={{ marginTop: '15%', paddingBottom: '30%' }}><Loading /><span className="color-gray400 margin-left-8">加载中...</span></p>
  }

  render() {
    const { loading } = this.props
    return (
      <div className={R.propOr('', 'className', this.props)}>
        {loading ? this.renderLoading() : this.renderList()}
      </div>
    )
  }
}
