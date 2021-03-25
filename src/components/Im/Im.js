import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { message } from 'antd'
import DialogList from 'components/Common/im/DialogList'
import { IM_URL } from 'constants'
import DialogDetail from 'components/Common/im/DialogDetail'
import PropTypes from 'prop-types'

import styles from './im.less'

const watchTimeInterval = 20000

@connect((state) => ({
  currentUser: state.global.currentUser,
  listLoading: state.loading.effects['resumes/fetchResumeList'],
}))
export default class Im extends React.Component {
  static propTypes = {
    target: PropTypes.number,
    advancedSearch: PropTypes.object,
  }

  static defaultProps = {
    target: 0,
    advancedSearch: {
      jid: undefined,
      condition: undefined,
    },
  }

  state = {
    data: [],
    remain: 0,
    page: 0,
    currentItem: {},
    currentDialogues: [],
    currentMessage: '',
    authInfo: {},
  }

  componentDidMount() {
    this.refreshList()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.advancedSearch !== this.props.advancedSearch) {
      this.refreshList()
    }
    if (newProps.target !== this.props.target) {
      const currentItem =
        this.state.data.find(R.propEq('id', newProps.target)) || {}
      if (!R.isEmpty(currentItem)) {
        this.setState(
          {
            currentItem,
          },
          this.fetchDialog
        )
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.Timer2)
    clearInterval(this.Timer)
  }

  getDialogueHash = () => {
    return `im${R.path(
      ['ucard', 'id'],
      this.props.currentUser
    )}${new Date().getTime()}`
  }

  setTimer = () => {
    this.Timer = setInterval(this.fetchUnrmsg, watchTimeInterval)
  }

  setAuthInfo = (e) =>
    this.setState({
      authInfo: R.path(
        ['target', 'contentWindow', 'share_data', 'auth_info'],
        e
      ),
    })

  setLatestInfo = (data) => {
    this.props.dispatch({
      type: 'resumes/setLatestInfo',
      payload: {
        data,
      },
    })
  }

  refreshDataForLatestMsg = ({ messages }) => {
    const {
      currentItem: { mid: currentMid, recruit_id: currentId },
    } = this.state
    const messagesWithKey = R.indexBy(R.prop('id'), messages)

    if (messages.length === 0) {
      return
    }
    const formatData = this.state.data.map((item) => {
      const { mid, recruit_id: recruitId } = item
      const newMsg = messagesWithKey[mid]

      return newMsg
        ? {
            ...item,
            ...R.pickAll(['last_dialog_timestamp', 'last_dialog_time'], newMsg),
            badge: recruitId === currentId ? 0 : newMsg.badge,
            update: true,
          }
        : {
            ...item,
            update: false,
          }
    })

    this.setState({
      data: formatData,
    })

    const updateData = formatData
      .filter(R.prop('update'))
      .map(
        R.pickAll([
          'recruit_id',
          'last_dialog_timestamp',
          'last_dialog_time',
          'badge',
        ])
      )

    if (updateData.length === 0) {
      return
    }

    this.setLatestInfo(updateData)

    // 如果当前打开的窗口有更新,刷新会话列表
    const currentDialogMewMessage = messages.find(R.propEq('id', currentMid))
    if (currentDialogMewMessage) {
      this.fetchDialog()

      // 如果当前会话有未读消息，则清空未读标志
      if (R.prop('badge', currentDialogMewMessage)) {
        this.clearBadge()
      }
    }
  }

