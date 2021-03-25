import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Avatar, Icon } from 'mm-ent-ui'
import { retreiveNewStacks } from 'utils/stacks'
import styles from './index.less'

@connect((state) => ({
  uids: state.profile.uids,
  currentIndex: state.profile.currentIndex,
}))
export default class InterestContact extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  handleToDetail = (uid) => () => {
    const { uids = [], currentIndex } = this.props

    // 看了ta的人还看了 点击打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        profileid: this.props.uid,
        watchedid: uid,
        ...this.props.trackParam,
      }
      const key = 'jobs_pc_talent_click_profile_watched_others'
      window.voyager.trackEvent(key, key, param)
    }

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
    const { name, avatar, uid } = item
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

  render() {
    const { data = [] } = this.props
    return (
      <div className={styles.alsoWatchs}>
        <div className={styles.bigTitle}>看了ta的人还看了</div>
        {data.map((item) => {
          return (
            <div
              key={`${item.name}${item.ud}`}
              className={styles.alsoWatchsItem}
            >
              {this.renderAvatar(item)}
              {this.renderMiddleArea(item)}
            </div>
          )
        })}
      </div>
    )
  }
}
