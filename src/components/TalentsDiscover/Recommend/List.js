import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import Voyager from 'voyager'
import { setValuesByRange, GUID } from 'utils'
import PropTypes from 'prop-types'
import { Button } from 'mm-ent-ui'
import List from 'components/Common/List'
import Card from 'components/Common/TalentCard/CommonCardWithTrack'
import { withRouter } from 'react-router-dom'

@connect((state) => ({
  recommenLoading: state.loading.effects['recommends/fetch'],
  loadingJobs: state.loading.effects['global/fetchJobs'],
  visitorLoading: state.loading.effects['positions/fetchVisitor'],
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
}))
@withRouter
export default class MyList extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired, // eslint-disable-line
    jid: PropTypes.number,
    filter: PropTypes.object.isRequired, // eslint-disable-line
  }

  static defaultProps = {
    jid: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      remain: 0,
      page: 0,
      tests: {},
      sid: 0,
    }
    this.needExpopsurePoint = props.currentTab === 'recommend'
  }

  componentDidMount() {
    if (this.props.jid) {
      this.refreshData(this.props)
    }
    if (this.needExpopsurePoint) {
      this.voyager = new Voyager({})
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      !R.eqProps('currentTab', newProps, this.props) ||
      !R.eqProps('jid', newProps, this.props) ||
      !R.eqProps('filter', newProps, this.props)
    ) {
      if (newProps.jid) {
        this.refreshData(newProps)
      }
    }
  }

  componentWillUnmount() {
    const timers = Object.values(this.timer)
    timers.map((timer) => {
      if (timer) {
        clearTimeout(timer)
      }
      return ''
    })
  }

  timer = {}

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.state.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  refreshData = (props) => {
    const sid = GUID()
    const param = {
      sid,
      type: props.currentTab,
      condition: encodeURI(
        JSON.stringify({
          jid: props.jid,
        })
      ),
    }
    this.trackEvent('jobs_pc_talent_list', param)
    this.setState(
      {
        page: 0,
        data: [],
        sid,
      },
      () => {
        this.loadData(props).then((data) => {
          const remain = data.remain || R.path(['data', 'remain'], data) || 0
          this.setState({
            data: data.contacts || R.path(['data', 'list'], data) || [],
            remain,
          })
        })
      }
    )
  }

  appendData = () => {
    this.loadData(this.props).then((data) => {
      const remain = data.remain || R.path(['data', 'remain'], data) || 0
      this.setState({
        data: R.uniqBy(R.prop('id'), [
          ...this.state.data,
          ...(data.contacts || R.path(['data', 'list'], data) || []),
        ]),
        remain,
        tests: R.propOr({}, 'tests', data),
      })
    })
  }

  loadData = (props) => {
    const typeMap = {
      recommend: 'recommends/fetch',
      visitor: 'positions/fetchVisitor',
    }
    const type = R.propOr('recommends/fetch', props.currentTab, typeMap)
    return this.props.dispatch({
      type,
      payload: {
        page: this.state.page,
        jid: props.jid,
        sid: this.state.sid,
        ...props.filter,
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

  handleDirectInviteFinish = (ids) =>
    this.setState({
      data: setValuesByRange(
        this.state.data,
        { direct_invite_status: 1 },
        'id',
        ids
      ),
    })

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
      directInvite: this.handleDirectInviteFinish,
    }
    if (map[type]) {
      map[type]([data.id], groupName)
    }
  }

  handlePublishPosition = () => {
    this.props.history.push('/ent/talents/recruit/positions/add')
    // 发布职位打点
    const param = {
      sid: this.state.sid,
      type: this.props.currentTab,
    }
    this.trackEvent('jobs_pc_talent_position_publish_click', param)
  }

  handleSetScrollDom = (scrollDom) => {
    this.setState({
      scrollDom,
    })
  }

  renderList = () => {
    return this.state.data.map((item, index) => (
      <Card
        item={item}
        key={item.id}
        cardKey={item.id}
        onOpFinish={this.handleOpFinish}
        trackParam={{
          sid: this.state.sid,
          type: this.props.currentTab,
          page_no: this.state.page,
          page_position: index,
          tests: this.state.tests,
          fr:
            R.pathOr('', ['props', 'currentTab'], this) === 'recommend'
              ? 'recommend_pc_free'
              : 'visitor_pc_free',
          u2: R.pathOr(0, ['id'], item),
        }}
        showCheckbox={false}
        scrollDom={this.state.scrollDom}
      />
    ))
  }

  render() {
    const { data, remain } = this.state
    const { loadingJobs } = this.props
    const style = {
      lineHeight: '400px',
      textAign: 'center',
      verticalAlign: 'middle',
    }
    const addPositionTip = loadingJobs ? (
      <p style={style}>正在获取您发布的职位信息...</p>
    ) : (
      <p style={style}>
        您还没有发布职位，您可以点击
        <Button onClick={this.handlePublishPosition} type="link">
          「发布职位」
        </Button>
      </p>
    )
    const emptyTip = {
      recommend: this.props.jid ? (
        <p style={style}>暂时还没有推荐哦！</p>
      ) : (
        addPositionTip
      ),
      visitor: this.props.jid ? (
        <p style={style}>您的职位尚没有访客</p>
      ) : (
        addPositionTip
      ),
    }
    return (
      <div style={{ height: '100%', overflow: 'hidden' }}>
        <List
          renderList={this.renderList}
          loadMore={this.loadMore}
          loading={this.props.recommenLoading || this.props.visitorLoading}
          dataLength={data.length}
          remain={remain}
          key="list"
          search="default"
          emptyTip={emptyTip[this.props.currentTab] || '当前还没有数据哦！'}
          setScrollDom={this.handleSetScrollDom}
        />
      </div>
    )
  }
}
