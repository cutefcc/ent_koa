import React from 'react'
import { message } from 'antd'
import { Icon, Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { COMMON_INIT_MESSAGE } from 'constants/resume'
import { connect } from 'react-redux'
import * as R from 'ramda'

import Chatting from './ChattingDirect'
import styles from './../button.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  jobs: state.global.jobs,
  loading: state.loading.effects['channels/send'],
}))
export default class ChannelInviteButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    source: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    // iconType: PropTypes.string,
    onInviteFinish: PropTypes.func,
    disabled: PropTypes.bool,
    // className: PropTypes.string,
    channelId: PropTypes.instanceOf.isRequired,
  }

  static defaultProps = {
    buttonText: '极速联系',
    // iconType: 'plus',
    // iconType: '',
    onInviteFinish: () => {},
    disabled: false,
    // className: '',
  }

  state = {
    showInviteModal: false,
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleSubmitInvite = (content, jid, communication) => {
    const { talents, source, currentUser } = this.props
    const ids = talents.map(R.prop('id'))
    const labels = talents.reduce((res, item) => {
      const labelList = R.propOr([], 'highlights', item).map(R.prop('id'))
      return [...res, ...labelList]
    }, [])
    const labelGroup = R.groupBy((item) => item)(labels)
    const labelStatic = R.mapObjIndexed(R.prop('length'))(labelGroup)
    this.props
      .dispatch({
        type: 'channels/send',
        payload: {
          to_uids: ids.join(','),
          content,
          jid,
          communication,
          source,
          group: currentUser.group,
          label: JSON.stringify(labelStatic),
          channel_id: this.props.channelId,
        },
      })
      .then((res) => {
        message.success('发送成功')
        this.refreshCurrentUser()
        this.props.onInviteFinish(ids, res)
        this.handleCancelInvite()
      })
  }

  handleShowInvite = (e) => {
    this.setState({
      showInviteModal: true,
    })
    e.stopPropagation()
  }

  handleCancelInvite = () => {
    this.setState({
      showInviteModal: false,
    })
  }

  render() {
    const defaultJid = R.pathOr('', ['jobs', 0, 'jid'], this.props)
    return (
      <div>
        <Button
          onClick={this.handleShowInvite}
          disabled={this.props.disabled}
          // className={`${styles.operation} ${this.props.className}`}
          type={this.props.type || 'primary'}
        >
          {this.props.iconType && (
            <Icon type={this.props.iconType} className={styles.icon} />
          )}
          {this.props.buttonText}
        </Button>
        {this.state.showInviteModal && (
          <Chatting
            initMessage={COMMON_INIT_MESSAGE}
            talents={this.props.talents}
            onSend={this.handleSubmitInvite}
            onCancel={this.handleCancelInvite}
            key="directModal"
            showPosition
            allJobs={this.props.jobs}
            mode="connect"
            show
            jid={defaultJid}
            loading={this.props.loading}
          />
        )}
      </div>
    )
  }
}
