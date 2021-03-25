import * as React from 'react'
import * as R from 'ramda'
import { Icon, Popover, Checkbox, Button } from 'mm-ent-ui'
// import {CURRENT_TAB} from 'constants/talentDiscover'
import { connect } from 'react-redux'
import { checkIsTrial, getFr } from 'utils'
// import {SORT_OPTIONS} from 'constants/talentDiscover'
import AddFriendButton from 'componentsV2/Common/RightButton/AddFriendButton'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import { debounce } from 'utils/index'

import * as styles from './index.less'

declare const window: any

export interface Props {
  className: String
  // currrentTab: String,
  selectedIds: Array<Object>
  onAnalysisVisiableChange: Function
  onAllSelectedStatusChange: Function
  analysisVisiable: boolean
  // filter: Object,
  // dispatch: Function,
}

export interface AdvancedFilterOptionsState {
  list: Array<Object>
  search_list: Array<Object>
}

export interface State {
  advancedFilterOptions: AdvancedFilterOptionsState
  selectedItems: Array<Object>
}

interface talentDiscoverState {
  currentGroup: Object | undefined
  filter: Object
  sortby: string
  talentList: Array<Object>
  sid: string
  isConditionEmpty: boolean
}

interface configState {
  sortby: Object
}

interface globalModelState {
  config: configState
}

interface GlobalState {
  talentDiscover: talentDiscoverState
  global: globalModelState
}

@connect(
  (state: GlobalState): Object => {
    return {
      currentGroup: state.talentDiscover.currentGroup,
      sortby: state.talentDiscover.sortby,
      sid: state.talentDiscover.sid,
      config: state.global.config,
      isConditionEmpty: state.talentDiscover.isConditionEmpty,
    }
  }
)
export default class Filter extends React.PureComponent<
  Props & talentDiscoverState & globalModelState,
  State
