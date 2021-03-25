/* eslint-disable */
import React from 'react'
import { Checkbox, Button } from 'antd'
import { redirectToIm } from 'utils'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/PreviewButton'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import AddRemarkButton from 'components/Common/RightButton/AddRemarkButton'
import SetUnsuitableButton from 'components/Common/RightButton/SetUnsuitableButton'
import SetSuitableButton from 'components/Common/RightButton/SetSuitableButton'
import ShowMicroResumeButton from 'components/Common/RightButton/ShowMicroResumeButton'
import ShowAttachmentResumeButton from 'components/Common/RightButton/ShowAttachmentResumeButton'
import ShowPhoneButton from 'components/Common/RightButton/ShowPhoneButton'
import GroupButton from 'components/Common/RightButton/GroupButton'
import EditGroupButton from 'components/Common/RightButton/EditGroupButton'
import AddFriendButton from 'components/Common/RightButton/AddFriendButton'
import DirectInviteButton from 'components/Common/DirectInviteButton'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import ChannelInviteButton from 'components/Common/ChannelInviteButton'
import AskForPhoneButton from 'components/Common/RightButton/AskForPhoneButton'
import AiCallButton from 'componentsV2/Common/RightButton/AiCallButton'
import {
  DIRECT_INVITE_STATUS_TEXT_MAP,
  DISABLED_INVITE_STATUS,
} from 'constants/right'
import CommonFriends from './CommonFriends'
import CoContactor from './CoContactor'
import CoGroup from './CoGroup'
import CoBrowser from './CoBrowser'
import BasicInfo from './BasicInfo'
import CoRemark from './CoRemark'
import styles from './commonCard.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showCheckbox: PropTypes.bool,
    showAvatar: PropTypes.bool,
    opButtons: PropTypes.array,
    footerButtons: PropTypes.array,
    onOpFinish: PropTypes.func,
    isFinish: PropTypes.bool,
    trackParam: PropTypes.object,
    showExpectation: PropTypes.bool,
    container: PropTypes.element,
  }
  static defaultProps = {
    showAvatar: true,
    showCheckbox: false,
    opButtons: [],
    footerButtons: [],
    onOpFinish: () => {},
    isFinish: false,
    trackParam: {}, // 打点需要添加的参数
    showExpectation: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      showButtons: false,
      data: props.data,
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.data !== newProps.data) {
      this.setState({
        data: {
          ...newProps.data,
          remark_cnt: this.state.data.remark_cnt,
        },
      })
    }
  }

  setWrapperDom = (dom) => {
    this.wrapperDom = dom
  }

  handleCheck = (e) => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }
  handleDirectImFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        is_direct_im: 1,
      },
    })
    this.props.onOpFinish('directIm', this.state.data)
  }
  handleDirectInviteFinish = () =>
    this.props.onOpFinish('directInvite', this.state.data)
  handleGroupFinish = (ids, groupName) =>
    this.props.onOpFinish('group', this.state.data, groupName)
  handleAskPhoneFinish = (ids) =>
    this.props.onOpFinish('askForPhone', this.state.data, 1)
  handleSetUnSuitableFinish = () => {
    this.props.onOpFinish('setState', this.state.data, 1)
  }
  handleSetSuitableFinish = () =>
    this.props.onOpFinish('setState', this.state.data, 0)
  handleAddFriendFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        friend_state: 1,
      },
    })
    this.props.onOpFinish('addFriend', this.state.data)
  }
  handleAiCallFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        call_state: 1,
      },
    })
    this.props.onOpFinish('aiCall', this.state.data)
  }

  handleAddRemarkFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        remark_cnt: R.propOr(0, 'remark_cnt', this.state.data) + 1,
      },
    })
  }
  handleShowChat = () => {
    redirectToIm(this.state.data.id)
  }

  handleShowButtons = (e) => {
    this.setState({ showButtons: true })
    e.stopPropagation()
    e.preventDefault()
  }
  handleHideButtons = (e) => {
    this.setState({ showButtons: false })
    e.stopPropagation()
    e.preventDefault()
  }

  renderAvatar = () => {
    const {
      data: { avatar = '', name = '' },
    } = this.state
    const style = {
      width: '40px',
      height: '40px',
      fontSize: '26px',
      lineHeight: '40px',
      borderRadius: '20px',
      cursor: 'pointer',
    }
    return (
      <PreviewButton
        showDetail={false}
        data={this.props.data}
        trackParam={this.props.trackParam}
        fr={this.props.fr}
        onGetUserLimit={this.props.onGetUserLimit}
      >
        <Avatar avatar={avatar} name={name} style={style} key="avatar" />
      </PreviewButton>
    )
  }
  renderButtons = (buttons) => {
    const {
      currentUser: { role = '' },
    } = this.props
    const { data } = this.state
    const hasInvited = !!data.is_direct_im
    const { showButtons } = this.state
    const isPersonalOrPersonalRecruiter =
      role === 'personalUser' || role === 'personalRecruiter'

    let aiCallFr // 电话沟通fr
    if (R.pathOr('', ['props', 'trackParam', 'type'], this) === 'canchat') {
      aiCallFr = 'jobInteractionsAcceptTalksForPc'
    } else if (
      R.pathOr('', ['props', 'trackParam', 'type'], this) === 'visitor'
    ) {
      aiCallFr = 'jobInteractionsVisitorsForPc'
    } else if (
      R.pathOr('', ['props', 'trackParam', 'type'], this) === 'recommend'
    ) {
      aiCallFr = 'jobInteractionsRecommendForPc'
    } else {
      aiCallFr = R.pathOr('', ['props', 'fr'], this)
    }

    const buttonsMap = {
      preview: this.state.showButtons ? (
        <PreviewButton
          data={data}
          key="previewButton"
          className={`circle-button ${styles.button} ${
            showButtons ? styles.show : styles.hide
          }`}
          iconType=""
          trackParam={this.props.trackParam}
          fr={this.props.fr}
        />
      ) : null,
      directIm: (
        <div className={styles.button}>
          <DirectChatButton
            key="DirectIMButton"
            talents={[data]}
            onInviteFinish={this.handleDirectImFinish}
            disabled={hasInvited}
            // className={`primary-button ${styles.button}`}
            buttonText="极速联系"
            trackParam={this.props.trackParam}
            type="primary"
            onGetUserLimit={this.props.onGetUserLimit}
          />
        </div>
      ),
      group: isPersonalOrPersonalRecruiter ? null : (
        <GroupButton
          key="groupButton"
          talents={[data]}
          buttonText="修改分组"
          onGroupFinish={this.handleGroupFinish}
          iconType=""
          className="like-link-button font-size-12 margin-left-16"
          trackParam={this.props.trackParam}
        />
      ),
      askForPhone: this.props.currentUser.show_ask_for_phone ? (
        <AskForPhoneButton
          key="askForPhone"
          talents={[data]}
          buttonText="索要电话"
          onGroupFinish={this.handleAskPhoneFinish}
          iconType=""
          className="like-link-button font-size-12 margin-left-16"
          trackParam={this.props.trackParam}
        />
      ) : null,
      editGroup:
        this.state.data.op_state === 1 ? null : (
          <EditGroupButton
            key="editGroupButton"
            talents={[data]}
            buttonText="修改分组"
            onGroupFinish={this.handleGroupFinish}
            iconType=""
            className="like-link-button font-size-12 margin-left-16"
            trackParam={this.props.trackParam}
          />
        ),
      addFriend: (
        <AddFriendButton
          key="addfr"
          talents={[data]}
          trackParam={this.props.trackParam}
          onAddFinish={this.handleAddFriendFinish}
          disabled={!!data.friend_state}
          className="like-link-button font-size-12 margin-left-16"
          content="加好友"
          onGetUserLimit={this.props.onGetUserLimit}
        />
      ),
      setState:
        this.state.data.op_state === 1 ? (
          <SetSuitableButton
            key="setUnSuitable"
            talents={[data]}
            trackParam={this.props.trackParam}
            onOpFinish={this.handleSetSuitableFinish}
            className="like-link-button font-size-12 margin-left-16"
            content="移回"
            scrollDom={this.wrapperDom}
          />
        ) : (
          <SetUnsuitableButton
            key="setUnSuitable"
            talents={[data]}
            trackParam={this.props.trackParam}
            onOpFinish={this.handleSetUnSuitableFinish}
            className="like-link-button font-size-12 margin-left-16"
            content="标记不合适"
            scrollDom={this.wrapperDom}
          />
        ),
      communicate: (
        <Button
          className="like-link-button margin-left-16 font-size-12"
          onClick={this.handleShowChat}
        >
          立即沟通
        </Button>
      ),
      chat: this.state.showButtons ? (
        <Button
          className={`primary-button ${styles.button}`}
          onClick={this.handleShowChat}
        >
          聊一聊
        </Button>
      ) : null,
      directInvite: (
        <DirectInviteButton
          key="DirectInviteButton"
          talents={[data]}
          trackParam={this.props.trackParam}
          onInviteFinish={this.handleDirectInviteFinish}
          disabled={DISABLED_INVITE_STATUS.includes(data.direct_invite_status)}
          className={`primary-button ${styles.button}`}
          buttonText={R.propOr(
            '立即邀约',
            data.direct_invite_status,
            DIRECT_INVITE_STATUS_TEXT_MAP
          )}
        />
      ),
      directContact: (
        <DirectContactButton
          key="DirectContactButton"
          talents={[data]}
          trackParam={this.props.trackParam}
          // className={`primary-button ${styles.button}`}
          buttonText="立即沟通"
          type="primary"
          onGetUserLimit={this.props.onGetUserLimit}
        />
      ),
      profile: (
        <PreviewButton
          data={data}
          key="previewButton"
          className={`ghost-button ${styles.button} ${
            showButtons ? styles.show : styles.hide
          }`}
          iconType=""
          buttonText="脉脉主页"
          trackParam={this.props.trackParam}
          fr={this.props.fr}
        />
      ),
      microResume: (
        <ShowMicroResumeButton
          talent={data}
          className="like-link-button font-size-12 margin-left-16"
          trackParam={this.props.trackParam}
          content="查看微简历"
          onGetUserLimit={this.props.onGetUserLimit}
        />
      ),
      attachmentResume: (
        <ShowAttachmentResumeButton
          talent={data}
          className="like-link-button font-size-12 margin-left-16"
          trackParam={this.props.trackParam}
          content="下载附件简历"
        />
      ),
      robbery: (
        <ChannelInviteButton
          key="DirectIMButton"
          talents={[data]}
          trackParam={this.props.trackParam}
          onInviteFinish={this.handleDirectImFinish}
          disabled={this.props.isFinish || hasInvited}
          // className={`primary-button ${styles.directImButton} margin-left-16`}
          type="primary"
          buttonText={hasInvited ? '您已联系' : '极速联系'}
        />
      ),
      showPhone: (
        <ShowPhoneButton
          talent={data}
          className="like-link-button font-size-12 margin-left-16"
          trackParam={this.props.trackParam}
          content="查看手机号"
        />
      ),
      addRemark: isPersonalOrPersonalRecruiter ? null : (
        <AddRemarkButton
          data={data}
          className="like-link-button font-size-12 margin-left-16"
          onOpFinish={this.handleAddRemarkFinish}
          trackParam={this.props.trackParam}
          content="添加备注"
        />
      ),
      aiCall: (
        <AiCallButton
          key="aiCall"
          data={data}
          trackParam={this.props.trackParam}
          onFinish={this.handleAiCallFinish}
          className="margin-right-16"
          type="primary"
          fr={aiCallFr}
          wrapperDom={this.wrapperDom}
        />
      ),
    }
    return Object.values(R.pickAll(buttons, buttonsMap))
  }
  renderFooter = () => {
    return (
      <div
        className={styles.footer}
        style={{
          paddingLeft:
            this.props.showAvatar || this.props.showCheckbox ? '80px' : '40px',
        }}
      >
        <span className="flex" style={{ flexWrap: 'wrap' }}>
          <CommonFriends
            data={this.state.data}
            className="margin-right-24 cursor-pointer font-size-12"
          />
          {!!R.propOr(0, 'browse_cnt', this.state.data) && (
            <CoBrowser
              uid={this.state.data.id}
              uname={this.state.data.name}
              className="margin-right-24 font-size-12"
              total={R.propOr(0, 'browse_cnt', this.state.data)}
            />
          )}
          {!!R.propOr(0, 'uh_cnt', this.state.data) && (
            <CoContactor
              uid={this.state.data.id}
              uname={this.state.data.name}
              total={R.propOr(0, 'uh_cnt', this.state.data)}
              className="margin-right-24 font-size-12"
            />
          )}
          {!!R.propOr(0, 'remark_cnt', this.state.data) && (
            <CoRemark
              uid={this.state.data.id}
              uname={this.state.data.name}
              className="font-size-12 margin-right-24"
              total={R.propOr(0, 'remark_cnt', this.state.data)}
            />
          )}
          {!!R.pathOr(0, ['group_cnt'], this.state.data) && (
            <CoGroup
              data={this.state.data}
              className="font-size-12 cursor-pointer"
            />
          )}
        </span>
        <span className={styles.buttons}>
          {this.renderButtons(this.props.footerButtons)}
        </span>
      </div>
    )
  }

  render() {
    const { data } = this.state
    const { showAvatar, showCheckbox } = this.props
    return (
      <div
        className={`${styles.card} ${
          data.op_state === 1 ? styles.disabled : ''
        }`}
        style={data.op_state === 1 ? { opacity: 0.5 } : { opacity: 1 }}
        onMouseOver={this.handleShowButtons}
        onMouseLeave={this.handleHideButtons}
        onFocus={this.handleShowButtons}
        ref={this.setWrapperDom}
      >
        <div className={styles.top}>
          {(showAvatar || showCheckbox) && (
            <div className={styles.left}>
              {showAvatar && this.renderAvatar()}
              {showCheckbox && (
                <Checkbox
                  checked={this.props.checked}
                  onChange={this.handleCheck}
                  className={styles.checkbox}
                  disabled={this.props.disabledCheck}
                />
              )}
            </div>
          )}
          <BasicInfo
            data={this.state.data}
            buttons={this.renderButtons(this.props.opButtons)}
            extraButton={this.renderButtons([
              data.mobile ? 'showPhone' : '',
              data.micro_url ? 'microResume' : '',
              data.attachment_resume_url ? 'attachmentResume' : '',
            ])}
            trackParam={this.props.trackParam}
            fr={this.props.fr}
            showExpectation={this.props.showExpectation}
            onGetUserLimit={this.props.onGetUserLimit}
          />
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
