import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/CommonCard'
import List from 'components/Common/List'
import { computeTimeRemain } from 'utils/date'

@connect((state) => ({
  loading: state.loading.effects['channels/fetchTalents'],
  currentUser: state.global.currentUser,
  currentChannel: state.channels.currentChannel,
}))
export default class Talents extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onDataChange: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onSelectedItemsChange: PropTypes.func.isRequired,
    channelId: PropTypes.number.isRequired,
    onInviteFinish: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
  }

  state = {
    remain: 0,
    lastId: 0,
    isFinish: false,
    page: 0,
    size: 100,
  }

  componentDidMount() {
    this.refreshData()
    this.timer = window.setInterval(this.setFinishState, 1000)
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.channelId !== newProps.channelId ||
      this.props.filter !== newProps.filter
    ) {
      this.refreshData()
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }

  setFinishState = () => {
    const endTime = R.propOr(0, 'end_time', this.props.currentChannel)
    const isFinish = !computeTimeRemain(endTime)
    this.setState({
      isFinish,
    })

    if (isFinish && this.timer && !R.isEmpty(this.props.currentChannel)) {
      window.clearInterval(this.timer)
    }
  }

  fetchData = () => {
    return this.props.dispatch({
      type: 'channels/fetchTalents',
      payload: {
        lastId: this.state.lastId,
        channel_id: this.props.channelId,
        page: this.state.page,
        size: this.state.size,
        ...this.props.filter,
      },
    })
  }

  refreshData = () => {
    this.props.onDataChange([])
    this.setState(
      {
        lastId: 0,
        page: 0,
      },
      () => {
        this.fetchData().then(({ data }) => {
          const { list = [] } = data
          this.setState({
            remain: data.remain || 0,
            lastId: data.lastId || 0,
          })
          this.props.onDataChange(list)
        })
      }
    )
  }

  appendData = () =>
    this.fetchData().then(({ data }) => {
      const list = R.uniqBy(R.prop('id'), [...this.props.data, ...data.list])
      this.setState({
        remain: data.remain,
        lastId: data.lastId,
      })
      this.props.onDataChange(list)
    })

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )

  handleOpFinish = (type, item) => {
    if (type === 'directIm') {
      this.props.onInviteFinish([item.id])
    }
  }

  handleSelect = (id) => (selected) => {
    const { data, selectedItems } = this.props
    const selectedIds = selectedItems.map(R.prop('id'))
    const ids = selected ? [...selectedIds, id] : R.without([id], selectedIds)

    this.props.onSelectedItemsChange(
      data.filter((item) => R.contains(item.id, ids))
    )
  }

  renderList = () => {
    const selectedIds = this.props.selectedItems.map(R.prop('id'))
    const {
      currentUser: { isV3 },
    } = this.props
    return this.props.data.map((item) => {
      return (
        <TalentCard
          data={item}
          key={item.id}
          checked={selectedIds.includes(item.id)}
          onCheck={this.handleSelect(item.id)}
          showSource
          showPhone
          opButtons={[
            // 'microResume',
            // 'profile',
            item.direct_contact_st === 1 || isV3 ? 'directContact' : 'robbery',
          ]}
          footerButtons={[
            item.friend_state === 2 ? 'communicate' : 'addFriend',
            'group',
            'addRemark',
            // 'askForPhone',
            // item.mobile ? 'showPhone' : '',
            // item.attachment_resume_url ? 'attachmentResume' : '',
          ]}
          source={this.state.source}
          onOpFinish={this.handleOpFinish}
          isFinish={this.state.isFinish}
          trackParam={this.props.trackParam}
          showCheckbox
        />
      )
    })
  }

  render() {
    const { loading, data } = this.props
    const { remain } = this.state
    return (
      <List
        renderList={this.renderList}
        loadMore={this.loadMore}
        loading={loading}
        dataLength={data.length}
        remain={remain}
        key="list"
        search="default"
        renderDefaultTip={this.renderPromoteList}
        emptyTip="该频道本期推荐的候选人已经都被邀请完成，下周二，我们将推出更多优质人才，敬请期待!"
      />
    )
  }
}
