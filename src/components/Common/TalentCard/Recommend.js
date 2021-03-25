import React from 'react'
import { Checkbox, Button } from 'antd'
import { Icon } from 'mm-ent-ui'
import { redirectToIm } from 'utils'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/PreviewButton'
import DirectChatButton from 'components/Common/DirectChatButton'
import DirectInviteButton from 'components/Common/DirectInviteButton'
import GroupButton from 'components/Common/GroupButton'
import AddFriendButton from 'components/Common/AddFriendButton'
import {
  DIRECT_INVITE_STATUS_TEXT_MAP,
  DISABLED_INVITE_STATUS,
} from 'constants/right'

import styles from './recommend.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showCheckbox: PropTypes.bool,
    buttons: PropTypes.array,
    onOpFinish: PropTypes.func,
    source: PropTypes.string,
    jid: PropTypes.number,
  }

  static defaultProps = {
    showCheckbox: false,
    buttons: [],
    onOpFinish: () => {},
    source: 'unknown',
    jid: undefined,
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  handleShowDetail = (e) => {
    e.stopPropagation()
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: R.pathOr(0, ['data', 'id'], this.props),
      }
      const key = 'jobs_pc_talent_profile_click'
      window.voyager.trackEvent(key, key, param)
      window.voyager.trackEvent('profile_exposure', 'profile_exposure', {
        ...param,
        exposure_channel: param.fr || 'jobs_pc_talent',
      })
    }
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
    this.props.onOpFinish('directIm', this.props.data)
  }

  handleDirectInviteFinish = () => {
    this.props.onOpFinish('directInvite', this.props.data)
  }

  handleGroupFinish = (ids, groupName) => {
    this.props.onOpFinish('group', this.props.data, groupName)
  }

  handleAddFriendFinish = () => {
    this.props.onOpFinish('addFriend', this.props.data)
  }

  handleShowChat = (e) => {
    e.stopPropagation()
    if (window.voyager) {
      const key = 'jobs_pc_talent_dc_click'
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: R.pathOr(0, ['data', 'id'], this.props),
      }
      window.voyager.trackEvent(key, key, param)
    }
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

  renderLeft = () => {
    const { data } = this.props
    const briefFields = ['province', 'sdegree', 'worktime', 'age']
    const briefData = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(briefFields)
      )(data)
    )
    const hasHighlight =
      !R.isNil(data.highlights) && !R.isEmpty(data.highlights)

    const line1 = (
      <p className={styles.line}>
        <span className={styles.lineItem}>
          <span className="font-color-stress font-size-18">
            {R.propOr('保密', 'name', data)}
          </span>
          <span className="font-color-common margin-left-8 font-size-14">
            {R.propOr('神秘职位', 'position', data)}
          </span>
          {data.friend_state === 2 && (
            <span className={styles.friendLabel}>好友</span>
          )}
        </span>
        <span className={`${styles.lineItem} color-dilution`}>
          {Object.values(briefData).join(' / ')}
        </span>
      </p>
    )

    const line2 = (
      <p className={`${styles.line}`}>
        <span className={`${styles.lineItem} ${styles.exp}`}>
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
        <span className={`${styles.lineItem} ${styles.tags}`}>
          <span className={styles.label}>标签</span>
          <span className={`ellipsis ${styles.content}`}>
            {!R.isNil(data.tags) && !R.isEmpty(data.tags)
              ? R.propOr('', 'tags', data).split(',').join('·')
              : '-'}
          </span>
        </span>
      </p>
    )

    const line3 = (
      <p className={`${styles.line}`}>
        <span className={`${styles.lineItem} ${styles.edu}`}>
          <span className={styles.label}>学历</span>
          {R.pathOr('', ['school'], data) ? (
            <span className={`ellipsis ${styles.content}`}>
              {R.pathOr('', ['school'], data)}-{R.pathOr('', ['sdegree'], data)}
            </span>
          ) : (
            '无'
          )}
        </span>
        <span className={`${styles.lineItem} ${styles.highlight}`}>
          <span className={styles.label}>亮点</span>
          {hasHighlight ? (
            <span className={`ellipsis color-orange ${styles.stressContent}`}>
              {R.propOr([], 'highlights', data).map(R.prop('name')).join('·')}
            </span>
          ) : (
            <span className="color-dilution">-</span>
          )}
        </span>
      </p>
    )

    const line4 = (
      <div className={styles.line}>
        {R.propOr([], 'groups', data).map((group) => (
          <span className={styles.groupLabel} key={group}>
            {group}
          </span>
        ))}
      </div>
    )

    return (
      <div className={styles.left}>
        {line1}
        {line2}
        {line3}
        {R.pathOr(0, ['groups', 'length'], data) > 0 && line4}
      </div>
    )
  }

  renderRight = () => {
    const { data } = this.props
    return (
      <div className={styles.right}>
        <div className={styles.line1}>{this.renderButtons()}</div>
        {!!data.visitor_time && (
          <div className={styles.line2}>访问时间 {data.visitor_time}</div>
        )}
      </div>
    )
  }

  renderButtons = () => {
    const { data, trackParam } = this.props
    const { id } = data
    const param = {
      ...trackParam,
      u2: id,
    }

    const hasInvited = !!data.is_direct_im

    const buttons = {
      preview: (
        <span className={styles.button}>
          <PreviewButton
            data={this.props.data}
            key="previewButton"
            className="circle-button"
            iconType="preview"
            trackParam={param}
          />
        </span>
      ),
      directIm: (
        <span className={styles.button}>
          <DirectChatButton
            key="DirectIMButton"
            talents={[data]}
            source={this.props.source}
            onInviteFinish={this.handleDirectImFinish}
            disabled={hasInvited}
            className="primary-button"
            buttonText="极速联系"
            trackParam={param}
          />
        </span>
      ),
      directInvite: (
        <span className={styles.button}>
          <DirectInviteButton
            key="DirectInviteButton"
            talents={[data]}
            source={this.props.source}
            onInviteFinish={this.handleDirectInviteFinish}
            disabled={DISABLED_INVITE_STATUS.includes(
              data.direct_invite_status
            )}
            className="primary-button"
            buttonText={R.propOr(
              '立即邀约',
              data.direct_invite_status,
              DIRECT_INVITE_STATUS_TEXT_MAP
            )}
            jid={this.props.jid}
            fr="ent_recommend"
            trackParam={param}
          />
        </span>
      ),
      group: (
        <span className={styles.button}>
          <GroupButton
            key="groupButton"
            talents={[data]}
            buttonText=""
            onGroupFinish={this.handleGroupFinish}
            iconType="add_label"
            className="circle-button"
            trackParam={param}
          />
        </span>
      ),
      addFriend: (
        <span className={styles.button}>
          <AddFriendButton
            key="addfr"
            talents={[data]}
            source={this.props.source}
            onAddFinish={this.handleAddFriendFinish}
            disabled={!!data.friend_state}
            iconType="add_friend"
            buttonText=""
            className="circle-button"
            trackParam={param}
          />
        </span>
      ),
      chat: (
        <span className={styles.button}>
          <Button className="circle-button" onClick={this.handleShowChat}>
            <Icon type="chat" />
          </Button>
        </span>
      ),
    }
    return Object.values(R.pickAll(this.props.buttons, buttons))
  }

  renderInfo = () => {
    return (
      <div className={styles.info}>
        {this.renderLeft()}
        {this.renderRight()}
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
        <div className={styles.contentContainer}>
          <div className={styles.avatar}>{this.renderAvatar()}</div>
          {this.renderInfo()}
        </div>
      </div>
    )
  }
}

export default connect()(TalentCard)
