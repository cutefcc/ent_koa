import React from 'react'
import { Button, message, Popover, Modal } from 'antd'
import { Icon } from 'mm-ent-ui'
import { redirectToIm } from 'utils'
import PropTypes from 'prop-types'
import ChattingDC from 'components/Common/Chatting'
import ChattingWithTemplate from 'components/Common/ChattingWithTemplate'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import styles from './commonButton.less'

@connect((state) => ({
  jobs: state.global.jobs,
  loading: state.loading.effects['rights/enableDireactContact'],
  auth: state.global.auth,
}))
@withRouter
export default class DirectContactButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    buttonText: PropTypes.string,
    iconType: PropTypes.string,
    trackParam: PropTypes.object,
  }

  static defaultProps = {
    buttonText: '立即沟通',
    iconType: '',
    trackParam: {},
  }

  state = {
    showInviteModal: false,
    showEmptyPositionTip: false,
    hasContact: false,
  }

  handleSubmit = (content, jid, cb) => {
    const {
      auth: { isTalentBankStable },
      talents,
      trackParam,
    } = this.props
    const uid = R.pathOr(0, [0, 'id'], talents)
    const fr = trackParam.fr
    if (!uid) {
      message.error('没有选中的候选人')
      return
    }

    if (!jid && !isTalentBankStable) {
      message.error('请选择职位')
      return
    }

    // 打点
    const param = {
      datetime: new Date().getTime(),
      u2: uid,
      uid: window.uid,
      jid,
      ...this.props.trackParam,
    }
    this.trackClickEvent('jobs_pc_talent_dc_confirm', param)

    this.props
      .dispatch({
        type: 'rights/enableDireactContact',
        payload: {
          to_uid: uid,
          jid,
          greet: content,
          fr: fr ? fr : 'talentDiscover',
        },
      })
      .then(({ data = {} }) => {
        this.setState({
          showInviteModal: false,
          hasContact: true,
        })

        // eslint-disable-next-line no-bitwise
        if (((parseInt(data.error_code, 10) || 0) & 1) === 1) {
          message.error(data.error_msg || '该用户已经设置了关闭直聊') // ，请刷新页面使用极速联系
          return
        }

        // 打点
        const eventParam = {
          datetime: new Date().getTime(),
          u2: uid,
          uid: window.uid,
          jid,
          dc_id: data.dc_id,
          mid: data.mid,
          ...this.props.trackParam,
        }
        this.trackClickEvent('jobs_pc_talent_dc_success', eventParam)
        if (cb && typeof cb === 'function') {
          cb(data)
        } else {
          redirectToIm(uid)
        }
      })
  }

  trackClickEvent = (eventName, param) => {
    if (window.voyager) {
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  handleShowInvite = () => {
    const { auth } = this.props
    // 打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
      }
      const key = 'jobs_pc_talent_dc_click'
      window.voyager.trackEvent(key, key, param)
    }

    // 如果是个人会员，且没有发布职位，则引导发布职位
    if (!this.props.jobs.length && !auth.isTalentBankStable) {
      this.setState({
        showEmptyPositionTip: true,
      })
      return
    }
    this.setState({
      showInviteModal: true,
    })
    // e.stopPropagation()
  }

  handleCancel = () => {
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

  handleJobSelect = (job) => {
    const param = {
      datetime: new Date().getTime(),
      u2: this.props.talents.map(R.prop('id')).join(','),
      uid: window.uid,
      jid: job.jid,
      ejid: job.ejid,
      ...this.props.trackParam,
    }
    this.trackClickEvent('jobs_pc_talent_dc_select_job', param)
  }

  handleRedirectToIm = () => {
    const talent = this.props.talents[0]
    const { id } = talent
    if (!id) {
      message.error('聊天异常,请刷新页面')
    }
    redirectToIm(id)
  }

  render() {
    const {
      disabled,
      className,
      onClick,
      iconType,
      buttonText,
      talents,
      auth,
      trackParam,
    } = this.props
    const hasContact =
      (talents.length === 1 && talents[0].recent_dc_chat) ||
      this.state.hasContact // 是否已经直聊

    const button = (
      <Button
        onClick={
          onClick ||
          (hasContact ? this.handleRedirectToIm : this.handleShowInvite)
        }
        disabled={disabled}
        className={`${className} ${hasContact ? 'primary-button-2' : ''}`}
      >
        {iconType ? (
          <Icon
            type={this.props.iconType}
            className={styles.icon}
            theme="outlined"
          />
        ) : null}
        {hasContact ? '继续沟通' : buttonText}
      </Button>
    )

    const Chatting = auth.isTalentBankStable ? ChattingWithTemplate : ChattingDC

    return (
      <div className="directChatButtonPanel">
        {buttonText === '' && !disabled ? (
          <Popover placement="topLeft" content="直聊" trigger="hover">
            {button}
          </Popover>
        ) : (
          button
        )}
        {this.state.showInviteModal && (
          <Chatting
            talents={talents}
            onSubmit={this.handleSubmit}
            onSelectJob={this.handleJobSelect}
            onCancel={this.handleCancel}
            jid={this.props.jid}
            allJobs={this.props.jobs}
            title="立即沟通"
            showMessage={false}
            loading={this.props.loading}
            show
            fr={trackParam.fr}
            fromProfile={trackParam.fromProfile}
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
