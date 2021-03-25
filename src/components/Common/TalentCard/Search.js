import React from 'react'
import { Checkbox, Button } from 'antd'
import { redirectToIm } from 'utils'
import { Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/PreviewButton'
import DirectChatButton from 'components/Common/DirectChatButton'
import GroupButton from 'components/Common/GroupButton'
import AddFriendButton from 'components/Common/AddFriendButton'

import styles from './search.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showCheckbox: PropTypes.bool,
    buttons: PropTypes.array,
    onOpFinish: PropTypes.func,
    source: PropTypes.string,
  }

  static defaultProps = {
    showCheckbox: false,
    buttons: [],
    onOpFinish: () => {},
    source: 'unknown',
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  handleShowDetail = () => {
    window.open(
      `/ent/profile/${this.props.data.id}?source=${this.props.source}`
    )
  }

  handleCheck = (e) => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }

  handleDirectImFinish = () => {
    this.props.onOpFinish('directIm', this.props.data)
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
      width: '56px',
      height: '56px',
      fontSize: '30px',
      lineHeight: '56px',
      borderRadius: '28px',
      cursor: 'pointer',
    }

    return (
      // <PreviewButton
      //   data={this.props.data}
      //   key="previewButton"
      //   className={styles.avatarButton}
      //   iconType="preview"
      // >
      <Avatar
        avatar={avatar}
        name={name}
        style={style}
        onClick={this.handleShowDetail}
        key="avatar"
      />
      // </PreviewButton>
    )
  }

  renderLine1 = () => {
    const fields = [
      'province',
      'sdegree',
      'worktime',
      'age',
      // 'intention',
    ]
    const data = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(fields)
      )(this.props.data)
    )
    return [
      <span className={styles.baseInfo} key="info">
        {Object.values(data).join(' / ')}
      </span>,
      <span className={styles.buttons} key="buttons">
        {this.renderButtons()}
      </span>,
    ]
  }

  renderLine2 = () => {
    const { data } = this.props
    const hasHighlight =
      !R.isNil(data.highlights) && !R.isEmpty(data.highlights)
    const line21 = (
      <div key="line21" className={styles.line21}>
        <span className={styles.name}>{R.propOr('神秘人', 'name', data)}</span>
        <span className={styles.position}>
          {R.propOr('神秘职位', 'position', data)}
        </span>
        {data.friend_state === 2 && (
          <span className={styles.isFriend}>已是好友</span>
        )}
      </div>
    )
    const line22 = (
      <div key="line22" className={styles.line22}>
        <span className={styles.exp}>
          <span className={styles.label}>就职</span>
          {R.pathOr(0, ['exp', 'length'], data) ? (
            <span className={`ellipsis ${styles.content}`}>
              {R.pathOr('', ['exp', 0, 'company'], data)}·
              {R.pathOr('', ['exp', 0, 'worktime'], data)}
            </span>
          ) : (
            '无'
          )}
        </span>
        <span className={styles.tags}>
          <span className={styles.label}>标签</span>
          <span className={`ellipsis ${styles.content}`}>
            {!R.isNil(data.tags) && !R.isEmpty(data.tags)
              ? R.propOr('', 'tags', data).split(',').join('·')
              : '-'}
          </span>
        </span>
      </div>
    )
    const line23 = (
      <div key="line23" className={styles.line22}>
        <span className={styles.edu}>
          <span className={styles.label}>学历</span>
          {R.pathOr('', ['school'], data) ? (
            <span className={`ellipsis ${styles.content}`}>
              {R.pathOr('', ['school'], data)}-{R.pathOr('', ['sdegree'], data)}
            </span>
          ) : (
            '无'
          )}
        </span>
        <span className={styles.highlights}>
          <span className={styles.label}>亮点</span>
          <span
            className={`ellipsis ${
              hasHighlight ? styles.content : styles.emptyContent
            }`}
          >
            {hasHighlight
              ? R.propOr([], 'highlights', data).map(R.prop('name')).join('·')
              : '-'}
          </span>
        </span>
      </div>
    )

    const line24 =
      data.groups && data.groups.length > 0 ? (
        <div key="line24" className={styles.line24}>
          {data.groups.map((group) => (
            <span className={styles.groupLabel} key={group}>
              {group}
            </span>
          ))}
        </div>
      ) : null

    return [
      this.renderAvatar(),
      <div key="content" className={styles.right}>
        {line21}
        {line22}
        {line23}
        {line24}
      </div>,
    ]
  }

  renderButtons = () => {
    const { data } = this.props
    const hasInvited = !!data.is_direct_im

    const buttons = {
      preview: (
        <PreviewButton
          data={this.props.data}
          key="previewButton"
          className={styles.previewButton}
          iconType="preview"
        />
      ),
      directIm: (
        <DirectChatButton
          key="DirectIMButton"
          talents={[data]}
          source={this.props.source}
          onInviteFinish={this.handleDirectImFinish}
          disabled={hasInvited}
          className={styles.directImButton}
          buttonText="极速联系"
        />
      ),
      group: (
        <GroupButton
          key="groupButton"
          talents={[data]}
          buttonText=""
          onGroupFinish={this.handleGroupFinish}
          iconType="add_label"
          className={styles.groupButton}
        />
      ),
      addFriend: (
        <AddFriendButton
          key="addfr"
          talents={[data]}
          source={this.props.source}
          onAddFinish={this.handleAddFriendFinish}
          disabled={!!data.friend_state}
          iconType="add_friend"
          buttonText=""
          className={styles.addFriendButton}
        />
      ),
      chat: (
        <Button className={styles.chatButton} onClick={this.handleShowChat}>
          <Icon type="chat" />
        </Button>
      ),
    }
    return Object.values(R.pickAll(this.props.buttons, buttons))
  }

  renderInfo = () => {
    return (
      <div className={styles.info}>
        <div className={styles.line1}>{this.renderLine1()}</div>
        <div className={styles.line2}>{this.renderLine2()}</div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.card}>
        {this.props.showCheckbox && (
          <Checkbox
            checked={this.props.checked}
            onChange={this.handleCheck}
            className={styles.checkbox}
            disabled={this.props.disabledCheck}
          />
        )}
        {this.renderInfo()}
      </div>
    )
  }
}

export default connect()(TalentCard)
