/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'
import { setValuesByRange, GUID, debounce } from 'utils'
import List from 'components/TalentPool_v3/Enterprise/List'
import AdvancedSearch from 'components/TalentPool_v3/Enterprise/AdvancedSearch'
import Navigator from 'components/TalentPool_v3/Enterprise/Navigator'
import BatchSelection from 'components/TalentPool_v3/Enterprise/BatchSelection'
import Analysis from 'components/TalentPool_v3/Enterprise/Analysis'
import ScrollOberver from 'components/Common/ScrollObserver_v2'
import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import { Affix } from 'antd'

import styles from './index_v3.less'

@connect((state) => ({
  listLoading: state.loading.effects['global/fetchUrl'],
  runtime: state.global.runtime,
  currentUser: state.global.currentUser,
}))
export default class Search extends React.Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const defaultNavigatorKey = R.trim(R.pathOr('', ['query', 'nav'], urlObj))
    this.state = {
      pagination: {
        page: 0,
        size: 20,
      },
      data: [],
      selectedItems: [],
      isAllSelect: false,
      advancedSearch: {}, // 高级搜索项
      advancedSearchValues: {},
      analysisSearch: {}, // 数据分析的筛选项
      analysisSearchValues: {},
      navigatorParam: {},
      navigator: {
        itemKey: 'total',
        url: '/api/ent/talent/pool/search_v2',
      },
      sortBy: '4',
      defaultNavigatorKey,
      sid: 0,
      trackParam: {
        type: 'talent_pool_company_group',
      },
    }
    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    this.handleMoreFilterChange = debounce(this.handleDebounceFetch, 500)
    this.fetchJobs()
    this.setReddot()

    if (!this.state.defaultNavigatorKey) {
      this.refreshData()
    }
  }

  setReddot = () => {
    this.props
      .dispatch({
        type: 'global/setReddot',
        payload: {
          reddot_type: 1,
        },
      })
      .then(this.fetchRuntime)
  }

  setScrollDom = (dom) => {
    this.scrollDom = dom
  }

  fetchRuntime = () => {
    this.props.dispatch({
      type: 'global/fetchRuntime',
      payload: {},
    })
  }

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  canSearch = () => {
    return true
  }

  loadData = () => {
    const { url, action_code: actionCode } = this.state.navigator
    if (actionCode === 1) {
      return new Promise((resolve) => {
        resolve({ data: {} })
      })
    }
    return this.props
      .dispatch({
        type: 'global/fetchUrl',
        payload: {
          url,
          param: {
            search: {
              ...this.state.advancedSearchValues,
              ...this.state.navigatorParam,
            },
            filter: this.state.analysisSearchValues,
          },
          query: {
            ...this.state.pagination,
            sortby: this.state.sortBy,
          },
          method: 'POST',
        },
      })
      .then()
  }

  refreshData = () => {
    const sid = GUID()
    this.handleTrackEvent(sid)
    this.setState(
      {
        data: [],
        remain: 0,
        sid,
      },
      () => {
        this.loadData().then(({ data }) => {
          this.setState({
            data: R.propOr([], 'list', data),
            remain: data.remain || 0,
          })
        })
      }
    )
  }

  handleTrackEvent = (sid) => {
    const { advancedSearchValues } = this.state
    if (window.voyager) {
      const key = 'jobs_pc_talent_list'
      const param = {
        sid,
        condition: encodeURI(
          JSON.stringify({
            advancedSearchValues,
          })
        ),
        uid: window.uid,
        ...this.state.trackParam,
      }
      window.voyager.trackEvent(key, key, param)
    }
  }

  loadMore = () => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          page: this.state.pagination.page + 1,
        },
      },
      () => {
        return this.loadData().then(({ data }) => {
          const list = R.propOr([], 'list', data)
          this.setState({
            data: R.uniqBy(R.prop('id'), [...this.state.data, ...list]),
            remain: data.remain,
          })
        })
      }
    )
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
  }

  handleSelectChange = (isAllSelect, selectedItems) => {
    this.setState({
      isAllSelect,
      selectedItems,
    })
  }

  handleOpFinish = (type, ids, state = 1) => {
    const { currentUser } = this.props
    const stateMap = {
      directIm: 'is_direct_im',
      addFriend: 'friend_state',
      directInvite: 'direct_invite_status',
      setState: 'op_state',
    }
    if (!stateMap[type]) {
      return ''
    }
    const setValue = () => {
      if (stateMap[type] === 'op_state' && state === 1) {
        // 如果操作标记不合适，则更新操作人和最新操作时间
        return {
          [stateMap[type]]: state,
          op_time: new Date(),
          op_name: currentUser.ucard.name,
        }
      }
      return { [stateMap[type]]: state }
    }
    this.setState({
      data: setValuesByRange(this.state.data, setValue, 'id', ids),
    })
    return ''
  }

  handleAllSelect = (isAllSelect) => {
    this.setState({
      isAllSelect,
      selectedItems: isAllSelect ? this.state.data : [],
    })
  }

  handleRefresh = () => {
    if (this.canSearch()) {
      this.setState(
        {
          data: [],
          pagination: {
            page: 0,
            size: 20,
          },
          selectedItems: [],
          isAllSelect: false,
        },
        this.refreshData
      )
    }
  }

  handleAdvancedSearchChange = (advancedSearch) => {
    const { city, companys } = advancedSearch
    const companyMap = {
      BAT: '百度,阿里,腾讯',
      TMDJ: '今日头条,美团,滴滴,京东,字节跳动',
    }
    const companysFormat = Object.keys(companyMap).includes(companys)
      ? companyMap[companys]
      : companys

    this.setState(
      {
        advancedSearch,
        advancedSearchValues: {
          ...advancedSearch,
          city: R.propOr('', 1, city) === '全部' ? '' : R.propOr('', 1, city),
          province:
            R.propOr('', 1, city) !== '全部' ? '' : R.propOr('', 0, city),
          companys: companysFormat,
          ...R.propOr(
            this.state.navigator.param,
            'search',
            this.state.navigator.param
          ),
        },
      },
      // this.handleRefresh
      this.handleMoreFilterChange
    )
  }

  handleDebounceFetch = () => {
    this.handleRefresh()
  }

  handleNavigatorChange = (navigator = {}) => {
    const navigatorParam = R.propOr(navigator.param, 'search', navigator.param)
    this.setState(
      {
        navigator,
        advancedSearch: {},
        advancedSearchValues: {},
        analysisSearch: {},
        analysisSearchValues: {},
        navigatorParam,
        data: [],
        selectedItems: [],
        pagination: {
          page: 0,
          size: 20,
        },
        defaultNavigatorKey: '',
      },
      this.handleRefresh
    )
  }

  handleSortByChange = (sortBy) => {
    this.setState(
      {
        sortBy,
        selectedItems: [],
        isAllSelect: false,
      },
      () => {
        if (this.state.data.length > 0) {
          this.handleRefresh()
        }
      }
    )
  }

  handleAnalysisValuesChange = (analysisSearch) => {
    this.setState(
      {
        analysisSearch,
        analysisSearchValues: {
          ...analysisSearch,
          province: '',
        },
      },
      this.handleRefresh
    )
  }

  handleClearValues = () => {
    this.setState(
      {
        analysisSearch: {},
        analysisSearchValues: {},
        advancedSearchValues: {},
        advancedSearch: {},
      },
      this.handleRefresh
    )
  }

  render() {
    const batchSelection = (
      <BatchSelection
        isAllSelect={this.state.isAllSelect}
        selectedItems={this.state.selectedItems}
        onSelect={this.handleAllSelect}
        onOpFinish={this.handleOpFinish}
        hasInvitedIds={this.state.hasInvitedIds}
        hasDirectInviteIds={this.state.hasDirectInviteIds}
        hasAddFriendIds={this.state.hasAddFriendIds}
        onChange={this.handleSortByChange}
        value={this.state.sortBy}
        showSort
        loading={this.props.listLoading}
        wrapperDom={this.scrollDom}
        trackParam={{
          sid: this.state.sid,
          ...this.state.trackParam,
        }}
      />
    )
    return (
      <LogEvent eventList={this.eventList} className={styles.main}>
        <div className={styles.left}>
          <div className={styles.tip}>限时免费体验 结束后将消耗权益</div>
          <div className={styles.navigator}>
            <Navigator
              currentNavigator={this.state.navigator}
              onNavigatorChange={this.handleNavigatorChange}
              defaultNavigatorKey={this.state.defaultNavigatorKey}
            />
          </div>
        </div>
        <div className={styles.right}>
          <ScrollOberver
            onScrollToBottom={this.state.remain ? this.loadMore : () => {}}
            className={styles.scrollDom}
            setScrollDom={this.setScrollDom}
          >
            <div className={styles.top}>
              <div className={styles.advancedSearch}>
                <AdvancedSearch
                  onChange={this.handleAdvancedSearchChange}
                  value={this.state.advancedSearch}
                  wrapperDom={this.scrollDom}
                  currentNavigator={this.state.navigator}
                />
                <Analysis
                  value={this.state.analysisSearch}
                  onChange={this.handleAnalysisValuesChange}
                  onClear={this.handleClearValues}
                  advancedSearchValues={this.state.advancedSearchValues}
                  navigatorParam={this.state.navigatorParam}
                  currentNavigator={this.state.navigator}
                  filter={this.state.analysisSearchValues}
                  defaultNavigatorKey={this.state.defaultNavigatorKey}
                />
              </div>
            </div>
            <div className={styles.bottom}>
              <Affix target={() => this.scrollDom}>
                <div className={styles.batchSelection}>{batchSelection}</div>
              </Affix>
              <div className={styles.list}>
                <List
                  onSelectChange={this.handleSelectChange}
                  isAllSelect={this.state.isAllSelect}
                  selectedItems={this.state.selectedItems}
                  onOpFinish={this.handleOpFinish}
                  data={this.state.data}
                  loading={this.props.listLoading}
                  remain={!!this.state.remain}
                  search={this.canSearch() ? 'default' : ''}
                  currentNavigator={this.state.navigator}
                  scrollDom={this.scrollDom}
                  trackParam={{
                    sid: this.state.sid,
                    ...this.state.trackParam,
                  }}
                />
              </div>
            </div>
          </ScrollOberver>
        </div>
      </LogEvent>
    )
  }
}
