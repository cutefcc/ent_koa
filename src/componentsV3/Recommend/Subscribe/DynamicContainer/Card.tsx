import * as React from 'react'
import { connect } from 'react-redux'
import { Affix } from 'antd'
import * as $ from 'jquery'
import TalentCard from 'componentsV2/Common/TalentCard/CommonCard'
import Avatar from 'componentsV2/Common/Avatar'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import DynamicDetailModal from './DynamicDetailModal'
import { Typography, Icon, Popover, Loading, Empty, Button } from 'mm-ent-ui'
import { parseCurrentTabParam } from 'utils/talentDiscover'
import { getMMTimeStr } from 'utils/date'
import { checkIsTrial } from 'utils'
import { uidUploader } from 'utils/hoc'
// import {Popover} from 'antd'
import * as R from 'ramda'
import * as styles from './card.less'

export interface Props {
  dynamicDetaillLoading: boolean
  currentUser: object
  urlPrefix: string
  data: object
  mosaic: boolean
  key: string
  trackParam: object
  onUserInfoChange: Function
  showDynamicDetail: boolean // 是否展示'查看Ta的动态',默认展示
  showGapLine: boolean // 是否展示各项之间的分隔线
  className: string
  avatarStyle: object
  showIcon: boolean
  fr: string // 来源页面
  scrollDom: HTMLBaseElement
  currentDynamicCategory: string
  dynamicCategoryMap: object
}

export interface State {
  showDetailModal: boolean
  spread: object
}

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  currentDynamicCategory: state.subscribe.currentDynamicCategory,
  dynamicCategoryMap: state.subscribe.dynamicCategoryMap,
  dynamicDetaillLoading: state.loading.effects['subscribe/fetchDynamicDetails'],
}))
export default class Card extends React.Component<Props, State> {
  state = {
    spread: {},
    dynamicDetail: {
      list: [],
      size: 100,
      start_time: 0,
    },
    showDetailModal: false,
  }

  componentWillUnmount() {
    const timers = Object.values(this.timer)
    timers.map((timer) => {
      if (timer) {
        clearTimeout(timer)
      }
      return ''
    })
  }

  timer = {}

  getTalentButtons = () => {
    const {
      data: { talent = {} },
      currentUser: { isV3 },
    } = this.props
    const isTrial = checkIsTrial()
    const resume = talent.resume ? 'resume' : undefined

    if (isTrial) {
      return ['aiCallTrial', 'directContactTrial']
    }
    return [
      talent.is_special_attention === 1 ? 'closeAttention' : 'openAttention',
      resume,
      'aiCall',
      talent.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
    ]
  }

  getTalentFooterButtons = () => {
    const {
      data,
      currentUser: { isV3 },
    } = this.props
    const talent = R.propOr({}, 'talent', data)
    const isTrial = checkIsTrial()

    if (isTrial) {
      return ['addRemarkTrial', 'groupTrial', 'addFriendTrial']
    }

    return isV3
      ? [
          'addRemark',
          talent.group_cnt > 0 ? 'editGroup' : 'group',
          talent.friend_state === 2 ? 'communicate' : '', // addFriend 去掉加好友
          // 'askForPhone',
        ]
      : [
          'addRemark',
          talent.group_cnt > 0 ? 'editGroup' : 'group',
          talent.friend_state === 2 ? 'communicate' : 'addFriend',
          // 'askForPhone',
        ]
  }