> {
  state = {
    advancedFilterOptions: {
      list: [],
      search_list: [],
    },
    selectedItems: [],
  }

  wrapDom: any = window.body

  componentWillReceiveProps(newProps: Props & talentDiscoverState) {
    if (
      newProps.selectedIds !== this.props.selectedIds ||
      newProps.talentList !== this.props.talentList
    ) {
      const selectedItems = newProps.talentList.filter((item) =>
        newProps.selectedIds.includes(item.id)
      )
      this.setState({
        selectedItems,
      })
    }
  }

  componentDidMount() {}

  isAllSelected = () =>
    this.state.selectedItems.length === this.props.talentList.length

  setWrapDom = (dom: any) => {
    this.wrapDom = dom
  }

  // TODO: 临时逻辑, 当选中分组不为空，或者没有任何搜索条件的时候，认为在人才库
  isBank = () =>
    !R.isEmpty(this.props.currentGroup) || this.props.isConditionEmpty

  getAddFriendItems = () => {
    interface itemProps {
      friend_state: Number
    }

    return this.state.selectedItems.filter(
      (item: itemProps) => !item.friend_state
    )
  }

  getDirectImItems = () => {
    interface itemProps {
      is_direct_im: Number
      direct_contact_st: Number
      right_type: Number
    }

    return this.state.selectedItems
    // return this.state.selectedItems.filter(
    //   (item: itemProps) => !item.is_direct_im
    // )
  }

  handleAddFriendFinish = (ids, res) => {
    const { talentList } = this.props
    const formatData = R.compose(R.groupBy(R.prop('errorcode')))(res || [])
    const successIds = R.propOr([], 0, formatData).map(R.prop('to_uid'))

    this.props.dispatch({
      type: 'talentDiscover/setTalentList',
      payload: talentList.map((talent) =>
        successIds.includes(talent.id) ? { ...talent, friend_state: 1 } : talent
      ),
    })
  }

  handleDirectImFinish = (ids, res) => {
    // const {talentList} = this.props
    // const successIds = res
    //   .filter(R.propEq('errorcode', 0))
    //   .map(R.prop('to_uid'))
    // this.props.dispatch({
    //   type: 'talentDiscover/setTalentList',
    //   payload: talentList.map(talent =>
    //     successIds.includes(talent.id) ? {...talent, is_direct_im: 1} : talent
    //   ),
    // })
    this.props.onAllSelectedStatusChange(false)
  }

  handleGroupFinish = (result) => {
    this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
      payload: {},
    })
  }

  handleAllSelectStateChange = () => {
    this.props.onAllSelectedStatusChange(!this.isAllSelected())
    // this.props.onToggleAllSelectedStatus()
  }

  handleFetchData = () => {
    this.props.dispatch({
      type: 'talentDiscover/fetchData',
      payload: { data_version: '3.0' },
    })
  }

  handleTrial = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '开通招聘企业版 解锁更多功能',
        cancelTxt: '放弃开通',
        confirmTxt: '立即开通',
      },
    })
  }

  renderTrialButton = (title, iconType) => {
    return (
      <Button
        type="button_m_exact_link_bgray"
        onClick={this.handleTrial}
        className="margin-left-16"
      >
        <Icon type={iconType} />
        <span className="margin-left-8">{title}</span>
      </Button>
    )
  }

  renderBatchOpPanel = () => {
    const { selectedItems } = this.state
    const addFriendItems = this.getAddFriendItems()
    const directImItems = this.getDirectImItems()
    const isTrial = checkIsTrial()
    return (
      <React.Fragment>
        <Checkbox
          onChange={this.handleAllSelectStateChange}
          checked={this.state.selectedItems.length && this.isAllSelected()}
        >
          全选
        </Checkbox>
        {selectedItems.length > 0 && (
          <span>已选中{selectedItems.length}个人才</span>
        )}
        {isTrial ? (
          this.renderTrialButton('加入储备', 'add_label')
        ) : (
          <GroupButton
            key="groupButton"
            talents={selectedItems}
            onOk={this.handleGroupFinish}
            disabled={selectedItems.length === 0}
            type="likeLink"
            className="margin-left-24 margin-right-24"
            trackParam={{
              type: '/ent/v2/discover',
              uid2: selectedItems.map(R.prop('id')).join(','),
            }}
          >
            <Icon type="add_label" />
            <span className="margin-left-8">加入储备</span>
          </GroupButton>
        )}
        {/* {isTrial ? (
          this.renderTrialButton('加好友', 'add_friend')
        ) : (
          <AddFriendButton
            key="addfr"
            talents={addFriendItems}
            trackParam={{
              type: '/ent/v2/discover',
              uid2: addFriendItems.map(R.prop('id')).join(','),
            }}
            onAddFinish={this.handleAddFriendFinish}
            disabled={addFriendItems.length === 0}
            className="margin-right-24"
            content={
              <React.Fragment>
                <Icon type="add_friend" />
                <span className="margin-left-8">加好友</span>
              </React.Fragment>
            }
            type="likeLink"
          />
        )} */}
        {/* {isTrial ? (
          this.renderTrialButton('极速联系', 'direct_im')
        ) : (
          <DirectChatButton
            key="DirectIMButton"
            talents={directImItems}
            onInviteFinish={this.handleDirectImFinish}
            disabled={directImItems.length === 0}
            content={
              <React.Fragment>
                <Icon type="direct_im" />
                <span className="margin-left-8">极速联系</span>
              </React.Fragment>
            }
            type="likeLink"
            // onClick={
            //   // 如果是个人版，则用自定义的 onclick 事件，取代默认的 onclick 事件，阻止使用该功能
            //   isPersonal ? this.handleShowTipOpenMember : undefined
            // }
            trackParam={{
              sid: this.props.sid,
              type: '/ent/v2/discover',
              uid2: directImItems.map(R.prop('id')).join(','),
            }}
          />
        )} */}
        {isTrial ? (
          this.renderTrialButton('极速联系', 'direct_im')
        ) : (
          <DirectContactButton
            key="DirectContactButton"
            talents={directImItems}
            disabled={directImItems.length === 0}
            onContactFinish={this.handleDirectImFinish}
            iconType="direct_im"
            type="likeLink"
            trackParam={{
              sid: this.props.sid,
              type: '/ent/v2/discover',
              fr: getFr('talent'),
              uid2: directImItems.map(R.prop('id')).join(','),
            }}
            isBatch={true}
          />
        )}
      </React.Fragment>
    )
  }

  render() {
    return (
      <div
        className={`${R.propOr('', 'className', this.props)} ${
          styles.main
        } flex`}
        ref={this.setWrapDom}
      >
        <div className="flex flex-align-center">
          {this.renderBatchOpPanel()}
        </div>
      </div>
    )
  }
}
