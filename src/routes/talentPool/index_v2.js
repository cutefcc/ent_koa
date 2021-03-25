import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import List from 'components/TalentPool_v2/Enterprise//List'
import BatchSelection from 'components/TalentPool_v2/Enterprise/BatchSelection'
import LightingImgUrl from 'images/lighting.png'
import { setValuesByRange } from 'utils'

import Navigator from 'components/TalentPool_v2/Enterprise/Navigator'
import AdvancedSearch from 'components/TalentPool_v2/Enterprise/AdvancedSearch'

import styles from './index_v2.less'

@connect((state) => ({
  listLoading: state.loading.effects['global/fetchUrl'],
}))
export default class Search extends React.Component {
  state = {
    pagination: {
      page: 0,
      size: 20,
    },
    url: '',
    data: [],
    selectedItems: [],
    isAllSelect: false,
    advancedSearch: {},
    navigator: {
      itemKey: 'total',
      url: '/api/ent/talent/pool/search',
    },
    search: {
      sortby: '0',
    },
  }

  componentDidMount() {
    this.fetchJobs()
  }

  setScrollDom = (dom) => {
    this.scrollDom = dom
  }

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  loadData = (url) => {
    return this.props
      .dispatch({
        type: 'global/fetchUrl',
        payload: {
          url,
          param: {
            ...this.state.pagination,
            ...this.state.advancedSearch,
            ...this.state.search,
          },
        },
      })
      .then()
  }

  refreshData = (url) => () => {
    // 滚动到最顶端
    if (this.scrollDom) {
      this.scrollDom.scrollTop = 0
    }

    this.setState(
      {
        data: [],
        remain: 0,
      },
      () => {
        this.loadData(url).then(({ data }) => {
          this.setState({
            data: R.propOr([], 'list', data),
            remain: data.remain || 0,
            url,
          })
        })
      }
    )
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
        return this.loadData(this.state.url).then(({ data }) => {
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

  handleSelectChange = (isAllSelect, selectedItems) => {
    this.setState({
      isAllSelect,
      selectedItems,
    })
  }

  handleOpFinish = (type, ids) => {
    const stateMap = {
      directIm: 'is_direct_im',
      addFriend: 'friend_state',
      directInvite: 'direct_invite_status',
    }
    if (!stateMap[type]) {
      return ''
    }

    this.setState({
      data: setValuesByRange(
        this.state.data,
        { [stateMap[type]]: 1 },
        'id',
        ids
      ),
    })

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

  handleRefresh = () => {
    this.setState(
      {
        data: [],
        pagination: {
          page: 0,
          size: 20,
        },
        selectedItems: [],
      },
      this.refreshData(this.state.navigator.url)
    )
  }

  handleAdvancedSearchChange = (advancedSearch) => {
    this.setState({
      advancedSearch,
    })

    if (
      R.trim(R.propOr('', 'companys', advancedSearch)) === '' &&
      R.trim(R.propOr('', 'positions', advancedSearch)) === ''
    ) {
      return
    }
    this.handleRefresh()
  }

  handleNavigatorChange = (navigator) => {
    this.setState(
      {
        navigator,
        advancedSearch: {},
        data: [],
        selectedItems: [],
      },
      this.handleRefresh
    )
  }

  handleSearchChange = (search) => {
    const { advancedSearch = {} } = this.state
    this.setState(
      {
        search,
      },
      () => {
        if (
          this.state.navigator.itemKey === 'total' &&
          R.trim(R.propOr('', 'companys', advancedSearch)) === '' &&
          R.trim(R.propOr('', 'positions', advancedSearch)) === ''
        ) {
          return
        }
        this.handleRefresh()
      }
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
        search={this.state.search}
        onSearchChange={this.handleSearchChange}
        showSort={this.state.navigator.itemKey === 'total'}
        showIsAcceptedOption={this.state.navigator.title === '脉脉高阶人才投放'} // 这里是后加上去的，由于之后要下线，采取临时方案硬编码一下
        loading={this.props.listLoading}
      />
    )
    return (
      <div className={styles.main}>
        {this.state.showTop && (
          <div className={styles.top}>{batchSelection}</div>
        )}
        <div className={styles.left}>
          <div className={styles.tip}>
            {/* <img src="/ent/images/lighting.png" /> */}
            <img src={LightingImgUrl} alt="提示" />
            <span className="color-dilution margin-left-8">
              限时免费体验 结束后将消耗权益
            </span>
          </div>
          <div className={styles.navigator}>
            <Navigator
              navigator={this.state.navigator}
              onNavigatorChange={this.handleNavigatorChange}
            />
          </div>
        </div>
        <div className={styles.right}>
          {this.state.navigator.itemKey === 'total' && (
            <div className={styles.advancedSearch}>
              <AdvancedSearch
                onChange={this.handleAdvancedSearchChange}
                value={this.state.advancedSearch}
              />
            </div>
          )}
          <div className={styles.batchSelection}>{batchSelection}</div>
          <div className={styles.list}>
            <List
              onSelectChange={this.handleSelectChange}
              isAllSelect={this.state.isAllSelect}
              selectedItems={this.state.selectedItems}
              onOpFinish={this.handleOpFinish}
              onSearchChange={this.handleQueryChange}
              data={this.state.data}
              loading={this.props.listLoading}
              loadMore={this.loadMore}
              remain={!!this.state.remain}
              search={
                this.state.navigator.itemKey === 'total'
                  ? Object.values(this.state.advancedSearch).join('')
                  : 'default'
              }
              setScrollDom={this.setScrollDom}
            />
          </div>
        </div>
      </div>
    )
  }
}
