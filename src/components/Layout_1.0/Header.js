import React from 'react'
import { Popover, message } from 'antd'
import { Modal, Icon, Button } from 'mm-ent-ui'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import { redirectToIm } from 'utils'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import urlencode from 'urlencode'
import { receive } from 'utils/web_broadcast'
import * as Cookies from 'tiny-cookie'
import BreadCrumb from './BreadCrumb'
import styles from './header.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  unreadMsg: state.global.unreadMsg,
}))
@withRouter
export default class MyHeader extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      unReadMsgBadge: 0,
    }
    this.msgWorker = null
  }

  componentDidMount() {
    // this.fetchUnReadMsg()
    this.listenUnreadMsg()

    // this.timer = setInterval(this.fetchUnReadMsg, 10000)

    // 当 tab 隐藏的时候取消定时任务，节省资源
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
      } else {
        // this.timer = setInterval(this.fetchUnReadMsg, 10000)
      }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  listenUnreadMsg = () => {
    if (!('SharedWorker' in window)) return
    const { currentUser } = this.props
    this.msgWorker = new SharedWorker(
      '/static/scripts/chat/msg_worker.js?v=1.9.0',
      {
        name: 'msg-worker',
      }
    )
    this.msgWorker.port.start()
    const u = Cookies.getCookie('u')
    const authInfo = {
      u,
      web_uid: R.pathOr('', ['ucard', 'webuid'], currentUser),
    }
    this.msgWorker.port.postMessage({
      method: 'init',
      data: {
        auth_info: authInfo,
      },
    })

    this.msgWorker.port.onmessage = (e) => {
      const { method, data } = e.data
      if (method === 'updateMessages') {
        // eslint-disable-next-line no-console
        console.log('data=====socket 回调', data)
        this.setState({
          unReadMsgBadge: data.badges || 0,
        })
      }
    }

    receive('pc_im_update_messages_to_recruit_fe', (data) => {
      const { badges } = data
      const { unReadMsgBadge } = this.state
      if (badges !== unReadMsgBadge) {
        this.setState({
          unReadMsgBadge: data.badges || 0,
        })
      }
    })
  }

  fetchUnReadMsg = () => {
    this.props.dispatch({
      type: 'global/fetchUnReadMsg',
    })
  }

  handleRedirectIm = () => {
    redirectToIm()
  }

  handleRedirectAccount = () => {
    if (this.props.currentUser.license) {
      this.props.history.push('/ent/asset/personal/')
    }
  }

  handleUnbind = () => {
    Modal.confirm({
      title: '确认退出企业会员?',
      content:
        '退出企业会员后，你的license将会失效，需要联系你的管理员重新认证，是否确认退出企业会员？',
      cancelText: '确认退出',
      okText: '我再想想',
      width: 440,
      onCancel: () => {
        this.props
          .dispatch({
            type: 'global/unBind',
          })
          .then(() => {
            message.success('解除绑定成功')
            window.location.href = 'https://maimai.cn'
          })
      },
      className: styles.unBindModal,
      type: 'stress',
    })
  }

  renderPop = () => {
    const { currentUser } = this.props
    const balance = (
      <div className={styles.balance}>
        <span
          onClick={this.handleRedirectAccount}
          className="like-link-button color-common"
        >
          账户余额
          <Icon type="arrow-right-2" className={styles.icon} />
        </span>
        <div>
          <span className="color-stress font-size-16 font-weight-bold">
            {R.pathOr(0, ['license', 'balance'], currentUser)}
          </span>
          <span className="color-dilution margin-left-8">点</span>
        </div>
      </div>
    )
    const buttons = (
      <div className="flex flex-column margin-top-24">
        <a
          href={`https://acc.maimai.cn/login?to=${urlencode(
            window.location.href
          )}`}
        >
          <Button type="button_m_exact_blue450" className="width-p100">
            退出登录
          </Button>
        </a>
        {R.prop('identity', currentUser) !== 3 && (
          <Button
            className="margin-top-8 color-dilution"
            type="button_m_exact_link_bgray"
            onClick={this.handleUnbind}
          >
            退出企业会员
          </Button>
        )}
      </div>
    )

    return (
      <div className={styles.accountPop}>
        {balance}
        {buttons}
      </div>
    )
  }

  render() {
    const { currentUser } = this.props
    const { unReadMsgBadge = 0 } = this.state
    return (
      <div className={styles.header}>
        <div className={styles.breadCrumb}>
          <BreadCrumb />
        </div>
        <div className={styles.avatar}>
          <span className={styles.imEnter} onClick={this.handleRedirectIm}>
            <Icon
              type="im_enter"
              className={`${styles.icon} ${styles.blink}`}
              key={unReadMsgBadge}
            />
            {unReadMsgBadge > 0 && (
              <span className={styles.unreadNum}>{unReadMsgBadge}</span>
            )}
          </span>
          <Popover
            placement="bottomRight"
            content={this.renderPop()}
            trigger="click"
          >
            <div style={{ height: '58px' }}>
              <Avatar
                avatar={R.path(['ucard', 'avatar'], currentUser)}
                name={R.pathOr('', ['ucard', 'name'], currentUser)}
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '20px',
                  lineHeight: '32px',
                  borderRadius: '16px',
                  margin: '16px 0',
                }}
              />
            </div>
          </Popover>
        </div>
      </div>
    )
  }
}
