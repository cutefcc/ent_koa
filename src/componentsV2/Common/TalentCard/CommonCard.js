/* eslint-disable */
import React from 'react'
// import { InfoCircleOutlined } from '@ant-design/icons'
import { Checkbox, Popover, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Button, Icon } from 'mm-ent-ui'
import Avatar from 'componentsV2/Common/Avatar'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import AddRemarkButton from 'componentsV2/Common/RightButton/AddRemarkButton'
import SetUnsuitableButton from 'componentsV2/Common/RightButton/SetUnsuitableButton'
import SetSuitableButton from 'componentsV2/Common/RightButton/SetSuitableButton'
import ShowMicroResumeButton from 'componentsV2/Common/RightButton/ShowMicroResumeButton'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import AddFriendButton from 'componentsV2/Common/RightButton/AddFriendButton'
import DirectInviteButton from 'componentsV2/Common/RightButton/DirectInviteButton'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import ChannelInviteButton from 'componentsV2/Common/RightButton/ChannelInviteButton'
import AskForPhoneButton from 'componentsV2/Common/RightButton/AskForPhoneButton'
import AiCallButton from 'componentsV2/Common/RightButton/AiCallButton'
import SpecialAttention from 'componentsV2/Common/RightButton/SpecialAttention'
import {
  DIRECT_INVITE_STATUS_TEXT_MAP,
  DISABLED_INVITE_STATUS,
} from 'constants/right'
import {
  redirectToIm,
  checkIsTrial,
  compact,
  getModuleName,
  handleDownload,
} from 'utils'
import CommonFriendsItem from './CommonFriendsItem'
import DynamicDetailModal from './DynamicDetailModal'
import ColleagueBrowse from './ColleagueBrowse'
import RemarkItem from './RemarkItem'
import ContactStatusItem from './ContactStatusItem'
import GroupItem from './GroupItem'
import BasicInfo from './BasicInfo'
import LatestDynamic from './LatestDynamic'
import CallRecords from 'componentsV2/Layout/Profile/CallRecords'
import AsyncWrapPopover from './AsyncWrapPopover'
import PaginationWrapPopover from './PaginationWrapPopover'
import styles from './commonCard.less'

const ResumeTooltip = ({ data }) => {
  const { delivery_time, upload_time } = data
  if (delivery_time >= upload_time || !upload_time) {
    return <span>??????????????? {delivery_time.substr(5)}</span>
  } else {
    return <span>????????????????????? {upload_time.substr(5)}</span>
  }
}

