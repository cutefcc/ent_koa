/* eslint-disable max-lines */
import React, { Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Layout, Menu, message } from 'antd'
import { checkIsTrial, redirectToIm, trackEvent } from 'utils'
import { receive } from 'utils/web_broadcast'
import * as R from 'ramda'
import * as Cookies from 'tiny-cookie'
import { Button, Modal, Typography } from 'mm-ent-ui'
import request from 'utils/request'
import {
  handleIsShowSnatchTalentStrongModal,
  setPreStrongModalDate,
  handleIsShowSnatchTalentBottomBanner,
  setPreBottomBannerDate,
} from 'utils/snatchTalent'
import { connect } from 'react-redux'
import styles from './index.less'
import UserForm from '../UserForm/index'
import Auth from './../Common/Auth'
import Profile from './Profile'
import UserAvatar from './UserAvatar'
import GlobalMask from './GlobalMask'
import HeaderCarousel from 'componentsV3/HeaderCarousel'
import TalentMap from 'componentsV3/TalentMap'

const { Header, Content } = Layout
const { SubMenu } = Menu

const uriObj = {
  '/ent/v3/index/key': [
    {
      uri: '/ent/v3/index',
      title: '首页',
    },
    {
      uri: '/ent/v3/index/groups',
      title: '人才库',
    },
    {
      uri: '/ent/v3/index/subscribe',
      title: '人才订阅',
    },
  ],
  '/ent/v2/job/key': [
    {
      uri: '/ent/v2/job/positions',
      title: '职位',
    },
    {
      uri: '/ent/v2/job/resumes',
      title: '简历',
    },
    {
      uri: '/ent/v2/job/recommend',
      title: '推荐人才',
    },
  ],
  '/ent/v2/asset/key': [
    {
      uri: '/ent/v2/asset/enterprise',
      title: '企业资产',
    },
    {
      uri: '/ent/v2/asset/personal',
      title: '个人资产',
    },
  ],
  '/ent/v2/data/key': [
    {
      uri: '/ent/v2/data/enterprise',
      title: '数据报告',
    },
    {
      uri: '/ent/v2/data/talentreport',
      title: '人才报告',
    },
  ],
}
let preDate = null // 点击menu节流使用，因点击之后界面重新渲染，class内部使用节流方法会失效

@Auth
@withRouter
@connect(state => ({
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
  // unreadMsg: state.global.unreadMsg,
  aiCallState: state.global.aiCallState,
  memberOpenTip: state.global.memberOpenTip,
  memberUpgradeTip: state.global.memberUpgradeTip,
  auth: state.global.auth,
  strongIntentions: state.talentDiscover.strongIntentions,
  viewedStrong: state.talentDiscover.viewedStrong,
}))
@Form.create()
export default class MyLayout extends React.Component {
  constructor(props) {
    super(props)
    const {
      location: { pathname = '/' },
    } = this.props
    const current = this.getMenus()
      .reduce(
        (res, item) => (item.tr ? [...item.children, ...res] : [...res, item]),
        []
      )
      .map(R.prop('key'))
      .filter(key => pathname.indexOf(key) > -1)
    this.state = {
      current,
      strongVisible: false,
      unReadMsgBadge: 0,
      // tab状态(v2/v3)
      tabState: false,
      snatchTalent: 0, // 0 都不显示，1 显示弹窗 2 显示banner 3 显示微缩图
      snatchTalentBottomHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
    }
    this.msgWorker = null
  }

