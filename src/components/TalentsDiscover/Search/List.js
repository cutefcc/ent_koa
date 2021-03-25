import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/Search'
import ErrorBoundary from 'components/Common/ErrorBoundary'
import List from 'components/Common/List'
// import emptyImgUrl from 'images/empty.png'
import styles from './list.less'

@connect((state) => ({
  loadingList: state.loading.effects['talents/fetch'],
  jobs: state.global.jobs,
}))
export default class MyList extends React.Component {
  static propTypes = {
    onSelectChange: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    // isAllSelect: PropTypes.bool.isRequired,
    search: PropTypes.string.isRequired,
    hasInvitedIds: PropTypes.array,
    hasAddFriendIds: PropTypes.array,
    hasAddGroups: PropTypes.object,
    onOpFinish: PropTypes.func,
    onSearchChange: PropTypes.func,
  }

  static defaultProps = {
    hasInvitedIds: [],
    hasAddFriendIds: [],
    onOpFinish: () => {},
    onSearchChange: () => {},
    hasAddGroups: {},
  }

  constructor(props) {
    super(props)
    if (this.props.search.keyword !== '') {
      this.refreshData()
    }
  }

  state = {
    data: [],
    page: 0,
    remain: 0,
    source: 'search',
  }

  componentDidMount() {
    if (this.props.search.keyword) {
      this.refreshData()
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.search !== this.props.search) {
      this.refreshData(newProps.search)
    }
  }

  refreshData = (param) => {
    this.setState(
      {
        data: [],
        page: 0,
      },
      () => {
        this.loadData(param).then(({ data = {} }) => {
          const allData = R.propOr([], 'list', data)
          this.setState({
            data: allData,
            remain: data.remain,
          })
          this.props.onDataChange(allData)
        })
      }
    )
  }

  appendData = () =>
    this.loadData().then(({ data = {} }) => {
      const list = R.propOr([], 'list', data)
      const allData = R.uniqBy(R.prop('id'), [...this.state.data, ...list])
      this.setState({
        data: allData,
        remain: data.remain,
      })
      this.props.onDataChange(allData)
    })

  loadData = (param) => {
    const search = param || this.props.search
    const transformSearch = {
      ...search,
      city: R.path(['city', 'split'], search)
        ? search.city
            .split(',')
            .map((city) => R.propOr(city, 1, city.split('-')))
            .join(',')
        : undefined,
    }
    return this.props.dispatch({
      type: 'talents/fetch',
      payload: {
        page: this.state.page,
        ...transformSearch,
      },
    })
  }

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )

  handleSelect = (id) => (selected) => {
    const { data } = this.state
    const { selectedItems } = this.props
    const selectedIds = selectedItems.map(R.prop('id'))
    const ids = selected ? [...selectedIds, id] : R.without([id], selectedIds)

    this.props.onSelectChange(
      ids.length === data.length,
      data.filter((item) => R.contains(item.id, ids))
    )
  }

  handleOpFinish = (type, item, groupName) => {
    this.props.onOpFinish(type, [item.id], groupName)
  }

  handleJobClick = (keyword) => () => {
    this.props.onSearchChange({
      ...this.props.search,
      keyword,
    })
  }

  renderTalentItem = (item) => {
    const { selectedItems } = this.props
    const selectedIds = selectedItems.map(R.prop('id'))
    const { id } = item
    const { hasInvitedIds, hasAddFriendIds, hasAddGroups } = this.props

    const hasInvited = R.contains(id, hasInvitedIds)
    const hasAddFriend = R.contains(id, hasAddFriendIds)
    const hasGroup = R.has(id, hasAddGroups)
    const formatItem =
      hasInvited || hasAddFriend || hasGroup
        ? {
            ...item,
            is_direct_im: hasInvited ? 1 : item.is_direct_im,
            friend_state: hasAddFriend ? 1 : item.friend_state,
            groups: hasGroup
              ? R.uniq(
                  R.concat(
                    R.propOr([], 'groups', item),
                    hasAddGroups[id].split(',')
                  )
                )
              : item.groups,
          }
        : item
    const checked = selectedIds.includes(id)

    return (
      <TalentCard
        data={formatItem}
        key={id}
        checked={checked}
        onCheck={this.handleSelect(id)}
        showSource
        showPhone
        buttons={[
          'preview',
          // 'group',
          formatItem.friend_state === 2 ? 'chat' : 'addFriend',
          'directIm',
        ]}
        fr="discoverListForPc"
        source={this.state.source}
        onOpFinish={this.handleOpFinish}
        showCheckbox
      />
    )
  }

  renderList = () => <div>{this.state.data.map(this.renderTalentItem)}</div>

  renderJobsSelection = () => {
    return (
      <div>
        <p className={styles.jobSelectionTitle}>可按发布过的职位搜索</p>
        <p>
          {this.props.jobs.slice(0, 3).map((item) => (
            <span
              className={styles.jobTag}
              key={item.id}
              onClick={this.handleJobClick(item.position)}
            >
              {item.position}
            </span>
          ))}
        </p>
      </div>
    )
  }

  renderEmptyImg = () => {
    return <img src="/ent/images/empty.png" alt="emptyImage" />
  }

  renderDefaultTip = () => {
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          {/* <p className={styles.resultTip}>请输入查询关键词</p> */}
        </div>
        {this.renderJobsSelection()}
      </div>
    )
  }

  renderEmptyTip = () => {
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          <p className={styles.resultTip}>暂无搜索结果</p>
        </div>
        {this.renderJobsSelection()}
      </div>
    )
  }

  render() {
    const { loadingList } = this.props
    const {
      remain,
      data: { length: dataLngth = 0 },
    } = this.state
    return (
      <ErrorBoundary>
        <List
          renderList={this.renderList}
          loadMore={this.loadMore}
          loading={loadingList}
          dataLength={dataLngth}
          remain={remain}
          key="list"
          search={this.props.search.keyword}
          renderDefaultTip={this.renderDefaultTip}
          emptyTip={this.renderEmptyTip()}
        />
      </ErrorBoundary>
    )
  }
}
