/* eslint-disable max-lines */
import React from 'react'
import { Avatar, Text, Popover, Button } from 'mm-ent-ui'
import { Skeleton } from 'antd'
import PropTypes from 'prop-types'
import { checkIsTrial, redirectToIm } from 'utils'
import { connect } from 'react-redux'
import AddRemarkButton from 'componentsV2/Common/RightButton/AddRemarkButton'
import AddFriendButton from 'componentsV2/Common/RightButton/AddFriendButton'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import HighGrowthAndQualityButton from 'componentsV2/Common/TalentCard/HighGrowthAndQualityButton'
import AsyncWrapPopover from 'componentsV2/Common/TalentCard/AsyncWrapPopover'
import DynamicDetail from 'componentsV2/Common/TalentCard/DynamicDetail'
import { Icon } from 'mm-ent-ui'
import CompanyFansV3 from 'componentsV2/Common/TalentCard/CompanyFansV3'
import Top from './Top'
import Bottom from './Bottom'

@connect((state) => ({
  basicInfoLoading: state.loading.effects['profile/fetchBasicInfo'],
  urlPrefix: state.global.urlPrefix,
  auth: state.global.auth,
  currentUser: state.global.currentUser,
  highLight: state.talentDiscover.highLight,
}))
export default class Card extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  state = {
    intentions: {},
  }

  trackParam = {
    type: 'profile_card',
  }

  fetchIntentions = () => {
    const { data } = this.props
    this.props
      .dispatch({
        type: 'talents/fetchHasIntention',
        payload: {
          to_uid: data.id,
        },
      })
      .then(({ data: intentions = {} }) => {
        this.setState({
          intentions,
        })
      })
  }

  handleSetCardDom = (dom) => {
    this.cardDom = dom
  }

  handleIntentionDetailShow = (visible) => {
    if (visible) {
      this.fetchIntentions()
    }
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

  handleShowChat = () => redirectToIm(this.props.data.id)

  renderAvatar = () => {
    const { data } = this.props
    return (
      <Avatar
        shape="circle"
        size="72px"
        name={data.name}
        showMemBadge
        memId={data.mem_st === 1 ? data.mem_id : 0}
        className="margin-right-16"
        src={data.avatar}
      />
    )
  }

  renderTop = () => {
    const {
      data,
      currentUser: { isV3 },
      highLight,
    } = this.props
    return (
      <Top
        data={data}
        urlPrefix={this.props.urlPrefix}
        getWrapperDom={() => this.cardDom}
        trackParam={{
          fromProfile: '1',
          ...this.props.trackParam,
        }}
        fr={this.props.fr}
        onTrial={this.handleTrial}
        auth={this.props.auth}
        isV3={isV3}
        onSpecialAttentionSuccess={this.props.onSpecialAttentionSuccess}
        highLight={highLight}
      />
    )
  }

  renderNormalWrapPopoverV3 = (data) => {
    return (
      <AsyncWrapPopover
        bigTitle={'企业粉丝是你公司潜在的高意向人才'}
        ChildComponent={CompanyFansV3}
        dispatchQuery={{
          type: 'talents/fetchCompanyFansDetails',
          payload: {
            to_uid: data.id,
            uid: window.uid,
          },
        }}
      />
    )
  }

  renderComFans = () => {
    const {
      data,
      currentUser: { isV3 },
    } = this.props
    const getContent = () => {
      return (
        <div className="flex flex-justify-space-between margin-bottom-16">
          <Text type="text_common">关注了你公司</Text>
          <Text type="text_secondary">{data.concern_company_time || ''}</Text>
        </div>
      )
    }

    if (isV3) {
      return (
        <Popover
          content={this.renderNormalWrapPopoverV3(data)}
          getPopupContainer={() => this.cardDom || document.body}
          placement="bottomLeft"
          autoAdjustOverflow={false}
        >
          <span className="margin-right-8 cursor-pointer">
            <Text type="label" size={12}>
              企业粉丝
            </Text>
          </span>
        </Popover>
      )
    }

    return (
      <Popover
        content={getContent()}
        getPopupContainer={() => this.cardDom || document.body}
        title="企业粉丝是你公司潜在的高意向人才"
        placement="bottomLeft"
        autoAdjustOverflow={false}
      >
        <span className="margin-right-8 cursor-pointer">
          <Text type="label" size={12}>
            企业粉丝
          </Text>
        </span>
      </Popover>
    )
  }

  renderIntentions = () => {
    const {
      intentions: { count = 0, intentions = [] },
    } = this.state
    const content = intentions.map((intention) => (
      <div
        key={`${intention.time}${intention.title}${intention.sub_title}`}
        className="margin-bottom-16"
      >
        <div className="flex flex-justify-space-between">
          <Text type="text_common" className="margin-top-6">
            {intention.title}
          </Text>
          <Text type="text_secondary" className="margin-top-2">
            {intention.time}
          </Text>
        </div>
        <Text type="text_secondary" className="margin-top-2">
          {intention.sub_title}
        </Text>
      </div>
    ))

    return (
      <Popover
        title={`对公司表达过${count}次意向行为`}
        content={content}
        placement="bottomLeft"
        autoAdjustOverflow={false}
        getPopupContainer={() => this.cardDom}
        width={450}
        onVisibleChange={this.handleIntentionDetailShow}
      >
        <span className="margin-right-8 cursor-pointer">
          <Text type="label" size={12}>
            有过意向
          </Text>
        </span>
      </Popover>
    )
  }

  renderLatestActive = () => {
    const { data } = this.props
    const className = `text_common ellipsis`
    const style = {
      color: '#956935',
      fontSize: 12,
      position: 'relative',
      padding: '3px 5px',
      top: 7,
      backgroundColor: '#f7f9f9',
      marginRight: 5,
      borderRadius: 2,
    }
    return (
      <Popover
        placement="bottomLeft"
        content={
          <AsyncWrapPopover
            bigTitle={'近期有动向'}
            ChildComponent={DynamicDetail}
            dispatchQuery={{
              type: 'talents/fetchDynamicDetail',
              payload: {
                to_uid: data.id,
                event_types: '1,2,3,11',
              },
            }}
          />
        }
        getPopupContainer={() => this.line5}
        autoAdjustOverflow={false}
      >
        <span className={className} style={style}>
          <Icon
            type="active"
            style={{
              color: '#956935',
              marginRight: 4,
            }}
          />
          近期有动向
        </span>
      </Popover>
    )
  }

  renderCorpFriend = () => {
    return (
      <span className="margin-right-8 cursor-pointer">
        <Text type="label" size={12}>
          员工好友
        </Text>
      </span>
    )
  }

  renderBottom = () => <Bottom data={this.props.data} auth={this.props.auth} />

  renderTrialButton = ({ title, ...restProps }) => {
    return (
      <Button {...restProps} onClick={this.handleTrial}>
        {title}
      </Button>
    )
  }

  renderFooter = () => {
    const {
      data,
      qualityAndFastGrowth,
      auth: { isTalentBankStable },
    } = this.props
    const isTrial = checkIsTrial()
    const addRemarkButton = (
      <AddRemarkButton
        data={data}
        className="font-size-13 margin-left-16"
        trackParam={this.trackParam}
        content="添加备注"
        key="addRemark"
        type="button_m_exact_link_bgray"
      />
    )
    const editGroupButton = (
      <GroupButton
        key="editGroupButton"
        talents={[data]}
        onOk={this.props.onGroupFinish}
        className="font-size-13 margin-left-16"
        trackParam={this.props.trackParam}
        type="button_m_exact_link_bgray"
      >
        {data.group_cnt > 0 ? '修改分组' : '加入储备'}
      </GroupButton>
    )
    const addFriendButton =
      data.friend_state === 2 ? (
        <Button
          key="communicate"
          className="font-size-13 margin-left-16"
          type="button_m_exact_link_bgray"
          onClick={this.handleShowChat}
        >
          开始聊天
        </Button>
      ) : (
        <AddFriendButton
          key="addfr"
          talents={[data]}
          trackParam={this.props.trackParam}
          disabled={!!data.friend_state}
          className="font-size-13 margin-left-16"
          content="加好友"
          type="button_m_exact_link_bgray"
        />
      )

    return (
      <div className="flex flex-justify-space-between margin-top-12 flex-align-center">
        <span
          ref={(dom) => {
            this.line5 = dom
          }}
        >
          <HighGrowthAndQualityButton data={qualityAndFastGrowth} />
          {!!data.is_job_hunting_dynamic &&
            isTalentBankStable &&
            this.renderLatestActive()}
          {!!data.is_corp_friend && this.renderCorpFriend()}
          {!!data.is_company_fans && this.renderComFans()}
          {!!data.has_intention && this.renderIntentions()}
        </span>
        <span>
          {isTrial
            ? this.renderTrialButton({
                title: '添加备注',
                className: 'font-size-13 margin-left-16',
                key: 'addRemark',
                type: 'button_m_exact_link_bgray',
              })
            : addRemarkButton}
          {isTrial
            ? this.renderTrialButton({
                title: '加入储备',
                className: 'font-size-13 margin-left-16',
                key: 'group',
                type: 'button_m_exact_link_bgray',
              })
            : editGroupButton}
          {isTrial
            ? this.renderTrialButton({
                title: '加好友',
                className: 'font-size-13 margin-left-16',
                key: 'addFr',
                type: 'button_m_exact_link_bgray',
              })
            : addFriendButton}
        </span>
      </div>
    )
  }
  render() {
    if (this.props.basicInfoLoading) {
      return <Skeleton loading avatar active />
    }
    return (
      <div className="flex margin-bottom-24" ref={this.handleSetCardDom}>
        {this.renderAvatar()}
        <div className="flex-1 overflow-hidden">
          {this.renderTop()}
          {this.renderBottom()}
          {this.renderFooter()}
        </div>
      </div>
    )
  }
}
