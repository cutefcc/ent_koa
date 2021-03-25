import React from 'react'
import { message, Popover, Modal } from 'antd'
import { redirectToIm } from 'utils'
import { Icon, Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import ChattingDC from './../Chatting'
import ChattingWithTemplate from './../ChattingWithTemplate'
import styles from './../button.less'

@connect((state) => ({
  jobs: state.global.jobs,
  loading: state.loading.effects['rights/enableDireactContact'],
  auth: state.global.auth,
  currentUser: state.global.currentUser,
}))
@withRouter
export default class DirectContactButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    buttonText: PropTypes.string,
    iconType: PropTypes.string,
    trackParam: PropTypes.object,
    isBatch: PropTypes.bool,
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
      trackParam,
    } = this.props
    const fr = trackParam.fr
    // 支持批量立即沟通
    if (!jid && !isTalentBankStable) {
      message.error('请选择职位')
      return
    }

    // 过滤不需要消耗劵的人才
    const talentsFilter = this.props.talents.filter(
      (item) =>
        R.pathOr('0', ['recent_dc_chat'], item) !== 1 &&
        R.pathOr('0', ['is_direct_im'], item) !== 1
    )

    // const uid = R.pathOr(0, [0, 'id'], this.props.talents)
    const uidArray = talentsFilter.map((data) => {
      // 打点
      const param = {
        datetime: new Date().getTime(),
        u2: data.id,
        uid: window.uid,
        jid,
        ...this.props.trackParam,
      }
      this.trackClickEvent('jobs_pc_talent_dc_confirm', param)
      return data.id
    })
    const uid = uidArray.join(',')

    if (!uid) {
      message.error('没有选中的候选人')
      return
    }

    if (R.pathOr(false, ['props', 'isBatch'], this)) {
      // 批量立即沟通
      this.props
        .dispatch({
          type: 'rights/enableDireactContactBatch',
          payload: {
            to_uids: uid,
            jid,
            fr:
              R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 &&
              this.props.fr
                ? this.props.fr || fr
                : fr || 'talentDiscover',
            greet: content,
          },
        })
        .then(({ data = [] }) => {
          this.setState({
            showInviteModal: false,
            // hasContact: true, 批量沟通沟通不能根据界面状态显示继续沟通
          })

          data.map((tempData) => {
            // eslint-disable-next-line no-bitwise
            if (((parseInt(tempData.error_code, 10) || 0) & 1) === 1) {
              message.error(tempData.error_msg || '该用户已经设置了关闭直聊') // ，请刷新页面使用极速联系
              return false
            }
            // eslint-disable-next-line no-bitwise
            if ((parseInt(tempData.error_code, 10) || 0) > 0) {
              message.error(tempData.error_msg || '暂无法发起直聊')
              return false
            }
            // if (data.toast) {
            //   message.info(data.toast)
            // }
            window.broadcast.send('directContactSuccess', [tempData.to_uid])

            // 标识为已沟通
            this.setRecentDcChat()

            this.refreshCurrentUser()

            // 打点
            const eventParam = {
              datetime: new Date().getTime(),
              u2: tempData.to_uid,
              uid: window.uid,
              jid,
              dc_id: tempData.dc_id,
              mid: tempData.mid,
              ...this.props.trackParam,
            }
            this.trackClickEvent('jobs_pc_talent_dc_success', eventParam)

            // 取消人才卡片选中状态
            this.props.onContactFinish()

            return true
          })
        })
    } else {
      // 单独立即沟通
      this.props
        .dispatch({
          type: 'rights/enableDireactContact',
          payload: {
            to_uid: uid,
            jid,
            greet: content,
            fr:
              R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 &&
              this.props.fr
                ? this.props.fr || fr
                : fr || 'talentDiscover',
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
          // eslint-disable-next-line no-bitwise
          if ((parseInt(data.error_code, 10) || 0) > 0) {
            message.error(data.error_msg || '暂无法发起直聊')
            return
          }
          if (data.toast) {
            message.info(data.toast)
          }
          window.broadcast.send('directContactSuccess', [uid])

          // 标识为已沟通
          this.setRecentDcChat()

          this.refreshCurrentUser()

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
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  setRecentDcChat = () => {
    R.pathOr([], ['props', 'talents'], this).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.recent_dc_chat = 1
    })
  }

  trackClickEvent = (eventName, param) => {
    if (window.voyager) {
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  handleShowInvite = async () => {
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

    const memId = R.pathOr(6, ['props', 'currentUser', 'mem', 'mem_id'], this)
    const memSt = R.pathOr(1, ['props', 'currentUser', 'mem', 'mem_st'], this)
    const onGetUserLimit = R.pathOr(null, ['props', 'onGetUserLimit'], this)
    const flag = (memId === 5 || memId === 6) && memSt === 1
    if (!flag && onGetUserLimit) {
      const result = await onGetUserLimit(this.props.talents)
      if (result) {
        return
      }
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
    const { auth } = this.props
    const path = auth.isEnterpriseRecruiter
      ? '/ent/v2/job/positions/publish'
      : '/ent/talents/recruit/positions/add'
    this.props.history.push(path)
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

  handleRedirectToIm = async () => {
    const memId = R.pathOr(6, ['props', 'currentUser', 'mem', 'mem_id'], this)
    const memSt = R.pathOr(1, ['props', 'currentUser', 'mem', 'mem_st'], this)
    const flag = (memId === 5 || memId === 6) && memSt === 1
    if (!flag) {
      const result = await this.props.onGetUserLimit(this.props.talents)
      if (result) {
        return
      }
    }
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
    let hasContact
    if (R.pathOr(false, ['props', 'isBatch'], this)) {
      hasContact = false
    } else {
      hasContact =
        (talents.length === 1 &&
          (talents[0].recent_dc_chat || talents[0].is_direct_im === 1)) ||
        this.state.hasContact // 是否已经直聊
    }

    const button = (
      <Button
        onClick={
          onClick ||
          (hasContact ? this.handleRedirectToIm : this.handleShowInvite)
        }
        disabled={disabled}
        // className={`${className} ${hasContact ? 'primary-button-2 ' : ''}`}
        className={className || ''}
        type={this.props.type || 'primary'}
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
            isBatch={this.props.isBatch}
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
