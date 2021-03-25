import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { redirectToIm } from 'utils'
import { Avatar, Icon } from 'mm-ent-ui'
import { retreiveNewStacks } from 'utils/stacks'
import styles from './index.less'

@connect((state) => ({
  uids: state.profile.uids,
  currentIndex: state.profile.currentIndex,
}))
export default class CommonFriends extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleToDetail = (uid) => () => {
    const { uids = [], currentIndex } = this.props
    const newUids = retreiveNewStacks(uids, currentIndex, uid)
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        currentUid: uid,
        uids: newUids,
        currentIndex: newUids.length - 1,
      },
    })
  }

  renderAvatar = (item) => {
    const { name, avatar, id: uid } = item
    return (
      <Avatar
        shape="circle"
        size="40px"
        name={name}
        src={avatar}
        className={`${styles.avatarArea}`}
        onClick={this.handleToDetail(uid)}
      />
    )
  }

  renderMiddleArea = (item) => {
    const desc = `${item.company}${item.company && item.position && '·'}${
      item.position
    }`
    return (
      <div className={`${styles.middleArea}`}>
        <div className={`${styles.name}`} title={item.name}>
          {item.name}
        </div>
        <div className={`${styles.desc}`} title={desc}>
          {desc || '-'}
          {item.judge === 1 && <Icon type="v" className="margin-left-4" />}
        </div>
      </div>
    )
  }

  renderRightArea = (item) => {
    return (
      <div className={`${styles.rightArea}`}>
        <div
          className={`${styles.btn} margin-right-5`}
          onClick={() => redirectToIm(item.id)}
        >
          沟通
        </div>
      </div>
    )
  }

  render() {
    const { data = [] } = this.props
    return (
      <div className={styles.commonFriendsCon}>
        {data.map((item) => {
          return (
            <div
              key={`${item.name}${item.id}`}
              className={styles.commonFriendsItem}
            >
              {this.renderAvatar(item)}
              {this.renderMiddleArea(item)}
              {this.renderRightArea(item)}
            </div>
          )
        })}
      </div>
    )
  }
}
