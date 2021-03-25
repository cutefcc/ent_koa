import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard_new'
import List from 'components/Common/List'
import DirectChatButton from 'components/Common/DirectChatButton'

import styles from './list.less'

@connect((state) => ({
  loadingList:
    state.loading.effects['talentPool/fetch'] ||
    state.loading.effects['talentPool/fetchNew'],
}))
export default class MyList extends React.Component {
  propTypes = {
    onSelectChange: PropTypes.func.isRequired,
    filter: PropTypes.number.isRequired,
    isSelectAll: PropTypes.bool.isRequired,
    invitedItems: PropTypes.array.isRequired,
    onInviteFinish: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
  }

  state = {
    data: [],
    page: 0,
    remain: 0,
    selectedIds: [],
    source: 'talent_pool',
  }

  componentDidMount() {
    this.refreshData()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isSelectAll !== this.props.isSelectAll) {
      this.setState(
        {
          selectedIds: newProps.isSelectAll
            ? this.state.data.map(R.prop('id'))
            : [],
        },
        () => {
          this.props.onSelectChange(
            newProps.isSelectAll,
            newProps.isSelectAll ? this.state.data : []
          )
        }
      )
    }

    if (
      // newProps.search !== this.props.search ||
      newProps.filter !== this.props.filter
    ) {
      this.refreshData()
    }

    if (
      newProps.onlyWithPhone !== this.props.onlyWithPhone &&
      newProps.filter === -2
    ) {
      this.refreshData()
    }
  }

  getSearchedData = () => {
    const {
      search: { loc = '', onlyWithPhone = false },
    } = this.props
    const { data } = this.state
    return R.compose(
      this.searchLoc(loc),
      this.searchOnlyShowHasPhone(onlyWithPhone)
    )(data)
  }

  searchLoc = (loc) => (data) => {
    return R.isEmpty(loc)
      ? data
      : data.filter((item) => loc.includes(item.province))
  }

  searchOnlyShowHasPhone = (onlyPhone) => (data) => {
    return onlyPhone ? data.filter(R.prop('mobile')) : data
  }

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )

  refreshData = () =>
    this.setState(
      {
        page: 0,
        data: [],
      },
      () => {
        this.loadData().then(({ data = [] }) => {
          this.setState({
            data: R.propOr([], 'list', data),
            remain: R.propOr(false, 'remain', data),
          })
        })
      }
    )

  appendData = () =>
    this.loadData().then(({ data }) => {
      this.setState({
        data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.list]),
        remain: data.remain,
      })
    })

  loadData = () => {
    if (this.props.filter === -2) {
      return this.props.dispatch({
        type: 'talentPool/fetch',
        payload: {
          page: this.state.page,
          is_mobile: this.props.onlyWithPhone ? 1 : undefined,
        },
      })
    }
    return this.props.dispatch({
      type: 'talentPool/fetchNew',
      payload: {
        page: this.state.page,
        filter: this.props.filter,
        ...this.props.search,
      },
    })
  }

  handleSelect = (id) => (selected) => {
    const { selectedIds, data } = this.state
    const ids = selected ? [...selectedIds, id] : R.without([id], selectedIds)
    this.setState({
      selectedIds: ids,
    })
    this.props.onSelectChange(
      ids.length === data.length,
      data.filter((item) => R.contains(item.id, ids))
    )
  }

  handleDirectImFinish = (items) => {
    this.props.onInviteFinish(items)
  }

  renderTalentItem = (item) => {
    const { selectedIds } = this.state
    const { invitedItems } = this.props
    const { id } = item
    const hasInvited =
      !!item.is_direct_im || invitedItems.map(R.prop('id')).includes(id)
    const buttons = [
      <DirectChatButton
        key="DirectIMButton"
        talents={[item]}
        source={this.state.source}
        onInviteFinish={this.handleDirectImFinish}
        disabled={hasInvited}
        buttonText={hasInvited ? '已联系' : `极速联系`}
        className={styles.button}
      />,
    ]
    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showSource
        showPhone
        buttons={buttons}
        source={this.state.source}
        showCheckbox
      />
    )
  }

  renderList = () => (
    <div>{this.getSearchedData().map(this.renderTalentItem)}</div>
  )

  render() {
    const { loadingList } = this.props
    const { remain } = this.state
    const searchData = this.getSearchedData()
    return (
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loadingList}
        dataLength={searchData ? searchData.length : 0}
        remain={remain}
        key="list"
        search="flowing"
      />
    )
  }
}
