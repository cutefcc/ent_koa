import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import * as R from 'ramda'
import { Affix } from 'antd'
import { setValuesByRange } from 'utils'
import * as R from 'ramda'
import List from 'components/TalentsDiscover/Channel/List'
import BatchSelection from 'components/TalentsDiscover/Channel/BatchSelection'
import Unavailable from 'components/TalentsDiscover/Channel/Unavailable'
import MoreChannel from 'components/TalentsDiscover/Channel/MoreChannel'

import styles from './channel.less'

@connect((state) => ({
  listLoading: state.loading.effects['channels/fetchTalents'],
  outListLoading: state.loading.effects['channels/fetchUnavailableTalents'],
  channelListLoading: state.loading.effects['channels/fetch'],
  sendLoading: state.loading.effects['channels/send'],
  currentUser: state.global.currentUser,
}))
@withRouter
export default class Talents extends React.Component {
  constructor(props) {
    super(props)
    const { id: channelId } = props.match.params
    this.state = {
      selectedItems: [],
      isAllSelect: false,
      data: [],
      channelId,
      filter: {},
      trackParam: {
        type: 'channel',
      },
    }
  }

  componentDidMount() {
    this.fetchJobs()
    this.fetchCurrentChannel()
  }

  fetchJobs = () => this.props.dispatch({ type: 'global/fetchJobs' })

  fetchCurrentChannel = () =>
    this.props.dispatch({
      type: 'channels/fetchCurrentChannel',
      payload: { channel_id: this.state.channelId },
    })

  handleAllSelectChange = (isAllSelect) => {
    this.setState({
      selectedItems: isAllSelect ? this.state.data : [],
      isAllSelect,
    })
  }

  handleInviteFinish = (ids) => {
    this.setState(
      {
        data: setValuesByRange(
          this.state.data,
          (item) => ({
            is_direct_im: 1,
            directed_num: R.propOr(0, 'directed_num', item) + 1,
          }),
          'id',
          ids
        ),
      },
      this.fetchCurrentChannel
    )
  }

  handleSelectedItemsChange = (selectedItems) => {
    this.setState({
      selectedItems,
      isAllSelect: selectedItems.length === this.state.data.length,
    })
  }

  handleDataChange = (data) => {
    this.setState({
      data,
    })
  }

  handleChannelIdChange = (channelId) => {
    this.setState({
      channelId,
    })
  }

  handleFilterChange = (filter) => {
    this.setState({
      filter: {
        ...this.state.filter,
        ...filter,
      },
      selectedItems: [],
      isAllSelect: false,
    })
  }

  renderBatchSelection = () => {
    const { trackParam, channelId } = this.state
    const param = {
      ...trackParam,
      sid: channelId,
    }
    return (
      <BatchSelection
        onSelectChange={this.handleAllSelectChange}
        onInviteFinish={this.handleInviteFinish}
        selectedItems={this.state.selectedItems}
        isAllSelect={this.state.isAllSelect}
        onFilterChange={this.handleFilterChange}
        showFilter={this.state.channelId !== '0'} // 这里临时采用了硬编码，高阶人才专题不显示filter
        loading={this.props.listLoading}
        trackParam={param}
      />
    )
  }

  render() {
    const { trackParam, channelId } = this.state
    const param = {
      ...trackParam,
      sid: channelId,
    }
    return (
      <div
        className={styles.main}
        ref={(node) => {
          this.container = node
        }}
      >
        <Affix target={() => this.container}>
          <div className={styles.top}>{this.renderBatchSelection()}</div>
        </Affix>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.list}>
              <List
                data={this.state.data}
                onSelectedItemsChange={this.handleSelectedItemsChange}
                onInviteFinish={this.handleInviteFinish}
                selectedItems={this.state.selectedItems}
                channelId={this.state.channelId}
                onDataChange={this.handleDataChange}
                filter={this.state.filter}
                trackParam={param}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.unavailable}>
              <Unavailable channelId={this.state.channelId} />
            </div>
            <div className={styles.moreChannel}>
              <MoreChannel
                channelId={this.state.channelId}
                onChannelIdChange={this.handleChannelIdChange}
                trackParam={param}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