  loadMoreList = () =>
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendList
    )

  refreshList = () =>
    this.setState(
      {
        page: 0,
      },
      () => {
        this.loadList().then(({ data = {} }) => {
          const listLength = R.propOr(0, 'length', data.list)
          const currentItem =
            data.list.find(R.propEq('id', this.props.target)) || {}
          this.setState(
            {
              data: data.list,
              remain: data.remain,
              currentItem,
            },
            R.isEmpty(currentItem) ? () => {} : this.fetchDialog
          )

          if (listLength === 0) {
            clearInterval(this.Timer)
          } else if (!this.Timer || this.Timer === null) {
            this.setTimer()
            if (!this.Timer2) {
              this.Timer2 = setTimeout(this.asyncLatestMsg, 6000)
            }
          }
        })
      }
    )

  appendList = () =>
    this.loadList().then(({ data }) => {
      this.setState(
        {
          data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.list]),
          remain: data.remain,
        },
        this.asyncLatestMsg
      )
    })

  loadList = () => {
    const transformAdvancedSearch = {
      source: R.join(','),
    }
    const advancedSearch = R.mapObjIndexed(
      (v, key) =>
        transformAdvancedSearch[key] ? transformAdvancedSearch[key](v) : v,
      this.props.advancedSearch
    )
    return this.props.dispatch({
      type: 'resumes/fetchResumeList',
      payload: {
        page: this.state.page,
        state: 'follow',
        size: 100,
        ...advancedSearch,
      },
    })
  }

  fetchDialog = () => {
    if (R.isEmpty(this.state.authInfo)) {
      setTimeout(this.fetchDialog, 1000)
      return
    }
    this.props
      .dispatch({
        type: 'im/fetchDialog',
        payload: {
          ...this.state.authInfo,
          mid: this.state.currentItem.mid,
          before_id: 0,
          count: 50,
        },
      })
      .then((data) => {
        this.setState({
          currentDialogues: R.propOr([], 'dialogues', data).reverse(),
        })
      })
  }

  // 从 IM 同步未读消息
  fetchUnrmsg = () => {
    if (R.isEmpty(this.state.authInfo)) {
      setTimeout(this.fetchUnrmsg, 1000)
      return
    }
    this.props
      .dispatch({
        type: 'im/fetchUnrmsg',
        payload: {
          ...this.state.authInfo,
        },
      })
      .then(this.refreshDataForLatestMsg)
  }

  // 从 IM 同步最后会话时间和未读消息数量
  asyncLatestMsg = () => {
    if (this.state.data.length === 0 || R.isEmpty(this.state.authInfo)) {
      return
    }
    this.props
      .dispatch({
        type: 'im/fetchMyMessages',
        payload: {
          ...this.state.authInfo,
          page: 0,
          mids: this.state.data.map(R.prop('mid')).join(','),
        },
      })
      .then(this.refreshDataForLatestMsg)
  }

  clearBadge = () => {
    const { currentItem } = this.state
    this.setState(
      {
        data: this.state.data.map((item) =>
          R.eqProps('mid', currentItem, item) ? { ...item, badge: 0 } : item
        ),
      },
      () => {
        this.props.dispatch({
          type: 'im/clearBadge',
          payload: {
            ...this.state.authInfo,
            last_did: 0,
            mid: currentItem.mid,
          },
        })
      }
    )
  }

  handleModifyState = (recruitId, state) => {
    this.props
      .dispatch({
        type: 'talents/modifyState',
        payload: {
          recruit_ids: recruitId,
          state,
        },
      })
      .then(this.refreshList)
  }

  handleStartDialog = (currentItem) =>
    this.setState(
      {
        currentItem,
      },
      () => {
        this.fetchDialog()
        if (currentItem.badge) {
          this.clearBadge()
        }
      }
    )
  handleSetCurrentMessage = (currentMessage) =>
    this.setState({
      currentMessage,
    })

  handleSendMessage = () => {
    const { currentItem, currentMessage } = this.state
    this.props
      .dispatch({
        type: 'im/sendMessage',
        payload: {
          ...this.state.authInfo,
          text: currentMessage,
          mid: currentItem.mid,
          msghash: this.getDialogueHash(),
        },
      })
      .then((data) => {
        if (data.dialogue) {
          this.setState({
            currentMessage: '',
            currentDialogues: [...this.state.currentDialogues, data.dialogue],
          })
        } else {
          message.error(data.error_msg || '发送失败！')
        }
      })
  }

  render() {
    const {
      currentItem,
      currentDialogues,
      currentMessage,
      data,
      remain,
    } = this.state
    return (
      <div className={styles.content}>
        <div className={styles.dialogList}>
          <div className={styles.dialogListContent}>
            <DialogList
              data={data}
              onClick={this.handleStartDialog}
              remain={remain}
              activeRecruitId={currentItem.recruit_id}
              onStateChange={this.handleModifyState}
              onLoadMore={this.loadMoreList}
              target={this.props.target}
              loading={this.props.listLoading}
            />
          </div>
        </div>
        <div className={styles.dialogDetail}>
          <DialogDetail
            data={currentDialogues}
            onSend={this.handleSendMessage}
            onMessageChange={this.handleSetCurrentMessage}
            message={currentMessage}
            canSend={!R.isEmpty(currentItem)}
            dialogUser={currentItem}
            currentUser={this.props.currentUser}
            authInfo={this.state.authInfo}
          />
        </div>
        <iframe
          style={{ display: 'none' }}
          onLoad={this.setAuthInfo}
          title="im"
          src={IM_URL}
        />
      </div>
    )
  }
}
