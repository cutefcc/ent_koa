import React from 'react'
import PropTypes from 'prop-types'
import { redirectToIm } from 'utils'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/PreviewButton'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import ChannelInviteButton from 'componentsV2/Common/RightButton/ChannelInviteButton'

import styles from './channelBrief.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onOpFinish: PropTypes.func,
    source: PropTypes.string,
    isFinish: PropTypes.bool,
  }

  static defaultProps = {
    onOpFinish: () => {},
    source: 'unknown',
    isFinish: false,
  }

  state = {
    hasInvite: false,
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  handleCheck = (e) => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }

  handleDirectImFinish = () => {
    this.setState({
      hasInvite: true,
    })
  }

  handleGroupFinish = (ids, groupName) => {
    this.props.onOpFinish('group', this.props.data, groupName)
  }

  handleAddFriendFinish = () => {
    this.props.onOpFinish('addFriend', this.props.data)
  }

  handleShowChat = () => {
    redirectToIm(this.props.data.id)
  }

  renderAvatar = () => {
    const {
      data: { avatar = '', name = '' },
    } = this.props
    const style = {
      width: '24px',
      height: '24px',
      fontSize: '14px',
      lineHeight: '24px',
      borderRadius: '12px',
    }

    return (
      <PreviewButton
        data={this.props.data}
        key="previewButton"
        className={styles.avatarButton}
        iconType="preview"
      >
        <Avatar
          avatar={avatar}
          name={name}
          style={style}
          key="avatar"
          className="cursor-pointer"
        />
      </PreviewButton>
    )
  }

  renderLine1 = () => {
    const {
      data: {
        position = '神秘职位',
        directed_num: directNum = 0,
        worktime = '',
      },
    } = this.props
    const directNumComputed = this.state.hasInvite ? directNum + 1 : directNum

    return (
      <div className={styles.line1}>
        <span className="font-size-16 color-stress">
          {`${position}·${worktime}`}
        </span>
        {directNumComputed > 0 && (
          <span className="color-dilution">已被联系{directNumComputed}次</span>
        )}
      </div>
    )
  }

  renderLine2 = () => {
    const {
      data: { company = '神秘公司', school = '神秘学校', sdegree = '' },
    } = this.props
    return (
      <div className={styles.line2}>
        <span className="color-common">
          {`${company} / ${school}·${sdegree}`}
        </span>
      </div>
    )
  }

  renderLine3 = () => {
    const {
      data: {
        name = '',
        is_direct_im: isDirectIm,
        direct_contact_st: directContactSt,
      },
      data,
      isFinish,
      source,
      channelId,
    } = this.props
    const hasInvited = !!isDirectIm || this.state.hasInvite
    const button =
      directContactSt === 1 ? (
        <DirectContactButton
          talents={[data]}
          trackParam={{ type: 'channel_brief_card' }}
          // className="primary-button"
          type="primary"
          buttonText="立即沟通"
        />
      ) : (
        <ChannelInviteButton
          key="DirectIMButton"
          talents={[data]}
          source={source}
          onInviteFinish={this.handleDirectImFinish}
          disabled={isFinish || hasInvited}
          buttonText={hasInvited ? '已联系' : `极速联系`}
          channelId={channelId}
          className={styles.button}
        />
      )
    return (
      <div className={styles.line3}>
        <div>
          {this.renderAvatar()}
          <span className={styles.name}>{name}</span>
        </div>
        <div>{button}</div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.card}>
        {this.renderLine1()}
        {this.renderLine2()}
        {this.renderLine3()}
      </div>
    )
  }
}

export default connect()(TalentCard)
