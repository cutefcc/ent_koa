import * as React from 'react'
import * as R from 'ramda'
import { Icon, Popover, Checkbox, Button } from 'mm-ent-ui'
// import {CURRENT_TAB} from 'constants/talentDiscover'
import { connect } from 'react-redux'
import { checkIsTrial } from 'utils'
// import {SORT_OPTIONS} from 'constants/talentDiscover'
import AddFriendButton from 'componentsV2/Common/RightButton/AddFriendButton'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import { debounce, asyncExtraData } from 'utils/index'

import * as styles from './index.less'

declare const window: any

export interface Props {
  className: String
  // currrentTab: String,
  selectedIds: Array<Object>
  onAnalysisVisiableChange: Function
  onAllSelectedStatusChange: Function
  analysisVisiable: boolean
  dataAvailable: object
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
  currentTab: String
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
      currentTab: state.talentDiscover.currentTab,
      currentGroup: state.talentDiscover.currentGroup,
      filter: state.talentDiscover.filter,
      sortby: state.talentDiscover.sortby,
      talentList: state.talentDiscover.talentList,
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

  componentDidMount() {
    this.fetchAdvancedFilterOptions()
    this.handleFetchDataDebounce = debounce(this.handleFetchData, 500)
  }

  isAllSelected = () =>
    this.state.selectedItems.length === this.props.talentList.length

  setWrapDom = (dom: any) => {
    this.wrapDom = dom
  }

  // TODO: ????????????, ???????????????????????????????????????????????????????????????????????????????????????
  isBank = () =>
    !R.isEmpty(this.props.currentGroup) || this.props.isConditionEmpty

  getFilterOptions = () => {
    const isBank = this.isBank()
    const {
      advancedFilterOptions: {
        list: bankFilterOption = [],
        search_list: searchFilterOptions = [],
      },
    } = this.state
    return isBank ? bankFilterOption : searchFilterOptions
  }

  getAdvancedFilterNum = () => {
    const options = this.getFilterOptions()
    const { filter: values } = this.props
    return R.intersection(Object.keys(values), options.map(R.prop('key')))
      .length
  }

  getWrapDom = () => {
    return this.wrapDom
  }

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

