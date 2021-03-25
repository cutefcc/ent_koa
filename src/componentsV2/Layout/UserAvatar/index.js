import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import urlencode from 'urlencode'
// TODO 这个函数是做什么的？需要调研一下，感觉不应该放在这里呢，先挪过来吧
import { removeIsFirstShowStrongIntentions } from 'utils/talentDiscover'
import { Icon, Popover, Button, Modal, Message } from 'mm-ent-ui'
import Avatar from 'componentsV2/Common/Avatar'
import styles from './../index.less'

@withRouter
@connect((state) => ({
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
  unreadMsg: state.global.unreadMsg,
  aiCallState: state.global.aiCallState,
  memberOpenTip: state.global.memberOpenTip,
  memberUpgradeTip: state.global.memberUpgradeTip,
  auth: state.global.auth,
  strongIntentions: state.talentDiscover.strongIntentions,
  viewedStrong: state.talentDiscover.viewedStrong,
}))
export default class MyLayout extends React.PureComponent {
  handleRedirectAccount = () => {
    if (this.props.currentUser.license) {
      this.props.history.push('/ent/v2/asset/personal/')
    }
  }

  handleLogout = () => {
    removeIsFirstShowStrongIntentions()
  }

  handleUnbind = () => {
    Modal.confirm({
      title: '确认退出企业会员?',
      content:
        '退出企业会员后，你的license将会失效，需要联系你的管理员重新认证，是否确认退出企业会员？',
      cancelText: '我再想想',
      okText: '确认退出',
      width: 440,
      onOk: () => {
        this.props
          .dispatch({
            type: 'global/unBind',
          })
          .then(() => {
            Message.success('解除绑定成功')
            window.location.href = 'https://maimai.cn'
          })
      },
      onCancel: () => {
        removeIsFirstShowStrongIntentions()
      },
      maskClosable: true,
      className: styles.unBindModal,
      type: 'stress',
    })
  }

  renderLeftAsset = () => {
    const { currentUser } = this.props
    const balance = R.pathOr(0, ['license', 'balance'], currentUser)
    const addFr = R.pathOr(0, ['mem', 'add_fr'], currentUser)
    const fastContact = R.pathOr(0, ['mem', 'fast_contact'], currentUser)
    const fastChat = R.pathOr(0, ['direct_oppo'], currentUser)
    const equitySysType = R.propOr(1, 'equity_sys_type', currentUser)
    const reachNbr = R.pathOr(0, ['reach', 'reach_nbr'], currentUser)
    const reachType = R.pathOr(0, ['reach', 'reach_type'], currentUser)

    const dotDom = () => (
      <div>
        <span className="color-stress font-size-16 font-weight-bold">
          {balance}
        </span>
        <span className="color-dilution margin-left-8">点</span>
      </div>
    )

    const couponDom = () => (
      <div className={styles.coupon}>
        <p className={styles.text}>
          加好友券 <span className={styles.value}>{addFr}</span> 张
        </p>
        {R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 ? (
          <p className={styles.text}>
            立即沟通券 <span className={styles.value}>{fastChat}</span> 张
          </p>
        ) : (
          <p className={styles.text}>
            极速联系券 <span className={styles.value}>{fastContact}</span> 张
          </p>
        )}
        {reachType === 3 && (
          <p className={styles.text}>
            电话沟通券 <span className={styles.value}>{reachNbr}</span> 张
          </p>
        )}
      </div>
    )

    return equitySysType === 1 ? dotDom() : couponDom()
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
        {this.renderLeftAsset()}
      </div>
    )
    const buttons = (
      <div className="flex flex-column margin-top-24">
        <a
          href={`https://acc.maimai.cn/login?to=${urlencode(
            window.location.href
          )}`}
          onClick={this.handleoLgout}
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
    const { currentUser = {} } = this.props
    const avatarStyle = {
      width: '24px',
      height: '24px',
      fontSize: '16px',
      lineHeight: '24px',
      borderRadius: '16px',
      margin: '16px 0',
    }

    return (
      <Popover
        placement="bottomRight"
        content={this.renderPop()}
        trigger="click"
        className={styles.avatar}
      >
        <Avatar
          avatar={R.path(['ucard', 'avatar'], currentUser)}
          name={R.pathOr('', ['ucard', 'name'], currentUser)}
          style={avatarStyle}
        />
        <span className={styles.name}>
          <span className={styles.nameText}>
            {R.pathOr('', ['ucard', 'name'], currentUser)}
          </span>
          <span className={styles.arrowDown} />
        </span>
      </Popover>
    )
  }
}
