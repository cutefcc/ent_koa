import React, { useState, useEffect, useRef } from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Avatar } from 'mm-ent-ui'
import { getMMTimeStr } from 'utils/date'
import { retreiveNewStacks } from 'utils/stacks'
import styles from './index.less'

const Desc = ({ desc }) => {
  const [isNeedExpand, setIsNeedExpand] = useState(false) // 是否需要展开，默认没有超过
  const [isExpand, setIsExpand] = useState(false) // 在isNeedExpand===true的情况，默认初始为不展开状态
  const descriptionRef = useRef()
  useEffect(() => {
    if (descriptionRef.current.scrollHeight > 100 && !isNeedExpand) {
      setIsNeedExpand(true)
    }
    return () => {}
  }, [isExpand])

  return (
    <div
      ref={descriptionRef}
      className={isExpand ? styles.descExpanded : styles.descNoExpand}
    >
      {desc}
      {isNeedExpand && !isExpand && (
        <div
          onClick={() => {
            setIsExpand(true)
          }}
          className={styles.expandBtn}
        >
          展开
        </div>
      )}
    </div>
  )
}

@connect((state) => ({
  uids: state.profile.uids,
  currentIndex: state.profile.currentIndex,
  config: state.global.config,
}))
export default class RemarksItem extends React.PureComponent {
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
    const time = getMMTimeStr(item.remark_time)
    return (
      <div className={`${styles.middleArea}`}>
        <div className={`${styles.name}`} title={item.name}>
          {item.name}
        </div>
        <div className={`${styles.desc}`} title={time}>
          {time}
        </div>
      </div>
    )
  }

  render() {
    const {
      data = [],
      config: { remark_node },
    } = this.props
    const remarkNodeMapArr = [{ value: 0, label: '' }].concat(remark_node)
    if (data.length === 0) return null
    return (
      <div className={styles.remarksCon}>
        {data.map((item, index) => {
          let { label } = remarkNodeMapArr.find((it) => it.value === item.node)
          label = label ? `${label}：${item.content}` : item.content
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`${item.name}${index}`} className={styles.remarksItem}>
              {this.renderAvatar(item)}
              <div className={styles.right}>
                {this.renderMiddleArea(item)}
                <Desc desc={label} />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