  componentDidMount() {
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
      }
    }
    document.addEventListener(visibilityChangeEvent, onVisibilityChange)
    this.listenUnreadMsg()
    this.bindEventListeners()
    if (!this.state.current.length)
      this.setState({ current: [this.props.location.pathname] })
    // 以下代码，活动结束后-删除代码
    setTimeout(this.handleShowSnatchTalent, 2000)
    window.addEventListener('resize', this.handleResize, false)
    setTimeout(this.handleResize, 2500)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.firstTimer) {
      clearInterval(this.firstTimer)
    }
    if (this.autoHideTimer) {
      clearInterval(this.autoHideTimer)
    }
    if (this.msgWorker) {
      this.msgWorker.port.close()
    }
    if (this.props.currentUser.identity === 6) {
      this.setState({ tabState: true })
    }
    this.removeEventListeners()
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const snatchTalentBottomBanner = this.snatchTalentBottomBanner
    const windowHeight = R.pathOr(0, ['body', 'clientHeight'], document)
    const windowWidth = R.pathOr(0, ['body', 'clientWidth'], document)
    if (windowHeight && windowWidth) {
      this.setState({
        windowHeight,
        windowWidth,
      })
    }
    if (snatchTalentBottomBanner) {
      const headerHeight = R.pathOr(
        0,
        ['clientHeight'],
        snatchTalentBottomBanner
      )
      const headerWidth = R.pathOr(0, ['clientWidth'], snatchTalentBottomBanner)
      if (headerHeight && headerWidth) {
        this.setState({ snatchTalentBottomHeight: headerHeight })
      }
    }
  }

  handleGoSnatchTalent = () => {
    window.open('/ent/snatch/talent')
  }

  handleShowSnatchTalent = () => {
    const id = R.pathOr(
      undefined,
      ['props', 'currentUser', 'ucard', 'id'],
      this
    )
    if (id) {
      const pathname = R.pathOr(
        '',
        ['props', 'history', 'location', 'pathname'],
        this
      )
      const isStrongModal = handleIsShowSnatchTalentStrongModal(
        this.props.currentUser
      )
      const isBottomBanner = handleIsShowSnatchTalentBottomBanner(
        this.props.currentUser
      )
      let snatchTalent = 0
      request(
        `/api/ent/discover/search/middle_and_high_end/validate?channel=www&version=1.0.0`
      ).then(res => {
        if (res && res.data) {
          // 活动没过期
          if (res.data.valid === 1) {
            // 只在v2 v3首页展示
            if (['/ent/v2/discover', '/ent/v3/index'].includes(pathname)) {
              // 显示强弹窗
              if (isStrongModal) {
                trackEvent('snatch_talent_strong_modal_show')
                snatchTalent = 1
                setPreStrongModalDate(this.props.currentUser)
              }
              // 显示banner
              if (isBottomBanner) {
                trackEvent('snatch_talent_bottom_banner_show')
                snatchTalent = 2
                setPreBottomBannerDate(this.props.currentUser)
              }

              if (!isStrongModal && !isBottomBanner) {
                snatchTalent = 3
              }
            }
          }
          this.setState(
            {
              snatchTalent,
            },
            () => {
              if (snatchTalent === 2) {
                setTimeout(() => {
                  document.getElementById('bottomBannerDiv').style.bottom = 0
                }, 200)
              }
            }
          )
        }
      })
    } else {
      this.handleShowSnatchTalent()
    }
  }

  setScrollDom = scrollDom => {
    this.scrollDom = scrollDom
  }

  onClickMenu = uri => () => {
    if (preDate === null || new Date().getTime() - preDate > 1000) {
      preDate = new Date().getTime()
      this.onClickMenuThrottle(uri)
    }
  }

  onClickMenuThrottle = uri => {
    if (this.props.currentUser.identity === 6)
      this.props.history.push({ pathname: uri })
  }

  getMenus = () => {
    const {
      auth: { validUrls = [] },
    } = this.props
    const isTrial = checkIsTrial()
    const getMenu = (uri, title) => {
      if (isTrial) {
        return <a onClick={this.handleTrial}>{title}</a>
      }
      if (uri) {
        return (
          <Link
            to={
              uri === '/ent/v3/index/groups'
                ? '/ent/v3/index/groups?currentTab=talent'
                : uri
            }
          >
            {title}
          </Link>
        )
      }
      return title
    }
    const getMenuConfig = (uri, title) => {
      return {
        key: uri,
        item: getMenu(uri, title),
        show: isTrial ? true : validUrls.includes(uri),
      }
    }
    const getTitleUrl = array => {
      const resultArray = array.filter(data => validUrls.includes(data.uri))
      return resultArray.length === 0 ? '' : resultArray[0].uri
    }
    const getSubMenuConfig = data => {
      return getMenuConfig(data.uri, data.title)
    }
    const indexUri = getTitleUrl(uriObj['/ent/v3/index/key'])
    const jobUri = getTitleUrl(uriObj['/ent/v2/job/key'])
    const assetUri = getTitleUrl(uriObj['/ent/v2/asset/key'])
    const dataUri = getTitleUrl(uriObj['/ent/v2/data/key'])
    return [
      this.props.currentUser.identity === 6
        ? {
            key: `/ent/v3/index/key`,
            item: (
              <Fragment>
                首页
                <span className={`arrowDown ${styles.arrow}`} />
              </Fragment>
            ),
            show: validUrls.includes('/ent/v3/index'),
            click: this.onClickMenu(indexUri),
            children: R.map(getSubMenuConfig, uriObj['/ent/v3/index/key']),
          }
        : getMenuConfig('/ent/v2/index', '首页'),
      this.props.currentUser.identity === 6
        ? getMenuConfig('/ent/v3/discover', '发现人才')
        : getMenuConfig('/ent/v2/discover', '发现人才'),
      {
        key: `/ent/v2/job/key`,
        item: (
          <Fragment>
            职位
            <span className={`arrowDown ${styles.arrow}`} />
          </Fragment>
        ),
        show: validUrls.includes('/ent/v2/job'),
        click: this.onClickMenu(jobUri),
        children: R.map(getSubMenuConfig, uriObj['/ent/v2/job/key']),
      },
      // getMenuConfig('/ent/v2/channels', '专题'),
      getMenuConfig('/ent/v2/sentiment', '雇主口碑'),
      // getMenuConfig('/ent/v2/data/enterprise', '数据'),
      {
        key: `/ent/v2/data/key`,
        item: (
          <Fragment>
            数据
            <span className={`arrowDown ${styles.arrow}`} />
          </Fragment>
        ),
        show:
          validUrls.includes('/ent/v2/data/enterprise') ||
          validUrls.includes('/ent/v2/data/talentreport'),
        click: this.onClickMenu(dataUri),
        children: R.map(getSubMenuConfig, uriObj['/ent/v2/data/key']),
      },
      {
        key: `/ent/v2/asset/key`,
        item: (
          <Fragment>
            资产
            <span className={`arrowDown ${styles.arrow}`} />
          </Fragment>
        ),
        show: validUrls.includes('/ent/v2/asset'),
        click: this.onClickMenu(assetUri),
        children: R.map(getSubMenuConfig, uriObj['/ent/v2/asset/key']),
      },
      {
        key: '/ent/v2/company',
        item: getMenu('/ent/v2/company/home', '企业号'),
        show: validUrls.includes('/ent/v2/company'),
      },
    ]
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

    this.msgWorker.port.onmessage = e => {
      const { method, data } = e.data
      if (method === 'updateMessages') {
        // eslint-disable-next-line no-console
        console.log('data=====socket 回调', data)
        this.setState({
          unReadMsgBadge: data.badges || 0,
        })
      }
    }

    receive('pc_im_update_messages_to_recruit_fe', data => {
      const { badges } = data
      const { unReadMsgBadge } = this.state
      if (badges !== unReadMsgBadge) {
        this.setState({
          unReadMsgBadge: data.badges || 0,
        })
      }
    })
  }

  bindEventListeners = () => {
    window.addEventListener('online', this.online, false)
    window.addEventListener('offline', this.offline, false)
  }
  removeEventListeners = () => {
    window.removeEventListener('online', this.online, false)
    window.removeEventListener('offline', this.offline, false)
  }
  online = () => {
    if (!this.msgWorker) return

    const postMessage = R.pathOr(
      null,
      ['msgWorker', 'port', 'postMessage'],
      this
    )
    if (postMessage) {
      postMessage({
        method: 'online',
      })
    }
  }
  offline = () => {
    if (!this.msgWorker) return

    const postMessage = R.pathOr(
      null,
      ['msgWorker', 'port', 'postMessage'],
      this
    )
    if (postMessage) {
      postMessage({
        method: 'offline',
      })
    }
  }
  pullMsg = () => {
    if (!this.msgWorker) return

    this.msgWorker.port.postMessage({
      method: 'pullMsg',
      data: {
        schema: ['badges'],
      },
    })
  }

  handleTrial = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '开通招聘企业版 解锁更多功能',
        cancelTxt: '放弃开通',
        confirmTxt: '立即开通',
      },
    })
  }

  handleRedirectIm = () => {
    redirectToIm()

    // // 延迟同步msg_worker数据
    // setTimeout(() => {
    //   this.pullMsg()
    // }, 3000)
  }

  handleHideOpenMemberTip = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: false,
        msg: '',
        cancelTxt: '',
        confirmTxt: '',
      },
    })
  }

  handleHideUpgradeMemberTip = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: false,
        msg: '',
        cancelTxt: '',
        confirmTxt: '',
      },
    })
  }

  handleRedirectToRegister = () => {
    window.open('https://maimai.cn/job_corp_apply#contact')
  }

  handleAddOpportunityCustom = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({
          err,
        })
        return
      }
      this.setState({
        err: null,
      })
      this.props
        .dispatch({
          type: 'entInvite/keepBusiness',
          payload: {
            fr: 'upgrade_premium_membership',
            contact_name: values.realname,
            contact_phone: values.mobile,
            contact_email: values.email,
            company_name: values.company,
            st: 1,
            comment: 'talent_bank_3.1',
          },
        })
        .then(() => {
          message.success('信息提交成功，销售顾问将会为您提供1v1服务！')
          this.handleHideUpgradeMemberTip()
        })
    })
  }

  renderSubMenu = menu => {
    return !menu.show ? null : (
      <SubMenu
        key={menu.key}
        title={menu.item}
        popupClassName={styles.subMenuPopup}
        onTitleClick={menu.click}
      >
        {R.propOr([], 'children', menu).map(this.renderSubmenuItem)}
      </SubMenu>
    )
  }

  renderMenuItem = menu => {
    return !menu.show ? null : <Menu.Item key={menu.key}>{menu.item}</Menu.Item>
  }

  renderSubmenuItem = menu => {
    return !menu.show ? null : (
      <Menu.Item key={menu.key} className={styles.subMenuItem}>
        {menu.item}
      </Menu.Item>
    )
  }

  renderMenuItems = () => {
    const nemus = this.getMenus()
    return nemus.map(item =>
      item.children ? this.renderSubMenu(item) : this.renderMenuItem(item)
    )
  }

  renderOpenMemverModal = () => {
    const { memberOpenTip } = this.props
    return (
      <Modal
        title=""
        className={styles.openMemberTip}
        width={400}
        footer={
          <div className={styles.footer}>
            <Button
              onClick={this.handleHideOpenMemberTip}
              className={styles.giveupButton}
            >
              {memberOpenTip.cancelTxt || '取消'}
            </Button>
            <Button
              className={styles.applyButton}
              onClick={this.handleRedirectToRegister}
            >
              {memberOpenTip.confirmTxt || '确定'}
            </Button>
          </div>
        }
        onCancel={this.handleHideOpenMemberTip}
        visible
        destroyOnClose
      >
        <p className="font-size-20 text-center">
          {memberOpenTip.msg || '开通招聘企业版 解锁更多功能'}
        </p>
      </Modal>
    )
  }

  // TODO 这部分代码也应该拆分出去吧,不要轻易 disable eslint 对文件行数的限制
  renderUpgradeMemberModal = () => {
    const { memberUpgradeTip } = this.props

    return (
      <Modal
        title="升级企业会员"
        className={styles.upgradeMemberTip}
        width={680}
        maskClosable={false}
        onCancel={this.handleHideUpgradeMemberTip}
        okText={memberUpgradeTip.okText || '确定'}
        cancelText={memberUpgradeTip.cancelText || '取消'}
        onOk={this.handleAddOpportunityCustom}
        visible
        destroyOnClose
      >
        <div>
          <div className={styles.memberTipContent}>
            <img
              src="https://i9.taou.com/maimai/p/24871/8_53_1Gu2jUtlCRlHVl"
              style={{ width: '632px' }}
            />
          </div>
          <Typography type="stress" strong>
            填写以下信息，1v1专属顾问竭诚为您服务
          </Typography>
          <UserForm form={this.props.form} err={this.state.err} />
        </div>
      </Modal>
    )
  }

  renderSnatchTalent = () => {
    return (
      <React.Fragment>
        {this.state.snatchTalent === 2 && (
          <React.Fragment>
            <div id="bottomBannerDiv" className={styles.bottomBannerStyle}>
              <img
                style={{
                  display: 'inline-block',
                  width: '100%',
                  cursor: 'pointer',
                }}
                src={`${this.props.urlPrefix}/images/snatch_talent_bottom_banner.png`}
                alt="snatch_talent"
                onClick={() => {
                  trackEvent('snatch_talent_bottom_banner_click')
                  this.setState({
                    snatchTalent: 3,
                  })
                  this.handleGoSnatchTalent()
                }}
                ref={dom => {
                  this.snatchTalentBottomBanner = dom
                }}
              />
              <img
                onClick={() => {
                  trackEvent('snatch_talent_bottom_banner_close')
                  this.setState({
                    snatchTalent: 3,
                  })
                }}
                style={{
                  display: 'inline-block',
                  width: '48px',
                  height: '48px',
                  zIndex: 12,
                  position: 'absolute',
                  bottom: '24px',
                  top: `${(18 / 31) * this.state.snatchTalentBottomHeight -
                    24}px`,
                  right: '24px',
                  cursor: 'pointer',
                }}
                src={`${this.props.urlPrefix}/images/close_bottom_banner.png`}
              />
            </div>
          </React.Fragment>
        )}
        {this.state.snatchTalent === 3 && (
          <React.Fragment>
            <img
              onClick={() => {
                this.setState(
                  {
                    snatchTalent: 2,
                  },
                  () => {
                    setTimeout(() => {
                      this.handleResize()
                      document.getElementById(
                        'bottomBannerDiv'
                      ).style.bottom = 0
                    }, 200)
                  }
                )
              }}
              className={styles.smallImg}
              src={`${this.props.urlPrefix}/images/snatch_talent_small.png`}
            />
          </React.Fragment>
        )}
        {this.state.snatchTalent === 1 && (
          <React.Fragment>
            <div
              ref={dom => {
                this.snatchTalentStrongModal = dom
              }}
              onClick={() => {
                this.setState({
                  snatchTalent: 3,
                })
              }}
              style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                background: '#15161F',
                opacity: 0.6,
                zIndex: 11,
              }}
            />
            {this.state.windowHeight !== 0 && this.state.windowWidth !== 0 && (
              <img
                onClick={() => {
                  this.setState({
                    snatchTalent: 3,
                  })
                  trackEvent('snatch_talent_strong_modal_click')
                  this.handleGoSnatchTalent()
                }}
                style={{
                  display: 'inline-block',
                  width: '360px',
                  height: '360px',
                  zIndex: 12,
                  position: 'absolute',
                  top: `${(this.state.windowHeight - 360) / 2}px`,
                  left: `${(this.state.windowWidth - 360) / 2}px`,
                  cursor: 'pointer',
                }}
                src={`${this.props.urlPrefix}/images/snatch_talent_strong_modal.png`}
              />
            )}
            <img
              onClick={() => {
                trackEvent('snatch_talent_strong_modal_close')
                this.setState({
                  snatchTalent: 3,
                })
              }}
              style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                zIndex: 12,
                position: 'absolute',
                top: `${(document.body.clientHeight - 360) / 2 + 5}px`,
                left: `${(document.body.clientWidth - 360) / 2 + 320}px`,
                cursor: 'pointer',
              }}
              src={`${this.props.urlPrefix}/images/close_bottom_banner.png`}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  render() {
    const { memberOpenTip, memberUpgradeTip, currentUser } = this.props
    const { unReadMsgBadge = 0 } = this.state

    const logo = (
      <Link to="/ent">
        <div className={styles.logo}>
          <img
            src={`${this.props.urlPrefix}/images/logo_v2.png`}
            alt="脉脉招聘"
          />
        </div>
      </Link>
    )

    const imEnter = (
      <span className={styles.imEnter} onClick={this.handleRedirectIm}>
        <img
          src={`${this.props.urlPrefix}/images/icon_im.png`}
          alt=""
          style={{ width: '16px', height: '14px' }}
        />
        {unReadMsgBadge > 0 && (
          <span className={styles.unreadNum}>{unReadMsgBadge}</span>
        )}
      </span>
    )

    const right = (
      <div className={styles.right}>
        {imEnter}
        <UserAvatar />
      </div>
    )

    return (
      <Layout className={styles.layout}>
        <Header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.leftContent}>
              {logo}
              <Menu
                selectedKeys={this.state.current}
                mode="horizontal"
                theme="dark"
                triggerSubMenuAction="hover"
              >
                {this.renderMenuItems()}
              </Menu>
            </div>
            <div className={styles.rightContent}>
              {R.pathOr(0, ['identity'], currentUser) === 6 && (
                <HeaderCarousel />
              )}
              {right}
            </div>
          </div>
        </Header>

        {/* {imEnter} */}
        <Content className={styles.content}>
          <div
            className={styles.innerContent}
            style={{ margin: '0 auto' }}
            ref={this.setScrollDom}
          >
            {this.props.children}
          </div>
        </Content>
        {memberOpenTip.show && this.renderOpenMemverModal()}
        {memberUpgradeTip.show &&
          this.props.currentUser.talent_lib_version !== 3 &&
          this.props.currentUser.talent_lib_version !== 4 &&
          this.renderUpgradeMemberModal()}
        <Profile />
        <GlobalMask />
        {R.pathOr(0, ['identity'], currentUser) === 6 && <TalentMap />}
        {this.renderSnatchTalent()}
      </Layout>
    )
  }
}
