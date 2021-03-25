import React from 'react'
import { Affix } from 'antd'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/CommonCard'
import $ from 'jquery'
import { connect } from 'react-redux'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class CommonCardWithTrack extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onOpFinish: PropTypes.func,
    onGetUserLimit: PropTypes.func,
    onSelect: PropTypes.func,
    checked: PropTypes.bool,
    trackParam: PropTypes.object,
    showCheckbox: PropTypes.bool,
    scrollDom: PropTypes.object.isRequired,
  }

  static defaultProps = {
    onOpFinish: () => {},
    onGetUserLimit: () => {},
    checked: false,
    trackParam: {},
    onSelect: () => {},
    showCheckbox: true,
  }

  timer = {}

  clickHandler = (item, buttons) => () => {
    // 有 pc 端获取 uid 是通过异步接口获取，如果在打点的时候，获取 uid 的接口尚未返回数据，则重现添加延迟事件，直到 uid 有值，正常打点
    const u2 = item.id
    if (!window.uid) {
      if (this.timer[`timer${u2}`]) {
        clearTimeout(this.timer[`timer${u2}`])
      }
      this.timer[`timer${u2}`] = setTimeout(
        this.clickHandler(item, buttons),
        1000
      )
      return
    }

    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        u2,
        can_addfr: buttons.includes('addFriend') && !item.friend_state,
        has_micro_resume: !!item.micro_url,
        can_uh: buttons.includes('directIm') && !item.is_direct_im,
        can_dc: buttons.includes('directContact'),
        ...this.props.trackParam,
      }
      const key = 'jobs_pc_talent_show'
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

  render() {
    const { item, scrollDom } = this.props
    const dom = $(scrollDom)

    /* direct_contact_st: 是否直聊。1：是，0：否
      direct_invite_status: 邀约状态 0：未邀约，1：已邀约，2：被拒绝，3：沟通中，4：已过期
      right_type: 1, 权益类型。1：极速联系，2：立即邀约
    */
    const getButtons = () => {
      const {
        currentUser: { role = '', isV3 },
      } = this.props
      // 免费用户使用极速联系
      if (role === 'personalUser') {
        return ['directIm']
      }

      // 企业用户，有人才邀约权益的用户，使用人才邀约
      // if (item.right_type === 2) {
      //   // 如果邀约状态是沟通中，显示聊一聊
      //   return item.direct_invite_status !== 3 ? 'directInvite' : 'chat'
      // }

      return [
        'aiCall',
        item.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
      ]
    }

    // const buttons = [
    //   // 'microResume',
    //   // 'profile',
    //   item.right_type !== 2 && item.direct_contact_st !== 1 ? 'directIm' : '',
    //   item.right_type === 2 &&
    //   item.direct_invite_status !== 3 &&
    //   item.direct_contact_st !== 1
    //     ? 'directInvite'
    //     : '',
    //   item.right_type === 2 && item.direct_invite_status === 3 ? 'chat' : '',
    //   item.direct_contact_st === 1 ? 'directContact' : '',
    // ]
    const footerButtons = [
      'addRemark',
      'group',
      item.friend_state === 2 ? 'communicate' : 'addFriend',
      // 'askForPhone',
    ]
    const buttons = getButtons()
    // 如果可以直聊（用 direct_contact_st === 1 标识）,则不展示极速联系与立即邀约
    return (
      <div key={item.key}>
        <TalentCard
          data={item}
          key={item.id}
          checked={this.props.checked}
          onCheck={this.props.onSelect}
          showSource
          showPhone
          opButtons={buttons}
          footerButtons={footerButtons}
          source={this.props.source}
          onOpFinish={this.props.onOpFinish}
          onGetUserLimit={this.props.onGetUserLimit}
          trackParam={this.props.trackParam}
          showCheckbox={this.props.showCheckbox}
        />
        <Affix
          offsetTop={0}
          onChange={this.handleCardHide(item, [...buttons, ...footerButtons])}
          target={() => this.props.scrollDom || window}
        />
        <Affix
          offsetTop={dom.height()}
          onChange={this.handleCardExposure(item, [
            ...buttons,
            ...footerButtons,
          ])}
          target={() => this.props.scrollDom || window}
        />
      </div>
    )
  }
}
