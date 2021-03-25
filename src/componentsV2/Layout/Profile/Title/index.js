import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compact, checkIsTrial, handleDownload } from 'utils'
import AiCallButton from 'componentsV2/Common/RightButton/AiCallButton'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import { Icon, Button, Avatar, Text } from 'mm-ent-ui'
import styles from './index.less'

@connect((state) => ({
  uids: state.profile.uids,
  currentIndex: state.profile.currentIndex,
  currentUser: state.global.currentUser,
}))
export default class Title extends React.PureComponent {
  static propTypes = {
    basicInfo: PropTypes.object.isRequired,
    showShortcutOp: PropTypes.bool,
  }

  static defaultProps = {
    showShortcutOp: true,
  }

  onlyOne = () => {
    const { uids = [] } = this.props
    return uids.length === 1
  }

  hasNext = () => {
    const { uids = [], currentIndex } = this.props
    return currentIndex < uids.length - 1
  }

  hasLast = () => {
    const { currentIndex } = this.props
    return currentIndex > 0
  }

  hasNo = () => {
    const { uids = [] } = this.props
    return uids.length === 0
  }

  trackParam = {
    type: 'profile_title',
  }

  handleRedirectToLast = () => {
    const { uids, currentIndex } = this.props
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        currentIndex: currentIndex - 1,
        currentUid: uids[currentIndex - 1],
        uids,
      },
    })
  }

  handleRedirectToDetailPage = () => {
    const { detail_url: detailUrl = '', id } = this.props.basicInfo
    const url = detailUrl || `https://maimai.cn/contact/detail/${id}`
    window.open(url, '_blank')
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        visible: false,
      },
    })
  }

  handleRedirectToNext = () => {
    const { uids, currentIndex } = this.props
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        currentIndex: currentIndex + 1,
        currentUid: uids[currentIndex + 1],
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

  renderRight = () => {
    return (
      <div className={styles.right}>
        <Button
          type="button_s_exact_blue100"
          onClick={this.handleClose}
          className="margin-left-16"
        >
          关闭
        </Button>
        <Button
          type="button_s_exact_blue100"
          onClick={this.handleRedirectToDetailPage}
          className="margin-left-16"
        >
          新窗口打开
        </Button>
        {!this.onlyOne() && (
          <Button
            type="button_s_exact_blue100"
            onClick={this.handleRedirectToNext}
            className={`margin-left-16 ${styles.arrowBtn}`}
            disabled={!this.hasNext()}
          >
            <Icon type="arrow-right" className={styles.icon} />
          </Button>
        )}
        {!this.onlyOne() && (
          <Button
            type="button_s_exact_blue100"
            onClick={this.handleRedirectToLast}
            className={`${styles.arrowBtn}`}
            disabled={!this.hasLast()}
          >
            <Icon type="arrow-left" className={styles.icon} />
          </Button>
        )}
      </div>
    )
  }

  renderTrialButton = ({ title, ...restProps }) => {
    return (
      <Button {...restProps} onClick={this.handleTrial}>
        {title}
      </Button>
    )
  }

  renderResumeDownload = () => {
    const { basicInfo: { resume, id } = {} } = this.props

    if (!resume) return null
    const { file_url, is_delivery } = resume

    return (
      <Button
        type="primary-2"
        className="margin-right-8"
        onClick={handleDownload.bind(
          this,
          file_url,
          'jobs_pc_talent_download_all_resume',
          { u2: id, fr: 'profile_top', is_delivery }
        )}
      >
        <Icon type="download_s" theme="outlined" className="margin-right-4" />
        下载简历
      </Button>
    )
  }

  renderAiCallButton = () => {
    const { basicInfo = {} } = this.props
    const isTrial = checkIsTrial()

    return isTrial ? (
      this.renderTrialButton({
        type: 'primary-2',
        className: 'margin-right-8',
        key: 'aiCall',
        title: '索要电话',
      })
    ) : (
      <AiCallButton
        key="aiCall"
        data={basicInfo}
        trackParam={this.trackParam}
        className="margin-right-8"
        type="primary-2"
      />
    )
  }

  renderContactButton = () => {
    const {
      basicInfo = {},
      currentUser: { isV3 },
    } = this.props
    const isTrial = checkIsTrial()
    if (isTrial) {
      return this.renderTrialButton({
        type: 'primary-2',
        key: 'contact',
        title:
          basicInfo.direct_contact_st === 1 || isV3 ? '立即沟通' : '极速联系',
      })
    }

    return basicInfo.direct_contact_st === 1 || isV3 ? (
      <DirectContactButton
        key="DirectContactButton"
        talents={[basicInfo]}
        trackParam={this.trackParam}
        buttonText="立即沟通"
        type="primary-2"
      />
    ) : (
      <DirectChatButton
        key="DirectChatButton"
        talents={[basicInfo]}
        buttonText="极速联系"
        disabled={basicInfo.is_direct_im === 1}
        trackParam={this.trackParam}
        type="primary-2"
      />
    )
  }

  renderLeft = () => {
    const {
      basicInfo: { avatar, name = '', company = '', position = '' } = {},
    } = this.props

    const avatarDom = (
      <Avatar
        size={40}
        shape="circle"
        src={avatar}
        className="margin-right-16"
        name={name}
      />
    )

    const desc = compact([
      company && company !== '职业信息未完善' ? company : '',
      position,
    ])

    return this.props.showShortcutOp ? (
      <div className={styles.left}>
        <div className="flex flex-wrap-nowrap flex-nowrap flex-align-center flex-1 overflow-hidden">
          {avatarDom}
          {name && (
            <Text
              type="title"
              size={16}
              className="margin-right-8 word-keep-all"
              style={{ color: '#fff' }}
            >
              {name}
            </Text>
          )}
          {desc.length > 0 && (
            <Text
              type="text_common"
              size={14}
              className="margin-right-8 ellipsis"
              style={{ color: '#fff' }}
            >
              {desc.join('·')}
            </Text>
          )}
        </div>
        <div className="flex flex-align-center">
          {this.renderResumeDownload()}
          {this.renderAiCallButton()}
          {this.renderContactButton()}
        </div>
      </div>
    ) : (
      <div className={styles.left} />
    )
  }

  render() {
    if (this.hasNo()) {
      return null
    }

    return (
      <div className={styles.header}>
        {this.renderLeft()}
        {this.renderRight()}
      </div>
    )
  }
}
