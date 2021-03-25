import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { setValuesByRange } from 'utils'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import List from 'components/Common/List'
import TalentCard from 'components/Common/TalentCard/Recommend'

import { Button } from 'mm-ent-ui'

@connect((state) => ({
  loading: state.loading.effects['groups/fetchTalents'],
  currentUser: state.global.currentUser,
}))
@withRouter
export default class MyList extends React.Component {
  static propTypes = {
    currentGroupId: PropTypes.number.isRequired,
  }

  state = {
    data: [],
    remain: 0,
    page: 0,
  }

  componentDidMount() {
    if (this.props.currentGroupId) {
      this.refreshData()
    }
  }

  componentWillReceiveProps(newProps) {
    if (!R.eqProps('currentGroupId', newProps, this.props)) {
      if (!newProps.currentGroupId) {
        this.setState({
          data: [],
        })
        return
      }
      this.refreshData(newProps)
    }
  }

  refreshData = (newProps) =>
    this.setState(
      {
        page: 0,
        data: [],
      },
      () => {
        this.loadData(newProps).then((data) => {
          const remain = data.remain || R.path(['data', 'remain'], data) || 0
          this.setState({
            data: data.contacts || R.path(['data', 'list'], data) || [],
            remain,
          })
        })
      }
    )

  appendData = () => {
    this.loadData().then((data) => {
      const remain = data.remain || R.path(['data', 'remain'], data) || 0
      this.setState({
        data: R.uniqBy(R.prop('id'), [
          ...this.state.data,
          ...(data.contacts || R.path(['data', 'list'], data) || []),
        ]),
        remain,
      })
    })
  }

  loadData = (newProps) => {
    const props = newProps || this.props
    return this.props.dispatch({
      type: 'groups/fetchTalents',
      payload: {
        page: this.state.page,
        group_id: props.currentGroupId,
      },
    })
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  handleDirectImFinish = (ids) => {
    this.setState({
      data: setValuesByRange(this.state.data, { is_direct_im: 1 }, 'id', ids),
    })
  }

  handleAddFrFinish = (ids) => {
    this.setState({
      data: setValuesByRange(this.state.data, { friend_state: 1 }, 'id', ids),
    })
  }

  handleGroupFinish = (ids, groupName) => {
    this.setState({
      data: setValuesByRange(
        this.state.data,
        (item) => ({ groups: [...R.propOr([], 'groups', item), groupName] }),
        'id',
        ids
      ),
    })
  }

  handleOpFinish = (type, data, groupName) => {
    const map = {
      directIm: this.handleDirectImFinish,
      addFriend: this.handleAddFrFinish,
      group: this.handleGroupFinish,
    }
    if (map[type]) {
      map[type]([data.id], groupName)
    }
  }

  handleRedirectToSearch = () => {
    this.props.history.push(this.props.currentUser.searchUrl)
  }

  renderList = () => (
    <div>
      {this.state.data.map((item) => (
        <TalentCard
          data={item}
          key={item.id}
          showHilights
          source={this.state.source}
          buttons={[
            'preview',
            'group',
            item.friend_state === 2 ? 'chat' : 'addFriend',
            'directIm',
          ]}
          onOpFinish={this.handleOpFinish}
          trackParam={this.props.trackParam}
          fr={this.props.fr}
        />
      ))}
    </div>
  )

  render() {
    const { data, remain } = this.state
    const style = {
      marginTop: '150px',
    }
    const emptyTip = this.props.currentGroupId ? (
      <div style={style}>
        <p className="text-center">
          分组当前没有收藏人才，您可以在发现人才页面收藏人才哦!
        </p>
        <p className="text-center">
          <Button
            style={{ border: 'none' }}
            onClick={this.handleRedirectToSearch}
            className="color-blue cursor-pointer font-size-16"
            type={this.props.type || 'button_s_exact_link_bgray'}
          >
            点击开始发现人才~
          </Button>
        </p>
      </div>
    ) : (
      <div style={style}>
        <p>您还没有创建分组哦！</p>
        <p>请使用「编辑」功能，添加分组~</p>
      </div>
    )
    return (
      <div style={{ padding: '8px 24px' }}>
        <List
          renderList={this.renderList}
          loadMore={this.loadMore}
          loading={this.props.loading}
          dataLength={data.length}
          remain={remain}
          key="list"
          search="default"
          emptyTip={emptyTip}
        />
      </div>
    )
  }
}