    return this.state.selectedItems.filter(
      (item: itemProps) => !item.is_direct_im
    )
  }

  fetchAdvancedFilterOptions = () => {
    this.props
      .dispatch({
        type: 'talentDiscover/fetchExtraOptions',
        payload: {
          version_type: 2,
        },
      })
      .then(({ data }) => {
        this.setState({
          advancedFilterOptions: data,
        })
      })
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
    const { talentList } = this.props
    const successIds = res
      .filter(R.propEq('errorcode', 0))
      .map(R.prop('to_uid'))
    this.props.dispatch({
      type: 'talentDiscover/setTalentList',
      payload: talentList.map((talent) =>
        successIds.includes(talent.id) ? { ...talent, is_direct_im: 1 } : talent
      ),
    })
    this.props.onAllSelectedStatusChange(false)
  }

  handleGroupFinish = (result) => {
    this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
      payload: {},
    })
  }

  handleSortChange = (sort: string) => () => {
    const { dispatch } = this.props

    dispatch({
      type: 'talentDiscover/setSort',
      payload: sort,
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  handleAllSelectStateChange = () => {
    this.props.onAllSelectedStatusChange(!this.isAllSelected())
    // this.props.onToggleAllSelectedStatus()
  }

  handleAdvancedFilterChange = (values: Array<string>) => {
    const filter = values.reduce(
      (res: object, v: string) => ({ ...res, [v]: 1 }),
      {}
    )
    this.props.dispatch({
      type: 'talentDiscover/setFilter',
      payload: filter,
    })
    this.handleFetchDataDebounce()
  }

  handleFetchData = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  handleAnalysisVisiableChange = (isAnalysisAvailable: boolean) => () => {
    if (isAnalysisAvailable) {
      this.props.onAnalysisVisiableChange(!this.props.analysisVisiable)
    }
  }

  handleTrial = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '????????????????????? ??????????????????',
        cancelTxt: '????????????',
        confirmTxt: '????????????',
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
          ??????
        </Checkbox>
        {selectedItems.length > 0 && (
          <span>?????????{selectedItems.length}?????????</span>
        )}
        {isTrial ? (
          this.renderTrialButton('????????????', 'add_label')
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
            <span className="margin-left-8">????????????</span>
          </GroupButton>
        )}
        {isTrial ? (
          this.renderTrialButton('?????????', 'add_friend')
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
                <span className="margin-left-8">?????????</span>
              </React.Fragment>
            }
            type="likeLink"
          />
        )}
        {isTrial ? (
          this.renderTrialButton('????????????', 'direct_im')
        ) : (
          <DirectChatButton
            key="DirectIMButton"
            talents={directImItems}
            onInviteFinish={this.handleDirectImFinish}
            disabled={directImItems.length === 0}
            content={
              <React.Fragment>
                <Icon type="direct_im" />
                <span className="margin-left-8">????????????</span>
              </React.Fragment>
            }
            type="likeLink"
            // onClick={
            //   // ??????????????????????????????????????? onclick ???????????????????????? onclick ??????????????????????????????
            //   isPersonal ? this.handleShowTipOpenMember : undefined
            // }
            trackParam={{
              sid: this.props.sid,
              type: '/ent/v2/discover',
              uid2: directImItems.map(R.prop('id')).join(','),
            }}
          />
        )}
      </React.Fragment>
    )
  }

  renderAdvancedFilterPop = () => {
    const { filter } = this.props
    const options = this.getFilterOptions()
    const optionsDom = options.map((item) => ({
      label: item.name,
      value: item.key,
    }))
    return (
      <div className={styles.advancedFilterPop}>
        <Checkbox.Group
          options={optionsDom}
          onChange={this.handleAdvancedFilterChange}
          // onChange={this.handleAdvancedFilterChangeDebounce}
          value={Object.keys(filter)}
        />
      </div>
    )
  }

  renderSortPop = () => {
    const { sortby, config = {} } = this.props
    const { sortby: sortMap = [] } = config
    return (
      <ul className={styles.sortPop}>
        {sortMap.map((item: object) => (
          <li
            className={`${sortby}` === `${item.value}` ? styles.active : ''}
            key={item.value}
            onClick={this.handleSortChange(item.value)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    )
  }

  renderFilterPanel = () => {
    const { talentList } = this.props
    const isBank = this.isBank()
    const { sortby: sortMap = [] } = this.props.config
    // const advancedFilterNum = Object.values(this.props.filter).length
    const advancedFilterNum = this.getAdvancedFilterNum()
    const sortby = R.propOr(
      '????????????',
      'label',
      sortMap.find((item) => `${item.value}` === `${this.props.sortby}`)
    )
    const { isAnalysisAvailable } = this.props

    return (
      <React.Fragment>
        <span
          className={`${styles.filterItem} ${
            advancedFilterNum > 0 ? styles.filterActiveItem : ''
          }`}
        >
          <Popover
            content={this.renderAdvancedFilterPop()}
            placement="bottom"
            getPopupContainer={this.getWrapDom}
          >
            <Icon type="myFilter" />
            <span className="margin-left-4">
              ????????????{advancedFilterNum ? `(${advancedFilterNum})` : ''}
            </span>
          </Popover>
        </span>
        <span
          className={`${styles.filterItem} ${
            sortby !== '????????????' ? styles.filterActiveItem : ''
          }`}
        >
          <Popover
            content={this.renderSortPop()}
            placement="bottom"
            getPopupContainer={this.getWrapDom}
          >
            <Icon type="icon_sort" />
            <span className="margin-left-4">{sortby}</span>
          </Popover>
        </span>
        {isBank && (
          <span
            className={
              `${styles.filterItem} ` +
              `${isAnalysisAvailable ? '' : styles.noAvailable}`
            }
            style={
              this.props.dataAvailable.total === undefined
                ? { cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }
                : null
            }
            onClick={
              this.props.dataAvailable.total &&
              this.handleAnalysisVisiableChange(isAnalysisAvailable)
            }
          >
            <Icon
              type={
                !this.props.analysisVisiable ||
                this.props.dataAvailable.total === undefined
                  ? 'icon_arrow_down'
                  : 'arrow_up'
              }
            />
            <span className="margin-left-4">
              {!this.props.analysisVisiable ||
              this.props.dataAvailable.total === undefined
                ? '??????????????????'
                : '??????????????????'}
            </span>
          </span>
        )}
      </React.Fragment>
    )
  }

  render() {
    return (
      <div
        className={`${R.propOr('', 'className', this.props)} ${styles.main}`}
        ref={this.setWrapDom}
      >
        <div className="flex flex-align-center">
          {this.renderBatchOpPanel()}
        </div>
        <div className={styles.right}>{this.renderFilterPanel()}</div>
      </div>
    )
  }
}
