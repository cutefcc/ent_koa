import React from 'react'
import { Button, message, Popover, Modal } from 'antd'
import { Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
// import {COMMON_INIT_MESSAGE} from 'constants/resume'
import Chatting from 'components/Common/Chatting'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'

import * as R from 'ramda'

import styles from './commonButton.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  jobs: state.global.jobs,
  loading: state.loading.effects['resumes/sendDirectMessage'],
}))
export default class DirectChatButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    buttonText: PropTypes.string,
    // iconType: PropTypes.string,
    onInviteFinish: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    trackParam: PropTypes.object,
  }

  static defaultProps = {
    buttonText: '极速联系',
    // iconType: 'plus',
    // iconType: '',
    onInviteFinish: () => {},
    disabled: false,
    className: '',
    trackParam: {},
  }

  state = {
    showInviteModal: false,
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleResult = ({ data = [] }, jid) => {
    const successItems = data.filter(R.propEq('errorcode', 0))
    const failItems = data.filter(R.compose(R.not, R.propEq('errorcode', 0)))
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        jid,
        ...this.props.trackParam,
        // uh_id: successItems.map(R.prop('equity_id')).join(','),
        u2: R.zipObj(
          successItems.map(R.prop('to_uid')),
          successItems.map(R.prop('equity_id'))
        ),
      }
      const key = 'jobs_pc_talent_uh_success'
      window.voyager.trackEvent(key, key, param)
    }

    if (failItems.length === 0) {
      message.success('发送极速联系成功')
      return ''
    }
    Modal.error({
      title: `${failItems.length}位人才联系失败`,
      content: this.renderFailItems(failItems),
      className: styles.failTip,
      okText: '我知道了',
    })
    return null
  }

  handleSubmitInvite = (content, jid) => {
    const { talents, source, currentUser } = this.props
    const ids = talents.map(R.prop('id'))
    const labels = talents.reduce((res, item) => {
      const labelList = R.propOr([], 'highlights', item).map(R.prop('id'))
      return [...res, ...labelList]
    }, [])
    const labelGroup = R.groupBy((item) => item)(labels)
    const labelStatic = R.mapObjIndexed(R.prop('length'))(labelGroup)

    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
        uid: window.uid,
        jid,
      }
      const key = 'jobs_pc_talent_uh_confirm'
      window.voyager.trackEvent(key, key, param)
    }

    this.props
      .dispatch({
        type: 'resumes/sendDirectMessage',
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
        this.handleResult(res, jid)
        this.refreshCurrentUser()
        this.props.onInviteFinish(ids, res)
        this.handleCancelInvite()
      })
  }

  handleShowInvite = (e) => {
    const {
      currentUser: { role = '' },
    } = this.props
    // 打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
        uid: window.uid,
      }
      const key = 'jobs_pc_talent_uh_click'
      window.voyager.trackEvent(key, key, param)
    }
    // 如果是个人版，且没有极速联系的券，则提示开通
    if (
      role === 'personalUser' &&
      !R.pathOr(0, ['mem', 'fast_contact'], this.props.currentUser)
    ) {
      this.props.dispatch({
        type: 'global/setMemberOpenTip',
        payload: {
          show: true,
          msg:
            '联系劵额度不足，请至脉脉APP购买叠加包获取更多额度或开通企业会员解锁更多权益。',
          cancelTxt: '放弃开通',
          confirmTxt: '立即开通',
        },
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

  handleSelectJob = (job) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
        uid: window.uid,
        jid: job.jid,
        ejid: job.ejid,
      }
      const key = 'jobs_pc_talent_uh_select_job'
      window.voyager.trackEvent(key, key, param)
    }
  }

  renderAvatar = (item) => {
    const { avatar = '', name = '' } = item
    const style = {
      width: '40px',
      height: '40px',
      fontSize: '24px',
      lineHeight: '40px',
      borderRadius: '20px',
    }

    return <Avatar avatar={avatar} name={name} style={style} />
  }

  renderFailItems = (items) => {
    return items.map((item) => (
      <div key={item.name} className="margin-top-16 flex">
        {this.renderAvatar(item)}
        <span className="flex-column space-between margin-left-16">
          <span>
            <span className="font-size-16 color=-common">{item.name}</span>
            <span className="color-dilution font-size-14 margin-left-16">
              {`${item.company}·${item.position}`}
            </span>
          </span>
          <span className="color-diution font-size-12 color-red">
            {item.msg}
          </span>
        </span>
      </div>
    ))
  }

  render() {
    const button = (
      <Button
        onClick={this.props.onClick || this.handleShowInvite}
        disabled={this.props.disabled}
        className={`${this.props.className} ${styles.operation}`}
      >
        {this.props.iconType ? (
          <Icon
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
          <Popover placement="topLeft" content="极速联系" trigger="hover">
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
            onSelectJob={this.handleSelectJob}
            jid={this.props.jid}
            // key="directModal"
            // showPosition
            allJobs={this.props.jobs}
            // mode="connect"
            loading={this.props.loading}
            show
          />
        )}
      </div>
    )
  }
}
