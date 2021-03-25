import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import List from 'components/TalentsDiscover/Search_v2/List'
import BatchSelection from 'components/TalentsDiscover/Search_v2/BatchSelection'
import VipBanner from 'components/TalentsDiscover/Search_v2/VipBanner'
// import LightingImgUrl from 'images/lighting.png'
import AdvancedSearch from 'components/TalentsDiscover/Search_v2/AdvancedSearch'
import urlParse from 'url'
import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import { isEmpty } from 'utils'
import styles from './search_v2.less'

@connect((state) => ({
  searchKey: state.global.searchKey,
  searchKeyNum: state.global.searchKeyNum,
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
  memberOpenTip: state.global.memberOpenTip,
  currentConditionId: state.subscribe.currentConditionId,
  conditionChangeNum: state.subscribe.conditionChangeNum,
  loadingList: state.loading.effects['talents/searchV2'],
  auth: state.global.auth,
}))
export default class Search extends React.Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const query = R.trim(R.pathOr('', ['query', 'search'], urlObj))
    const loc = R.trim(R.pathOr('', ['query', 'loc'], urlObj))
    const locArr = /([\u4e00-\u9fa5]+)(-([\u4e00-\u9fa5]*))?/.exec(loc)
    const regionParam =
      !locArr || locArr === null
        ? {
            cities: undefined,
            provinces: undefined,
          }
        : {
            cities:
              R.prop(3, locArr) && R.prop(3, locArr) !== '全部' ? loc : '',
            provinces:
              !R.prop(3, locArr) || R.prop(3, locArr) === '全部'
                ? R.propOr('', 1, locArr)
                : '',
          }
    const school = R.trim(R.pathOr('', ['query', 'school'], urlObj))
    const position = R.trim(R.pathOr('', ['query', 'position'], urlObj))
    const companys = R.trim(R.pathOr('', ['query', 'company'], urlObj))

    this.defaultSearch = {
      companyscope: 0,
      sortby: '0',
      is_direct_chat: 0,
      query,
      ...regionParam,
    }

    const search = {
      worktimes: undefined,
      degrees: undefined,
      professions: undefined,
      schools: school || undefined,
      positions: position || undefined,
      companys: companys || undefined,
      ...this.defaultSearch,
      ...regionParam,
    }

    this.state = {
      search,
      selectedItems: [],
      isAllSelect: false,
      hasInvitedIds: [],
      hasDirectInviteIds: [],
      hasAddFriendIds: [],
      hasAddGroups: {},
      data: [],
      showTop: false,
      listType: this.getSearchType(search),
      trackParam: {
        type: 'search',
      },
    }

    this.eventList = {
      click: CLICK_EVENETS,
    }

    this.props.dispatch({
      type: 'global/setSearchKey',
      payload: {
        searchKey: query,
      },
    })
  }

  componentDidMount() {
    this.fetchJobs()
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.searchKeyNum !== this.props.searchKeyNum &&
      this.props.searchKeyNum !== 0
    ) {
      const search = {
        ...this.defaultSearch,
        query: newProps.searchKey,
      }
      this.setState({
        selectedItems: [],
        isAllSelect: false,
        search,
        listType: this.getSearchType(search),
      })
    }

    if (
      newProps.currentConditionId !== this.props.currentConditionId ||
      newProps.conditionChangeNum !== this.props.conditionChangeNum
    ) {
      if (newProps.currentConditionId) {
        this.fetchConditionDetail(newProps.currentConditionId)
      }
    }
  }

  getSearchType = (search) => {
    // 如果输入的条件满足搜索条件，则展示搜索结果，否则展示默认推荐列
    const searchFields = [
      'cities',
      'companys',
      'degrees',
      'is_211',
      'is_985',
      'positions',
      'provinces',
      'query',
      'schools',
      'worktimes',
    ]
    const unEmpty = (v) => !isEmpty(v)
    const canSearch = R.compose(
      R.any(unEmpty),
      R.values,
      R.pickAll(searchFields)
    )(search)
    const type = canSearch ? 'search' : 'default'

    return type
  }

  fetchConditionDetail = (id) =>
    this.props
      .dispatch({
        type: 'subscribe/fetchConditionDetail',
        payload: {
          id,
        },
      })
      .then(({ data }) => {
        const search = {
          ...this.defaultSearch,
          ...data,
        }
        this.setState({
          search,
          listType: this.getSearchType(search),
        })
      })

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleSearch = (searchKey) => {
    this.props.dispatch({
      type: 'global/setSearchKey',
      payload: {
        searchKey,
      },
    })
  }

  handleSearchChange = (search) => {
    this.setState({
      search: Object.assign(
        {},
        search,
        search.search_query ? { query: search.search_query } : {}
      ),
      listType: this.getSearchType(search),
      selectedItems: [],
      isAllSelect: false,
    })
  }

  //   this.props.dispatch({
  //     type: 'global/setSearchKey',
  //     payload: {
  //       searchKey: search.query,
  //     },
  //   })
  // }

  handleSelectChange = (isAllSelect, selectedItems) => {
    this.setState({
      isAllSelect,
      selectedItems,
    })
  }

  handleOpFinish = (type, ids, groupName) => {
    switch (type) {
      case 'directIm':
        this.setState({
          hasInvitedIds: [...this.state.hasInvitedIds, ...ids],
        })
        break
      case 'addFriend':
        this.setState({
          hasAddFriendIds: [...this.state.hasAddFriendIds, ...ids],
        })
        break
      case 'group':
        this.setState({
          hasAddGroups: R.mergeDeepWith(
            (a, b) => `${a},${b}`,
            this.state.hasAddGroups,
            R.fromPairs(ids.map((id) => [id, groupName]))
          ),
        })
        break
      case 'directInvite':
        this.setState({
          hasDirectInviteIds: [...this.state.hasDirectInviteIds, ...ids],
        })
        break
      default:
        return ''
    }
    return ''
  }

  handleAllSelect = (isAllSelect) => {
    this.setState({
      isAllSelect,
      selectedItems: isAllSelect ? this.state.data : [],
    })
  }

  handleDataChange = (data) => {
    this.setState({ data })
  }

  render() {
    // if (this.props.auth.isEnterpriseRecruiter) {
    //   this.props.history.push('/ent/v2')
    //   return null
    // }
    const batchSelection = (
      <BatchSelection
        isAllSelect={this.state.isAllSelect}
        selectedItems={this.state.selectedItems}
        onSelect={this.handleAllSelect}
        onOpFinish={this.handleOpFinish}
        hasInvitedIds={this.state.hasInvitedIds}
        hasDirectInviteIds={this.state.hasDirectInviteIds}
        hasAddFriendIds={this.state.hasAddFriendIds}
        search={this.state.search}
        onSearchChange={this.handleSearchChange}
        loading={this.props.loadingList}
        type={this.state.listType}
        showSort={this.state.listType === 'search'}
      />
    )
    return (
      <LogEvent eventList={this.eventList} className={styles.logEvent}>
        <div className={styles.main}>
          {this.state.showTop && (
            <div className={styles.top}>{batchSelection}</div>
          )}
          <div className={styles.left}>
            {/* <div className={styles.tip}>
              <img src={LightingImgUrl} alt="提示" />
              <span className="color-dilution margin-left-8">
                限时免费体验 结束后将消耗权益
              </span>
            </div> */}
            <div className={styles.advancedSearch}>
              <AdvancedSearch
                onChange={this.handleSearchChange}
                value={this.state.search}
                trackParam={this.state.trackParam}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.batchSelection}>{batchSelection}</div>
            <div className={styles.list}>
              <VipBanner />
              <List
                onSelectChange={this.handleSelectChange}
                isAllSelect={this.state.isAllSelect}
                selectedItems={this.state.selectedItems}
                search={this.state.search}
                hasInvitedIds={this.state.hasInvitedIds}
                hasAddFriendIds={this.state.hasAddFriendIds}
                hasAddGroups={this.state.hasAddGroups}
                hasDirectInviteIds={this.state.hasDirectInviteIds}
                onOpFinish={this.handleOpFinish}
                onSearchChange={this.handleSearchChange}
                data={this.state.data}
                onDataChange={this.handleDataChange}
                type={this.state.listType}
                trackParam={this.state.trackParam}
              />
            </div>
          </div>
        </div>
      </LogEvent>
    )
  }
}
