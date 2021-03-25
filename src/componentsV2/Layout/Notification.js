/** TODO: this file has been give up, please delete it when there is a stable version online */
import React from 'react'
import { notification } from 'antd'
import { Icon, Button, Message } from 'mm-ent-ui'

import * as R from 'ramda'
import { connect } from 'react-redux'

import * as styles from './notification.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  aiCallPositiveIntension: state.global.aiCallPositiveIntension,
}))
export default class GlobalNotification extends React.Component {
  componentWillReceiveProps(newProps) {
    // 获取到用户信息后，通过用户信息是否有 ai call 的权限，确定是否添加定时任务后取 ai call 的动态
    if (
      this.props.currentUser === newProps.currentUser ||
      !R.prop('show_calls', newProps.currentUser)
    ) {
      return
    }

    // 获取ai call 实时动态
    this.fetchAiCallRuntime()
    // 获取所有正意向列表
    this.fetchAiCallPositiveIntension()

    if (!this.timer) {
      this.timer = setInterval(this.fetchAiCallRuntime, 10000)
    }

    // 监听tab隐藏事件，当tab不在可视范围，则取消定时任务
    this.listenVisibilityChange()
  }

  componentWillUnmount() {
    notification.destroy()

    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  listenVisibilityChange = () => {
    const cond = R.cond([
      [() => 'hidden' in document, R.always('hidden')],
      [() => 'webkitHidden' in document, R.always('webkitHidden')],
      [() => 'mozHidden' in document, R.always('mozHidden')],
    ])
    const hiddenProperty = cond()
    const visibilityChangeEvent = hiddenProperty.replace(
      /hidden/i,
      'visibilitychange'
    )
    const onVisibilityChange = () => {
      if (document[hiddenProperty]) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        return
      }
      this.timer = setInterval(this.fetchAiCallRuntime, 10000)
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
  }

  fetchAiCallRuntime = () => {
    this.props.dispatch({
      type: 'global/fetchAiCallRuntime',
    })
  }

  fetchAiCallPositiveIntension = () => {
    this.props.dispatch({
      type: 'global/fetchAiCallPositiveIntension',
    })
  }

  handleDestoryNotification = ({ id }) => () => {
    notification.close(`${id}`)
    const destoryIds = window.localStorage.getItem(
      'MaiEntDestoryCallNotificationIds'
    )
    window.localStorage.setItem(
      'MaiEntDestoryCallNotificationIds',
      `${destoryIds},${id}`
    )
  }

  handleSendTipForConnectByTelphone = (data) => () => {
    // app 中会推送消息，点击跳转至拨打电话页面
    if (!data.reach_id) {
      Message.error('当前没有会话消息')
      return
    }

    Message.info('已在脉脉 app 为您下发一条消息，点击拨打电话!')

    this.props.dispatch({
      type: 'rights/sendTipForConnectByTelphone',
      payload: {
        reach_id: data.reach_id,
      },
    })
  }

  // eslint-disable-next-line max-statements
  renderNotification = (item) => {
    const { process_state: state } = item
    const destoryIds =
      window.localStorage.getItem('MaiEntDestoryCallNotificationIds') || ''
    if (destoryIds.split(',').includes(`${item.id}`)) {
      return null
    }

    const config = {}
    const talentInfo = `${item.company || ''}${item.position || ''}·${
      item.name
    }`
    const cancelButton = (
      <Button
        type="ghost-2"
        onClick={this.handleDestoryNotification(item)}
        className={styles.button}
      >
        我知道了
      </Button>
    )

    // if (state === 1) {
    //   const mobileLastFour = R.pathOr(
    //     '',
    //     ['ucard', 'mobile_last_four'],
    //     this.props.currentUser
    //   )
    //   config.message1 = `正在与`
    //   config.message2 = `确认意向, 请保持尾号为${mobileLastFour}的电话畅通。`
    //   config.button = null
    //   config.iconClass = styles.callingIcon
    // }

    if (state === 2) {
      config.message1 = ''
      config.message2 =
        '意向已确认，你可以进入APP消息列表下的“电话直联助手”继续沟通'
      config.button = cancelButton
      config.iconClass = styles.successIcon
      // eslint-disable-next-line no-lone-blocks
      {
        // <span>
        //   <Button
        //     type="ghost-2"
        //     onClick={this.handleDestoryNotification(item)}
        //   >
        //     暂不联系
        //   </Button>
        //   <Button
        //     type="ghost-2"
        //     onClick={this.handleSendTipForConnectByTelphone(item)}
        //     className="margin-left-16"
        //   >
        //     立即回拨
        //   </Button>
        // </span>
      }
    }

    // if (state === 4) {
    //   config.message1 = ''
    //   config.message2 = '未能接通，请1小时后重试或继续联系其它候选人。'
    //   config.button = cancelButton
    //   config.iconClass = styles.breakIcon
    // }

    // if (state === 5 || state === 7) {
    //   config.message1 = ''
    //   config.message2 = '暂不考虑机会，请联系其它候选人。'
    //   config.button = cancelButton
    //   config.iconClass = styles.refuseIcon
    // }

    // if (state === 6) {
    //   config.message1 = ''
    //   config.message2 = '沟通超时，请继续联系其它候选人。'
    //   config.button = cancelButton
    //   config.iconClass = styles.breakIcon
    // }

    // if (state === 8) {
    //   config.message1 = ''
    //   config.message2 = '沟通请求下发失败，请重试。'
    //   config.button = cancelButton
    //   config.iconClass = styles.breakIcon
    // }

    if (R.isEmpty(config)) {
      return null
    }

    const message = (
      <div className="flex space-between flex-align-center">
        <span className={`${styles.messageContent} ellipsis font-weight-bold`}>
          <span className="font-weight-common">{config.message1}</span>
          <span className={`${styles.talentInfo} ellipsis`}>{talentInfo}</span>
          <span className="font-weight-common">{config.message2}</span>
        </span>
        {config.button}
      </div>
    )

    setTimeout(() => {
      notification.open({
        message,
        placement: 'bottomRight',
        key: `${item.id}`,
        duration: null,
        icon: <Icon type="icon_call" className={config.iconClass} />,
        className: `${styles.globalNotification}`,
      })
    }, 10)

    return null
  }

  render() {
    const { aiCallPositiveIntension } = this.props
    // const {aiCallState = [], lastAiCallState} = this.state
    // const lastIds = lastAiCallState.map(R.prop('id'))
    // const currentIds = aiCallState.map(R.prop('id'))
    // const destoryIds = R.difference(lastIds, currentIds)

    // 销毁已经消失的状态
    // R.forEach(key => {
    //   notification.close(`${key}`)
    // }, destoryIds)

    if (!R.isEmpty(aiCallPositiveIntension)) {
      R.forEach(this.renderNotification, aiCallPositiveIntension)
    }
    return null
  }
}