@connect((state) => ({
  currentUser: state.global.currentUser,
  realPathname: state.global.realPathname,
  aiCallState: state.global.aiCallState,
  currentGroup: state.groups.currentGroup,
}))
export default class CommonCard extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showCheckbox: PropTypes.bool,
    showAvatar: PropTypes.bool,
    itemShowMap: PropTypes.object,
    opButtons: PropTypes.array,
    footerButtons: PropTypes.array,
    onOpFinish: PropTypes.func,
    isFinish: PropTypes.bool,
    trackParam: PropTypes.object,
    showExpectation: PropTypes.bool,
    container: PropTypes.element,
    showSpecialAttention: PropTypes.bool,
  }
  static defaultProps = {
    showAvatar: true,
    showCheckbox: false,
    itemShowMap: {},
    opButtons: [],
    footerButtons: [],
    onOpFinish: () => {},
    isFinish: false,
    trackParam: {}, // ???????????????????????????
    showExpectation: false,
    showSpecialAttention: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      showButtons: true,
      showDynamicDetailModal: false,
      data: props.data,
      commonFriendsPopoverVisible: false,
    }

    // const { currentGroup, realPathname } = this.props
    // const moduleName = getModuleName(realPathname)
    const { currentGroup } = this.props
    const moduleName = getModuleName(window.location.pathname)
    this.isInappropriate =
      currentGroup.key === 'inappropriate' && moduleName === 'groups'
  }

  componentDidMount() {
    window.broadcast.bind('addRemarksSuccess', this.handleAddRemarkFinish)
    window.broadcast.bind('addGroupSuccess', this.handleGroupFinish)
  }

  // eslint-disable-next-line react/sort-comp
  componentWillUnmount() {
    window.broadcast.unbind('addRemarksSuccess', this.handleAddRemarkFinish)
    window.broadcast.unbind('addGroupSuccess', this.handleGroupFinish)
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

    if (this.props.setScrollDom) {
      this.props.setScrollDom(dom)
    }
  }
  handleHideCommonFriendsPopover = () => {
    this.setState({
      commonFriendsPopoverVisible: false,
    })
  }
  handleCheck = (e) => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }
  handleDirectImFinish = (ids, res) => {
    this.props.onOpFinish('directIm', this.state.data, res)
  }
  handleDirectInviteFinish = () =>
    this.props.onOpFinish('directInvite', this.state.data)
  handleAskPhoneFinish = (ids) =>
    this.props.onOpFinish('askForPhone', this.state.data, 1)
  handleSetUnSuitableFinish = () =>
    this.props.onOpFinish('setState', this.state.data, 1)
  handleSetSuitableFinish = () =>
    this.props.onOpFinish('setState', this.state.data, 0)
  handleAddFriendFinish = (ids, res) =>
    this.props.onOpFinish('addFriend', this.state.data, res)
  handleDirectContactFinish = (ids, res) =>
    this.props.onOpFinish('directContact', this.state.data, res)
  handleAiCallFinish = (id, res) => {
    this.setState({
      data: {
        ...this.state.data,
        call_state: 1,
        call_state_new: 1,
        call_tip_new: '?????????????????????',
        call_tip: '?????????????????????',
      },
    })
    this.props.onOpFinish('aiCall', this.state.data, res)
  }

  onFinishWithConnect = (id, res) => {
    this.setState({
      data: {
        ...this.state.data,
        call_state: 2,
        call_state_new: 2,
      },
    })
  }

  handleShowDynamicModal = () => {
    const isTrial = checkIsTrial()

    if (isTrial) {
      this.handleTrial()
    } else {
      this.setState({
        showDynamicDetailModal: true,
      })
    }
  }

  handleHiddenDetailModal = () => {
    this.setState({
      showDynamicDetailModal: false,
    })
  }

  handleAddRemarkFinish = (id) => {
    if (id === this.state.data.id) {
      this.setState({
        data: {
          ...this.state.data,
          remark_cnt: R.propOr(0, 'remark_cnt', this.state.data) + 1,
        },
      })
    }
  }

  handleGroupFinish = ({ groups = [], uids = [] }) => {
    if (uids.includes(this.state.data.id)) {
      const groupsLength = R.propOr(0, 'length', groups)
      // ?????????????????????????????????????????????
      this.setState({
        data: {
          ...this.state.data,
          group_cnt:
            uids.length === 1
              ? groupsLength
              : this.state.data.group_cnt || groupsLength,
        },
      })
    }
  }

  handleShowChat = () => redirectToIm(this.state.data.id)
  handleShowButtons = (e) => {
    this.setState({ showButtons: true })
    e.stopPropagation()
    e.preventDefault()
  }
  // handleHideButtons = e => {
  //   this.setState({ showButtons: false })
  //   e.stopPropagation()
  //   e.preventDefault()
  // }

  handleTrial = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '????????????????????? ??????????????????',
        cancelTxt: '????????????',
        confirmTxt: '????????????',
      },
    })
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
      >
        <Avatar avatar={avatar} name={name} style={style} key="avatar" />
      </PreviewButton>
    )
  }
  renderButtons = (buttons) => {
    const { data, showButtons } = this.state
    const hasInvited = !!data.is_direct_im
    let chatFr // ????????????fr
    let aiCallFr // ????????????fr
    if (R.pathOr('', ['props', 'trackParam', 'type'], this) === 'canchat') {
      chatFr = 'jobInteractionsAcceptTalksForPc'
      aiCallFr = 'jobInteractionsAcceptTalksForPc'
    } else if (
      R.pathOr('', ['props', 'trackParam', 'type'], this) === 'visitor'
    ) {
      chatFr = 'jobInteractionsVisitorsForPc'
      aiCallFr = 'jobInteractionsVisitorsForPc'
    } else if (
      R.pathOr('', ['props', 'trackParam', 'type'], this) === 'recommend'
    ) {
      aiCallFr = 'jobInteractionsRecommendForPc'
    } else {
      aiCallFr = R.pathOr('', ['props', 'fr'], this)
    }

    const buttonsMap = {
      openAttention: (
        <SpecialAttention
          key="specialAttention"
          isShow={this.props.showSpecialAttention}
          type={false}
          id={data.id}
        />
      ),
      closeAttention: (
        <SpecialAttention
          key="specialAttention"
          isShow={this.props.showSpecialAttention}
          type={true}
          id={data.id}
        />
      ),
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
        <div className={styles.button} key="DirectIMButton">
          <DirectChatButton
            key="DirectIMButton"
            talents={[data]}
            onInviteFinish={this.handleDirectImFinish}
            disabled={hasInvited}
            buttonText="????????????"
            trackParam={this.props.trackParam}
            type="primary"
          />
        </div>
      ),
      group: this.props.currentUser.license ? (
        <GroupButton
          key="groupButton"
          talents={[data]}
          buttonText="????????????"
          // onOpFinish={() => {
          //   this.handleGroupFinish(group)
          // }}
          iconType=""
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          trackParam={this.props.trackParam}
        >
          {data.group_cnt > 0 ? '????????????' : '????????????'}
        </GroupButton>
      ) : null,
      askForPhone: this.props.currentUser.show_ask_for_phone ? (
        <AskForPhoneButton
          key="askForPhone"
          talents={[data]}
          buttonText="????????????"
          onOpFinish={this.handleAskPhoneFinish}
          iconType=""
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          trackParam={this.props.trackParam}
        />
      ) : null,
      editGroup:
        this.state.data.op_state === 1 ? null : (
          <GroupButton
            key="editGroupButton"
            talents={[data]}
            buttonText="????????????"
            // onGroupFinish={(group) => {
            //   this.handleGroupFinish(group)
            // }}
            iconType=""
            className="margin-left-16"
            type="button_s_exact_link_bgray"
            trackParam={this.props.trackParam}
          >
            {data.group_cnt > 0 ? '????????????' : '????????????'}
          </GroupButton>
        ),
      addFriend: (
        <AddFriendButton
          key="addfr"
          talents={[data]}
          trackParam={this.props.trackParam}
          onAddFinish={this.handleAddFriendFinish}
          disabled={!!data.friend_state}
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          content="?????????"
        />
      ),
      aiCall: (
        <AiCallButton
          key="aiCall"
          data={data}
          trackParam={this.props.trackParam}
          onFinish={this.handleAiCallFinish}
          onFinishWithConnect={this.onFinishWithConnect}
          className="margin-right-16"
          type="primary"
          fr={aiCallFr}
          wrapperDom={this.wrapperDom}
        />
      ),
      setState:
        this.state.data.op_state === 1 || this.isInappropriate ? (
          <SetSuitableButton
            key="setUnSuitable"
            talents={[data]}
            trackParam={this.props.trackParam}
            onOpFinish={this.handleSetSuitableFinish}
            className="margin-left-16 font-size-12"
            type="button_s_exact_link_bgray"
            content="???????????????"
            wrapperDom={this.wrapperDom}
          />
        ) : (
          <SetUnsuitableButton
            key="setUnSuitable"
            talents={[data]}
            trackParam={this.props.trackParam}
            onOpFinish={this.handleSetUnSuitableFinish}
            className="margin-left-16"
            type="button_s_exact_link_bgray"
            content="???????????????"
            wrapperDom={this.wrapperDom}
          />
        ),
      communicate: (
        <Button
          key="communicate"
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          onClick={this.handleShowChat}
        >
          ????????????
        </Button>
      ),
      chat: this.state.showButtons ? (
        <Button
          key="chat"
          type="button_s_exact_link_bgray"
          className="margin-left-16"
          onClick={this.handleShowChat}
        >
          ?????????
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
            '????????????',
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
          fr={chatFr}
          onContactFinish={this.handleDirectContactFinish}
          buttonText="????????????"
          type="primary"
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
          buttonText="????????????"
          trackParam={this.props.trackParam}
          fr={this.props.fr}
        />
      ),
      microResume: (
        <ShowMicroResumeButton
          key="microResume"
          talent={data}
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          trackParam={this.props.trackParam}
          content="???????????????"
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
          buttonText={hasInvited ? '????????????' : '????????????'}
          type="primary"
        />
      ),
      addRemark: (
        <AddRemarkButton
          data={data}
          className="margin-left-16"
          type="button_s_exact_link_bgray"
          // onOpFinish={this.handleAddRemarkFinish}
          trackParam={this.props.trackParam}
          content="????????????"
          key="addRemark"
        />
      ),
    }

    buttonsMap['aiCallTrial'] = (
      <Button
        className="margin-right-16"
        type="primary-2"
        onClick={this.handleTrial}
      >
        ????????????
      </Button>
    )
    buttonsMap['directContactTrial'] = (
      <Button type="primary" onClick={this.handleTrial}>
        ????????????
      </Button>
    )
    buttonsMap['addRemarkTrial'] = (
      <Button
        type="button_s_exact_link_bgray"
        onClick={this.handleTrial}
        className="margin-left-16"
      >
        ????????????
      </Button>
    )
    buttonsMap['groupTrial'] = (
      <Button
        type="button_s_exact_link_bgray"
        onClick={this.handleTrial}
        className="margin-left-16"
      >
        ????????????
      </Button>
    )
    buttonsMap['addFriendTrial'] = (
      <Button
        type="button_s_exact_link_bgray"
        onClick={this.handleTrial}
        className="margin-left-16"
      >
        ?????????
      </Button>
    )

    // ????????????
    if (JSON.stringify(data.resume) !== '{}') {
      buttonsMap['resume'] = (
        <div className="margin-right-8 resume-download-button">
          <Tooltip
            placement="top"
            overlayClassName="resume-tooltip"
            title={
              <AsyncWrapPopover
                type="resume"
                ChildComponent={ResumeTooltip}
                dispatchQuery={{
                  type: 'talents/fetchResumeDelivery',
                  payload: {
                    to_uid: data.id,
                  },
                }}
              />
            }
          >
            <Button
              type="primary-2"
              className="margin-right-8"
              onClick={
                data.resume &&
                handleDownload.bind(
                  this,
                  data.resume.file_url,
                  'jobs_pc_talent_download_all_resume',
                  {
                    u2: data.id,
                    fr: 'talent_card',
                    is_delivery: data.resume.is_delivery,
                  }
                )
              }
            >
              <Icon
                type="download_s"
                theme="outlined"
                className="margin-right-4"
              />
              ????????????
            </Button>
          </Tooltip>
        </div>
      )
    }

    return compact(buttons).map((buttonKey) => {
      return buttonsMap[buttonKey] || null
    })
  }
  renderFooter = () => {
    return (
      <div
        className={styles.footer}
        style={{
          paddingLeft:
            this.props.showAvatar || this.props.showCheckbox ? '56px' : '0',
          position: 'relative',
        }}
        ref={(dom) => {
          this.footer = dom
        }}
      >
        <span
          className={`${styles.leftButtons} flex`}
          style={{ flexWrap: 'wrap' }}
        >
          {/* ???????????? */}
          {!!R.propOr(0, 'friends_cnt', this.state.data) && (
            <div className={styles.footerItem}>
              <Popover
                // trigger="click"
                placement="bottomLeft"
                visible={this.state.commonFriendsPopoverVisible}
                onVisibleChange={(visible) => {
                  this.setState({ commonFriendsPopoverVisible: visible })
                }}
                content={
                  <PaginationWrapPopover
                    bigTitle={['???????????????', '???????????????']}
                    ChildComponent={CommonFriendsItem}
                    dispatchQuery={{
                      type: 'global/fetchCommonFriends',
                      payload: {
                        to_uid: this.state.data.id,
                        // size: 20, ???????????? 20
                      },
                    }}
                    onAvatarClick={this.handleHideCommonFriendsPopover}
                    total="friends_cnt"
                  />
                }
                className={`ellipsis ${styles.content}`}
                getPopupContainer={() => this.footer}
                autoAdjustOverflow={false}
              >
                <span>
                  ???????????? {R.propOr(0, 'friends_cnt', this.state.data)}
                </span>
              </Popover>
            </div>
          )}
          {/* ?????? */}
          {!!R.propOr(0, 'browse_cnt', this.state.data) && (
            <div className={styles.footerItem}>
              <Popover
                // trigger="click"
                placement="bottomLeft"
                content={
                  <PaginationWrapPopover
                    bigTitle={['', '??????????????????']}
                    ChildComponent={ColleagueBrowse}
                    dispatchQuery={{
                      type: 'talents/fetchCoBrowser',
                      payload: {
                        to_uid: this.state.data.id,
                      },
                    }}
                    total="total"
                  />
                }
                className={`ellipsis ${styles.content}`}
                getPopupContainer={() => this.footer}
                autoAdjustOverflow={false}
              >
                <span>?????? {R.propOr(0, 'browse_cnt', this.state.data)}</span>
              </Popover>
            </div>
          )}
          {!!R.propOr(0, 'contact_cnt', this.state.data) && (
            <div className={styles.footerItem}>
              <Popover
                trigger="hover"
                placement="bottomLeft"
                content={
                  <PaginationWrapPopover
                    bigTitle={['?????????', '?????????']}
                    ChildComponent={CallRecords}
                    dispatchQuery={{
                      type: 'talents/fetchContact',
                      payload: {
                        to_uid: this.state.data.id,
                      },
                    }}
                    total="count"
                  />
                }
                className={`ellipsis ${styles.content}`}
                getPopupContainer={() => this.footer}
                autoAdjustOverflow={false}
              >
                <span>?????? {R.propOr(0, 'contact_cnt', this.state.data)}</span>
              </Popover>
            </div>
          )}
          {/* ?????? */}
          {!!R.propOr(0, 'remark_cnt', this.state.data) && (
            <div className={styles.footerItem}>
              <Popover
                // trigger="click"
                placement="bottomLeft"
                content={
                  <PaginationWrapPopover
                    bigTitle={`${R.propOr(
                      '',
                      'name',
                      this.state.data
                    )}????????????${R.propOr(
                      0,
                      'remark_cnt',
                      this.state.data
                    )}??????`}
                    ChildComponent={RemarkItem}
                    dispatchQuery={{
                      type: 'talents/fetchRemarks',
                      payload: {
                        to_uid: this.state.data.id,
                      },
                    }}
                    total="count"
                  />
                }
                className={`ellipsis ${styles.content}`}
                getPopupContainer={() => this.footer}
                autoAdjustOverflow={false}
              >
                <span>?????? {R.propOr(0, 'remark_cnt', this.state.data)}</span>
              </Popover>
            </div>
          )}
          {/* ???????????? */}
          {/* {!!R.propOr(0, 'contact_cnt', this.state.data) && (
          <div className={styles.footerItem}>
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={
                <PaginationWrapPopover
                  bigTitle={[`???`, '???????????????']}
                  ChildComponent={ContactStatusItem}
                  dispatchQuery={{
                    type: 'talents/fetchContact',
                    payload: {
                      to_uid: this.state.data.id,
                      // size: 20, ???????????? 20
                    },
                  }}
                  total="count"
                />
              }
              className={`ellipsis ${styles.content}`}
              getPopupContainer={() => this.footer}
              autoAdjustOverflow={false}
            >
              <span>
                ???????????? {R.propOr(0, 'contact_cnt', this.state.data)}
              </span>
            </Popover>
          </div>
        )} */}
          {/* ?????? */}

          {!!R.pathOr(0, ['group_cnt'], this.state.data) && (
            <div className={styles.footerItem}>
              <Popover
                // trigger="click"
                placement="bottomLeft"
                content={
                  <AsyncWrapPopover
                    bigTitle={`${this.state.data.name}????????????${R.pathOr(
                      0,
                      ['group_cnt'],
                      this.state.data
                    )}?????????`}
                    ChildComponent={GroupItem}
                    dispatchQuery={{
                      type: 'talentPool/fetchGroupsByUid',
                      payload: {
                        to_uid: this.state.data.id,
                      },
                    }}
                  />
                }
                getPopupContainer={() => this.footer}
                autoAdjustOverflow={false}
              >
                <span className={`ellipsis ${styles.content}`}>
                  ?????? {R.pathOr(0, ['group_cnt'], this.state.data)}
                </span>
              </Popover>
            </div>
          )}
          {/* {????????????} */}
          <LatestDynamic
            data={{ ...this.state.data }}
            onShowDynamicModal={this.handleShowDynamicModal}
          />
        </span>
        <span className={styles.buttons}>
          {/* only unsuitable button is disaplayed in in appropriate modue */}
          {this.renderButtons(
            !this.isInappropriate ? this.props.footerButtons : ['setState']
          )}
        </span>
      </div>
    )
  }

  render() {
    const { data } = this.state
    const { showAvatar, showCheckbox, itemShowMap } = this.props
    const style = {
      ...this.props.style,
      opacity: data.op_state === 1 ? 0.5 : 1,
    }
    if (itemShowMap[data.id] && data.is_new) {
      style.background = 'rgba(253,224,0,0.1)'
    } else {
      style.background = 'none'
    }

    return (
      <div
        className={`${styles.card} ${
          // data.op_state === 1 ? styles.disabled : ''
          ''
        }`}
        className={styles.card}
        style={style}
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // onMouseOver={this.handleShowButtons}
        // onMouseLeave={this.handleHideButtons}
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
            buttons={
              !this.isInappropriate
                ? this.renderButtons(this.props.opButtons)
                : null
            }
            extraButton={this.renderButtons([
              data.mobile ? 'showPhone' : '',
              data.attachment_resume_url ? 'attachmentResume' : '',
            ])}
            trackParam={this.props.trackParam}
            fr={this.props.fr}
            showExpectation={this.props.showExpectation}
            isSpecialAttention={this.props.isSpecialAttention}
          />
        </div>
        {this.renderFooter()}
        {this.state.showDynamicDetailModal && (
          <DynamicDetailModal
            onHiddenDetailModal={this.handleHiddenDetailModal}
            trackParam={this.props.trackParam}
            fr={this.props.fr}
            userInfo={this.state.data}
            version={this.props.version}
          />
        )}
      </div>
    )
  }
}