  setDom = (dom) => {
    this.dom = dom
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
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

  // 跳转到查看动态
  handleTabChange = (type: string) => {
    this.props.dispatch({
      type: 'subscribe/setCurrentTab',
      payload: type,
    })
    this.props.dispatch({
      type: 'subscribe/fetchData',
      payload: {},
    })
  }

  handleSpreadChange = () => {
    const { mosaic, data, fr } = this.props

    if (mosaic) {
      if (checkIsTrial()) {
        this.handleTrial()
      } else {
        this.handleShowUpgradeMember()
      }
      return
    }
    // hook点击跳转切换tab及打点
    if (fr === 'hook') {
      this.handleTabChange('dynamic')
      this.handleTrackProfilePanelClick(data)
      return
    }
    this.handleTrackTalentDynamicProfileEvent()
    const { id, talent } = data

    // upload uid
    if (!!!this.state.spread[data.id]) {
      uidUploader(talent && talent.id)
    }
    this.setState({
      spread: {
        ...this.state.spread,
        [id]: !this.state.spread[id],
      },
    })
  }

  handleTrackProfilePanelClick = (item) => {
    const u2 = item.id
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        u2,
        ...this.props.trackParam,
      }
      const key = 'jobs_pc_talent_dynamic_profile_carousel_panel_click'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleTrackTalentDynamicProfileEvent = () => {
    const {
      data,
      trackParam,
      currentDynamicCategory,
      dynamicCategoryMap,
    } = this.props
    const { id, talent } = data
    // 当前打开状态，不需要打点
    if (this.state.spread[id]) {
      return
    }
    const u2 = talent.id
    if (window.voyager) {
      const res = parseCurrentTabParam(
        dynamicCategoryMap[currentDynamicCategory] || {}
      )
      const key = 'jobs_pc_talent_dynamic_profile_view_abbreviation'
      const param = {
        datetime: new Date().getTime(),
        u2,
        uid: window.uid,
        current_dynamic_tab: JSON.stringify(res),
        ...trackParam,
      }
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleShowDetailModal = (e) => {
    e.stopPropagation()
    const { mosaic } = this.props
    if (mosaic) {
      this.handleShowUpgradeMember()
      return
    }
    const isTrial = checkIsTrial()
    if (isTrial) {
      this.handleTrial()
      return
    }
    this.setState({
      showDetailModal: true,
    })
  }

  handleHiddenDetailModal = () => {
    this.setState({
      showDetailModal: false,
    })
  }

  clickHandler = (item, buttons) => () => {
    const { currentDynamicCategory, dynamicCategoryMap } = this.props
    const u2 = item.id
    if (window.voyager) {
      const res = parseCurrentTabParam(
        dynamicCategoryMap[currentDynamicCategory] || {}
      )
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        u2,
        current_dynamic_tab: JSON.stringify(res),
        ...this.props.trackParam,
      }
      const key = 'jobs_pc_talent_dynamic_profile_panel_show'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleCardExposure = (item, buttons) => (show) => {
    const u2 = item.id
    if (this.timer[`timer${u2}`]) {
      clearTimeout(this.timer[`timer${u2}`])
    }
    if (show) {
      this.timer[`timer${u2}`] = setTimeout(
        this.clickHandler(item, buttons),
        300
      )
    }
  }

  handleCardHide = (item, buttons) => (show) => {
    const u2 = item.id
    if (this.timer[`timer${u2}`]) {
      clearTimeout(this.timer[`timer${u2}`])
    }
    if (!show) {
      this.timer[`timer${u2}`] = setTimeout(
        this.clickHandler(item, buttons),
        300
      )
    }
  }

  renderDetailModal = () => {
    const { trackParam, fr } = this.props
    return (
      <DynamicDetailModal
        onHiddenDetailModal={this.handleHiddenDetailModal}
        trackParam={trackParam}
        fr={fr}
        userInfo={R.pathOr({}, ['data', 'talent'], this.props)}
      />
    )
  }

  renderTitle = () => {
    const { data, mosaic, fr } = this.props
    const userInfo = R.propOr({}, 'talent', data)
    const title = mosaic ? (
      <img
        src={`${this.props.urlPrefix}/images/blurBg/${Math.floor(
          Math.random() * 6 + 1
        )}.png`}
        alt=""
        height="26px"
      />
    ) : (
      <span
        className={`${
          fr === 'hook'
            ? 'font-size-12 margin-left-8'
            : 'font-size-14 margin-left-16'
        } color-stress font-weight-bold`}
      >
        {`${userInfo.company}·${userInfo.position}·${userInfo.name}`}
      </span>
    )
    return (
      <span className="flex-1 ellipsis flex flex-align-center">
        {title}
        {userInfo.judge === 1 && (
          <Icon type="v" className="color-orange2 margin-left-4 font-size-12" />
        )}
        <span
          className={`${
            fr === 'hook' ? 'font-size-12' : 'font-size-14'
          } margin-left-10 color-common ellipsis`}
        >
          {this.renderDescribe()}
        </span>
        {userInfo.call_state === 2 && (
          <Icon type="edm_tel" className="margin-left-4 font-size-12" />
        )}
      </span>
    )
  }

  renderDescribe = () => {
    const { data } = this.props
    // const visitHistory = R.propOr([], 'visit_company_home_page_history', data)
    // const content = (
    //   <div>
    //     <Typography.Text type="stress" strong size="14">
    //       访问记录
    //     </Typography.Text>
    //     <ul style={{padding: 0}} className="margin-top-8">
    //       {visitHistory.map(item => (
    //         <li className="flex space-between" key={item}>
    //           <Typography.Text>{item.split(' ')[0]}</Typography.Text>
    //           <Typography.Text type="secondary" className="margin-left-24">
    //             {item.split(' ')[1]}
    //           </Typography.Text>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // )
    // return visitHistory.length === 0 ? (
    //   data.describe
    // ) : (
    //   <Popover
    //     content={content}
    //     placement="bottom"
    //     getPopupContainer={() => this.dom || window}
    //   >
    //     {data.describe}
    //   </Popover>
    // )
    return data.describe
  }

  renderPreviewButton = () => {
    const { data, urlPrefix, mosaic, avatarStyle = {}, fr } = this.props
    const userInfo = R.propOr({}, 'talent', data)
    const onClick = fr === 'hook' ? this.props.onSpreadChange : null
    return (
      <PreviewButton
        showDetail={false}
        data={userInfo}
        trackParam={this.props.trackParam}
        fr={this.props.fr}
        onClick={onClick}
        clearHistory={true}
      >
        <Avatar
          avatar={
            mosaic
              ? `${urlPrefix}/images/avatar/${Math.floor(
                  Math.random() * 16 + 1
                )}.png`
              : userInfo.avatar
          }
          name={R.propOr('保密', 'name', userInfo)}
          className={styles.avatar}
          style={avatarStyle}
          key="avatar"
        />
      </PreviewButton>
    )
  }

  renderDynamicDetailPopover = () => {
    const {
      data: { dynamic_total: dynamicTotal = 0 },
    } = this.props
    return dynamicTotal > 0 ? (
      <Button
        type="likeLink"
        onClick={this.handleShowDetailModal}
        className="margin-right-16"
      >
        共{dynamicTotal}条动态
      </Button>
    ) : null
  }

  render() {
    const {
      data,
      scrollDom,
      showDynamicDetail = true,
      showGapLine = true,
      className,
      showIcon = true,
      fr,
    } = this.props
    const $scrollDom = $(scrollDom)
    const open = this.state.spread[data.id] || false
    const buttons = this.getTalentButtons()
    const footerButtons = this.getTalentFooterButtons()
    const userInfo = R.propOr({}, 'talent', data)

    const card = (
      <TalentCard
        data={userInfo}
        key={data.id}
        opButtons={buttons}
        footerButtons={footerButtons}
        trackParam={this.props.trackParam}
        fr="subscribeDynamicListForPc"
        showAvatar={false}
        showPhone
        showSource
        showExpectation
        style={{
          paddingLeft: '40px',
          paddingRight: '24px',
        }}
        showSpecialAttention={true}
        version={'3.0'}
      />
    )

    const time = (
      <span
        className={`${
          fr === 'hook' ? 'font-size-12' : ''
        } color-dilution padding-left-16`}
      >
        {showDynamicDetail && this.renderDynamicDetailPopover()}
        {getMMTimeStr(data.uptime)}
        {showIcon && (
          <Icon
            type={open ? 'arrow-down-2' : 'arrow-right-2'}
            className="color-dilution font-size-14 margin-left-16"
          />
        )}
      </span>
    )
    return (
      <div
        className={`${styles.item} ${open ? styles.active : ''} ${
          !showGapLine ? 'border-bottom-0' : ''
        } ${className ? className : ''}`}
        key={data.id}
        ref={this.setDom}
      >
        <div
          className="flex cursor-pointer flex-align-center"
          onClick={this.handleSpreadChange}
        >
          {this.renderPreviewButton()}
          {this.renderTitle()}
          {time}
        </div>
        {open && <div className={styles.detail}>{card}</div>}
        {this.state.showDetailModal && this.renderDetailModal()}
        <Affix
          offsetTop={0}
          onChange={this.handleCardHide(data, [...buttons, ...footerButtons])}
          target={() => scrollDom}
        />
        <Affix
          offsetTop={$scrollDom.height()}
          onChange={this.handleCardExposure(data, [
            ...buttons,
            ...footerButtons,
          ])}
          target={() => scrollDom}
        />
      </div>
    )
  }
}
