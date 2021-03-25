import React from 'react'
import { DrawerNew } from 'mm-ent-ui'
import { connect } from 'react-redux'
import { checkIsTrial } from 'utils'
import ErrorBoundary from 'componentsV2/Common/ErrorBoundary'
import * as R from 'ramda'
import * as model from './model'
import Card from './Card'
import TabPanes from './TabPanes'
import TalentDynamic from './TalentDynamic'
import Group from './Group'
import Remarks from './Remarks'
import CommonFriends from './CommonFriends'
import InterestContact from './InterestContact'
import CallRecords from './CallRecords'
import Title from './Title'
import styles from './index.less'

@connect((state) => ({
  visible: state.profile.visible,
  trackParam: state.profile.trackParam,
  fr: state.profile.fr,
  currentUid: state.profile.currentUid,
  currentUser: state.global.currentUser,
}))
export default class Profile extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      interestContact: [], // 看了他的人还看了谁
      qualityAndFastGrowth: {}, // 优质人才 和 高速度成长人才
      group: {}, // 分组
      comment: {}, // 好友评价
      basicInfo: {},
      userTag: {},
      jobPreference: {}, // 求职偏好
      tabsData: {}, // tab的数字
      uid: this.props.currentUid,
      visible: this.props.visible,
      showShortcutOp: false,
      contactStatus: [], // 沟通记录
    }
  }

  componentDidMount() {
    if (this.state.uid && this.state.visible) {
      this.refreshData()
    }

    window.broadcast.bind('addFriendSuccess', this.handleAddFriendSuccess)
    window.broadcast.bind('askForPhoneSuccess', this.handleAskForPhoneSuccess)
    window.broadcast.bind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.bind('addGroupSuccess', this.handleGroupFinish)
    window.broadcast.bind(
      'directContactSuccess',
      this.handleDirectContactSuccess
    )
  }

  componentWillReceiveProps(newProps) {
    if (
      // newProps.currentUid !== this.props.currentUid &&
      newProps.visible &&
      newProps.currentUid
    ) {
      this.setState(
        {
          uid: newProps.currentUid,
          visible: newProps.visible,
          showShortcutOp: false,
          basicInfo: {},
        },
        this.refreshData
      )
    }
  }

  componentWillUnmount() {
    window.broadcast.unbind('addFriendSuccess', this.handleAddFriendSuccess)
    window.broadcast.unbind('askForPhoneSuccess', this.handleAskForPhoneSuccess)
    window.broadcast.unbind('directImSuccess', this.handleDirectImSuccess)
    window.broadcast.unbind('addGroupSuccess', this.handleGroupFinish)
    window.broadcast.unbind(
      'directContactSuccess',
      this.handleDirectContactSuccess
    )
  }

  setScrollDom = (dom) => {
    this.scrollDom = dom
  }

  getScrollDom = () => this.scrollDom

  getLoadDataConfig = () => {
    const { uid } = this.state
    const isTrial = checkIsTrial()
    return [
      {
        type: 'profile/fetchBasicInfo',
        getPayload: () => ({ to_uid: uid }),
        result: 'basicInfo',
      },
      {
        type: 'profile/fetchInterestContact',
        getPayload: () => ({ uid }),
        result: 'interestContact',
      },
      // {
      //   type: 'talentDiscover/fetchHighQualityTalent',
      //   getPayload: () => ({to_uid: uid}),
      //   result: 'qualityAndFastGrowth',
      // },
      {
        type: 'profile/fetchCommentList',
        getPayload: () => ({ uid }),
        result: 'comment',
      },
      {
        type: 'talents/fetchContact',
        getPayload: () => ({ to_uid: uid }),
        result: 'contactStatus',
      },
      ...(isTrial
        ? []
        : [
            {
              type: 'talentPool/fetchGroupsByUid',
              getPayload: () => ({ to_uid: uid }),
              result: 'group',
            },
          ]),
      {
        type: 'profile/fetchUserTag',
        getPayload: () => ({ uid }),
        result: 'userTag',
      },
      {
        type: 'profile/fetchTabs',
        getPayload: () => ({ to_uid: uid }),
        result: 'tabsData',
      },
    ]
  }

  refreshData = () => {
    const configs = this.getLoadDataConfig()
    configs.map(this.fetchData)
  }

  fetchData = (conf) => {
    // if (R.conf) {
    //   return
    // }
    this.props
      .dispatch({
        type: conf.type,
        payload: conf.getPayload(),
      })
      .then(({ data }) => {
        this.setState({
          [conf.result]: data,
        })

        if (conf.result === 'interestContact') {
          // 看了ta的人还看了 打点
          data.forEach((item) => {
            if (window.voyager) {
              const { uid } = this.state
              const param = {
                datetime: new Date().getTime(),
                uid: window.uid,
                profileid: uid,
                watchedid: item.uid,
                ...this.props.trackParam,
              }
              const key = 'jobs_pc_talent_show_profile_watched_others'
              window.voyager.trackEvent(key, key, param)
            }
          })
        }

        const isTrial = checkIsTrial()
        // 同公司员工，或者试用版不展示求职偏好
        if (conf.type === 'profile/fetchBasicInfo' && !isTrial) {
          const isWorkmate = model.isWorkmate(this.props.currentUser, data)
          if (!isWorkmate) {
            this.fetchData({
              type: 'profile/fetchJobPreference',
              getPayload: () => ({ to_uid: this.state.uid, page: 0, size: 20 }),
              result: 'jobPreference',
            })
          } else {
            this.setState({
              jobPreference: {},
            })
          }
        }
      })
  }

  handleAddFriendSuccess = (uids = []) => {
    if (uids.includes(this.state.basicInfo.id)) {
      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          friend_state: 1,
        },
      })
    }
  }

  handleAskForPhoneSuccess = (uid) => {
    if (uid === this.state.basicInfo.id) {
      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          call_state: 1,
          call_tip_new: '虚拟电话索要中',
          call_tip: '虚拟电话索要中',
        },
      })
    }
  }

  handleDirectImSuccess = (uids = []) => {
    if (uids.includes(this.state.basicInfo.id)) {
      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          is_direct_im: 1,
        },
      })
    }
  }

  handleDirectContactSuccess = (uids = []) => {
    if (uids.includes(this.state.basicInfo.id)) {
      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          recent_dc_chat: 1,
        },
      })
    }
  }

  handleGroupFinish = ({ groups = [], uids = [] }) => {
    this.fetchData({
      type: 'talentPool/fetchGroupsByUid',
      getPayload: () => ({ to_uid: this.props.currentUid }),
      result: 'group',
    })

    if (uids.includes(this.state.basicInfo.id)) {
      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          group_cnt: groups.length,
        },
      })
    }
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        visible: false,
      },
    })

    this.setState({
      showShortcutOp: false,
    })
  }

  handleTabAffixStatusChange = (affix) => {
    this.setState({
      showShortcutOp: affix,
    })
  }

  // 设置或者取消特别关注成功回调
  handleSpecialAttentionSuccess = () => {
    const oldSpecialAttention = R.pathOr(
      0,
      ['state', 'basicInfo', 'is_special_attention'],
      this
    )
    const newSpecialAttention = oldSpecialAttention === 0 ? 1 : 0
    this.setState({
      basicInfo: {
        ...this.state.basicInfo,
        is_special_attention: newSpecialAttention,
      },
    })
  }

  renderContent = () => {
    const {
      basicInfo: { name },
      interestContact,
      group,
      contactStatus,
      uid,
    } = this.state
    const isTrial = checkIsTrial()
    return [
      <div className={styles.left} key="left">
        <ErrorBoundary>
          <Card
            data={this.state.basicInfo}
            onSpecialAttentionSuccess={this.handleSpecialAttentionSuccess}
            qualityAndFastGrowth={this.state.qualityAndFastGrowth}
            trackParam={this.props.trackParam}
            fr={this.props.fr}
          />
        </ErrorBoundary>
        <TabPanes
          getScrollDom={this.getScrollDom}
          basicInfo={this.state.basicInfo}
          tabsData={this.state.tabsData}
          comment={this.state.comment}
          jobPreference={this.state.jobPreference}
          userTag={this.state.userTag}
          onTabAffixStatusChange={this.handleTabAffixStatusChange}
        />
      </div>,
      <div className={styles.right} key="right">
        {!isTrial && <TalentDynamic />}
        <CallRecords
          data={contactStatus}
          hideHeader={false}
          hidePager={false}
        />
        <Group data={group} talent={this.state.basicInfo} />
        <Remarks name={name} />
        <CommonFriends />
        <InterestContact
          data={interestContact}
          trackParam={this.props.trackParam}
          uid={uid}
        />
      </div>,
    ]
  }

  render() {
    const { visible } = this.props
    if (!visible) {
      return null
    }
    const headerStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: '#3375FF',
      borderRadius: 0,
      padding: '12px 24px',
    }
    const bodyStyle = {
      position: 'absolute',
      top: '64px',
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: '#F2F4F8',
      padding: 0,
    }
    return (
      <DrawerNew
        className={styles.main}
        visible={this.props.visible}
        placement="right"
        title={
          <Title
            basicInfo={this.state.basicInfo}
            showShortcutOp={this.state.showShortcutOp}
          />
        }
        width={1032}
        zIndex={12}
        onClose={this.handleClose}
        getContainer={false}
        maskStyle={{ opacity: '0.8' }}
        closable={false}
        headerStyle={headerStyle}
        bodyStyle={bodyStyle}
      >
        <ErrorBoundary>
          <div className={styles.contentContainer} ref={this.setScrollDom}>
            <div className={styles.contentInner}>{this.renderContent()}</div>
          </div>
        </ErrorBoundary>
      </DrawerNew>
    )
  }
}
