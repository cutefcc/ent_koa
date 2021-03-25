import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { redirectToIm } from 'utils'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/PreviewButton'
import DirectChatButton from 'components/Common/DirectChatButton'

import styles from './recommendBrief.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onOpFinish: PropTypes.func,
    source: PropTypes.string,
  }

  static defaultProps = {
    onOpFinish: () => {},
    source: 'unknown',
  }

  state = {
    hasInvite: false,
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  handleShowDetail = () => {
    const { detail_url: detailUrl } = this.props.data
    if (!detailUrl) {
      return
    }
    window.open(detailUrl)
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
      data: { avatar = '', name = '秘密' },
    } = this.props
    const style = {
      width: '40px',
      height: '40px',
      fontSize: '24px',
      lineHeight: '40px',
      borderRadius: '20px',
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
          onClick={this.handleShowDetail}
          key="avatar"
        />
      </PreviewButton>
    )
  }

  renderLine1 = () => {
    const {
      data: { name = '神秘人物', position = '神秘职位', worktime = '' },
      data,
    } = this.props

    const { hasInvite } = this.state

    return (
      <div className={styles.line1}>
        <div>{this.renderAvatar()}</div>
        <div className={styles.between}>
          <div className="font-size-16 color-stress">{name}</div>
          <div className="margin-top-8 color-common font-size-14">
            {`${position} · ${worktime}`}
          </div>
        </div>
        <div>
          <DirectChatButton
            key="DirectIMButton"
            talents={[data]}
            source={this.props.source}
            onInviteFinish={this.handleDirectImFinish}
            disabled={hasInvite}
            className={styles.directImButton}
            buttonText="极速联系"
          />
        </div>
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

  render() {
    return (
      <div className={styles.card}>
        {this.renderLine1()}
        {this.renderLine2()}
      </div>
    )
  }
}

export default connect()(TalentCard)
