import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'
import Voyager from 'voyager'
import { setValuesByRange, GUID } from 'utils'
import PropTypes from 'prop-types'
import { Button } from 'mm-ent-ui'
import List from 'componentsV2/Common/List'
import Card from 'componentsV2/Common/TalentCard/CommonCardWithTrack'

@connect((state) => ({
  recommenLoading: state.loading.effects['recommends/fetch'],
  loadingJobs: state.loading.effects['global/fetchJobs'],
  visitorLoading: state.loading.effects['positions/fetchVisitor'],
  canchatLoading: state.loading.effects['positions/fetchCanChat'],
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
      loading: true,
    }
    this.needExpopsurePoint = props.currentTab === 'recommend'
  }

  componentDidMount() {
    const { jid, currentTab } = this.props
    if (jid || currentTab === 'canchat') {
      this.refreshData(this.props)
    } else {
      setTimeout(() => {
        this.setState({
          loading: false,
        })
      }, 300)
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
      if (newProps.jid || newProps.currentTab === 'canchat') {
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
          const remain =
            !data.no_more ||
            data.remain ||
            R.path(['data', 'remain'], data) ||
            0
          this.setState({
            data:
              data.contacts ||
              R.path(['data', 'data'], data) ||
              R.path(['data', 'list'], data) ||
              [],
            remain,
            loading: false,
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
      canchat: 'positions/fetchCanChat',
    }
    const type = R.propOr('recommends/fetch', props.currentTab, typeMap)
    return this.props.dispatch({
      type,
      payload: {
        page: this.state.page,
        count: 10,
        jid: props.jid,
        sid: this.state.sid,
        ...props.filter,
      },
    })
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 10,
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

  handleRedirectToAddPosition = () => {
    // 发布职位打点
    const param = {
      sid: this.state.sid,
      type: this.props.currentTab,
    }
    this.trackEvent('jobs_pc_talent_position_publish_click', param)
    this.props.history.push('/ent/v2/job/positions/publish')
  }

  handleSetScrollDom = () => {
    // this.setState({
    //   scrollDom,
    // })
  }

  renderList = () => {
    const {
      currentUser: { isV3 },
      jid,
    } = this.props
    return this.state.data.map((item, index) => {
      // this.props.currentUser.identity === 6 ? item.is_special_attention === 1 ? 'closeAttention' : 'openAttention' : undefined,
      let specialAttention
      if (this.props.currentUser.identity !== 6) {
        specialAttention = undefined
      } else if (item.is_special_attention === 1) {
        specialAttention = 'closeAttention'
      } else {
        specialAttention = 'openAttention'
      }
      return (
        <Card
          data={item}
          key={item.id}
          cardKey={item.id}
          onOpFinish={this.handleOpFinish}
          trackParam={{
            sid: this.state.sid,
            type: this.props.currentTab,
            page_no: this.state.page,
            page_position: index,
            tests: this.state.tests,
            u2: R.pathOr(0, ['id'], item),
            jid,
            fr: `${this.props.currentTab}_pc`,
          }}
          showCheckbox={false}
          scrollDom={window.body}
          opButtons={[
            specialAttention,
            item.resume ? 'resume' : undefined,
            'aiCall',
            item.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
          ]}
          showSpecialAttention
          footerButtons={
            isV3
              ? [
                  'addRemark',
                  item.group_cnt > 0 ? 'editGroup' : 'group',
                  item.friend_state === 2 ? 'communicate' : '', // addFriend 去掉加好友
                  // 'setState',
                  // 'askForPhone',
                ]
              : [
                  'addRemark',
                  item.group_cnt > 0 ? 'editGroup' : 'group',
                  item.friend_state === 2 ? 'communicate' : 'addFriend',
                  // 'setState',
                  // 'askForPhone',
                ]
          }
        />
      )
    })
  }

  render() {
    const { data, remain, loading } = this.state
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
        您还没有发布职位，可点击
        <Button onClick={this.handleRedirectToAddPosition} type="link">
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
          loading={
            loading ||
            this.props.recommenLoading ||
            this.props.visitorLoading ||
            this.props.canchatLoading
          }
          dataLength={data.length}
          remain={remain}
          key="list"
          search="default"
          emptyTip={emptyTip[this.props.currentTab] || '当前还没有数据哦！'}
          // setScrollDom={this.handleSetScrollDom}
        />
      </div>
    )
  }
}
