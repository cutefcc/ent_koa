import React from 'react'
import { Button, message } from 'antd'
import PropTypes from 'prop-types'
import { COMMON_INIT_MESSAGE } from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import { connect } from 'react-redux'

import * as R from 'ramda'

import styles from './commonButton.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  jobs: state.global.jobs,
  loading: state.loading.effects['resumes/sendMessage'],
}))
export default class InviteButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    source: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    // iconType: PropTypes.string,
    onInviteFinish: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    buttonText: '邀请投递',
    // iconType: 'plus',
    // iconType: '',
    onInviteFinish: () => {},
    disabled: false,
    className: '',
  }

  state = {
    showInviteModal: false,
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleSubmitInvite = (content, jid) => {
    if (!jid) {
      message.error('请选择一个职位')
      return
    }

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
        type: 'resumes/sendMessage',
        payload: {
          to_uids: ids.join(','),
          content,
          jid,
          communication: 'direct_im',
          source,
          group: currentUser.group,
          label: JSON.stringify(labelStatic),
        },
      })
      .then((res) => {
        message.success('发送邀请成功')
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
    return (
      <div>
        <Button
          onClick={this.handleShowInvite}
          disabled={this.props.disabled}
          className={`${styles.operation} ${this.props.className}`}
        >
          {/* <Icon type={this.props.iconType} className={styles.icon} /> */}
          {this.props.buttonText}
        </Button>
        {this.state.showInviteModal && (
          <Chatting
            initMessage={COMMON_INIT_MESSAGE}
            talents={this.props.talents}
            onSend={this.handleSubmitInvite}
            onCancel={this.handleCancelInvite}
            key="inviteModal"
            showPosition
            allJobs={this.props.jobs}
            loading={this.props.loading}
            mode="invite"
            show
          />
        )}
      </div>
    )
  }
}
