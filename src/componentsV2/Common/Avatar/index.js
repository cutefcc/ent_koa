import React from 'react'
import classnames from 'classnames'

import styles from './index.less'

export default function (props) {
  const { name, avatar, style, blur = false, ...res } = props

  if (!avatar) {
    return (
      <span style={style} className={styles.defaultAvatar} {...res}>
        {name.split('').pop() || 'U'}
      </span>
    )
  }
  return (
    <img
      style={style}
      src={avatar}
      alt=""
      className={classnames({
        [styles.avatar]: true,
        [styles.blur]: blur,
      })}
      {...res}
    />
  )
}
