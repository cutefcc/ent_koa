import React from 'react'
import * as R from 'ramda'
import MemberBadge from './../MemberBadge'
import MMIcon from './../Icon'
import styles from './index.less'

function MUIAvatar(props) {
  const {
    size = '40px',
    src,
    shape = 'circle',
    alt = 'U',
    style = {},
    showMemBadge = false,
    memId = 0,
    className: initClass = '',
    str = '',
    iconType = '',
    ...otherProps
  } = props
  const shapeClass = styles[`shape_${shape}`]
  const sizeInt = parseInt(size, 10)
  const sizeStr = `${sizeInt}px`

  const imgStyle = {
    display: 'inline-block',
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
      {str || (iconType ? <MMIcon type={iconType} /> : 'U')}
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
      className={`mm-avatar ${initClass} ${className}`}
      style={{
        display: 'inline-block',
        height: sizeStr,
        width: sizeStr,
        ...style,
      }}
      {...otherProps}
    >
      {img}
    </div>
  )
}

export default MUIAvatar
