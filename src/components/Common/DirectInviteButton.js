import React from 'react'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Button, message, Popover, Modal } from 'antd'
import PropTypes from 'prop-types'
// import {COMMON_INIT_MESSAGE} from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as R from 'ramda'

import styles from './commonButton.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  jobs: state.global.jobs,
  loading: state.loading.effects['rights/directInvite'],
}))
@withRouter
export default class DirectInviteButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    source: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    // iconType: PropTypes.string,
    onInviteFinish: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    fr: PropTypes.string,
  }

  static defaultProps = {
    buttonText: '立即邀约',
    // iconType: 'plus',
    // iconType: '',
    onInviteFinish: () => {},
    disabled: false,
    className: '',
    fr: '',
  }

  state = {
    showInviteModal: false,
    showEmptyPositionTip: false,
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleSubmitInvite = (content, jid) => {
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
        type: 'rights/directInvite',
        payload: {
          to_uids: ids.join(','),
          jid,
          source,
          fr: this.props.fr || 'business',
          group: currentUser.group,
          label: JSON.stringify(labelStatic),
          hi: content,
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
    const {
      currentUser: { role = '' },
      auth,
    } = this.props
    // 如果是个人会员，且没有发布职位，则引导发布职位
    // 排除v3版本
    if (
      role === 'personalUser' &&
      !this.props.jobs.length &&
      !auth.isTalentBankStable
    ) {
      this.setState({
        showEmptyPositionTip: true,
      })
      return
    }
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

  handleRedirectToCreatePosition = () => {
    this.props.history.push('/ent/talents/recruit/positions/add')
  }

  handleHideTip = () => {
    this.setState({
      showEmptyPositionTip: false,
    })
  }

  render() {
    const button = (
      <Button
        onClick={this.props.onClick || this.handleShowInvite}
        disabled={this.props.disabled}
        className={this.props.className}
      >
        {this.props.iconType ? (
          <LegacyIcon
            type={this.props.iconType}
            className={styles.icon}
            theme="outlined"
          />
        ) : null}
        {this.props.buttonText}
      </Button>
    )

    return (
      <div className="directChatButtonPanel">
        {this.props.buttonText === '' && !this.props.disabled ? (
          <Popover placement="topLeft" content="立即邀约" trigger="hover">
            {button}
          </Popover>
        ) : (
          button
        )}
        {this.state.showInviteModal && (
          <Chatting
            // initMessage={COMMON_INIT_MESSAGE}
            talents={this.props.talents}
            onSubmit={this.handleSubmitInvite}
            onCancel={this.handleCancelInvite}
            // key="directModal"
            // showPosition
            jid={this.props.jid}
            allJobs={this.props.jobs}
            loading={this.props.loading}
            title="立即邀约"
            // mode="connect"
            show
          />
        )}
        {this.state.showEmptyPositionTip && (
          <Modal
            title=""
            className={styles.tip}
            width={400}
            footer={
              <div className={styles.footer}>
                <Button
                  onClick={this.handleHideTip}
                  className={styles.giveupButton}
                >
                  取消
                </Button>
                <Button
                  className={styles.applyButton}
                  onClick={this.handleRedirectToCreatePosition}
                >
                  去发职位
                </Button>
              </div>
            }
            onCancel={this.handleHideTip}
            visible
            destroyOnClose
          >
            <p className="font-size-20 text-center">发布职位后，才可进行邀约</p>
          </Modal>
        )}
      </div>
    )
  }
}
