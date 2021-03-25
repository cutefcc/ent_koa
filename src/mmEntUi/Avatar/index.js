import React from 'react'
import * as R from 'ramda'
import MemberBadge from './../MemberBadge'
import styles from './index.less'

function Avatar(props) {
  const {
    size = '40px',
    src,
    name = '',
    shape = 'circle',
    alt = 'U',
    style = {},
    showMemBadge = false,
    memId = 0,
    className: initClass = '',
    ...otherProps
  } = props
  const shapeClass = styles[`shape_${shape}`]
  const sizeInt = parseInt(size, 10)
  const sizeStr = `${sizeInt}px`

  const imgStyle = {
    width: sizeStr,
    height: sizeStr,
    lineHeight: sizeStr,
    fontSize: `${Math.max(sizeInt / 2, 14)}px`,
    ...style,
  }
  const className = `${shapeClass} ${styles.avatar}`

  const img = src ? (
    <img src={src} alt={alt} className={`${className}`} style={imgStyle} />
  ) : (
    <span className={`${className}`} style={imgStyle}>
      {R.slice(-1, 100, name) || 'U'}
    </span>
  )

  return showMemBadge && memId > 0 ? (
    <div
      className={`${styles.showMemberBadge} mm-avatar ${initClass}`}
      style={{ height: sizeStr, width: sizeStr }}
      {...otherProps}
    >
      {img}
      <span className={styles.memberBadge}>
        <MemberBadge memId={memId} className={styles.memberBadgeIcon} />
      </span>
    </div>
  ) : (
    <div
      className={`mm-avatar ${initClass}`}
      style={{ display: 'inline-block', height: sizeStr, width: sizeStr }}
      {...otherProps}
    >
      {img}
    </div>
  )
}

export default Avatar
