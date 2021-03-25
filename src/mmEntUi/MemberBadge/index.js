import React from 'react'
import styles from './index.less'

export default function (props) {
  const { memId, className = '', ...res } = props

  if (memId === 1 || memId === 2) {
    return (
      <span
        className={`${styles.add_huiyuan_img1} ${styles.memberBadge} ${className}`}
        {...res}
      />
    )
  } else if (memId === 3 || memId === 5 || memId === 6) {
    return (
      <span
        className={`${styles.add_huiyuan_img2} ${styles.memberBadge} ${className}`}
        {...res}
      />
    )
  } else if (memId === 4) {
    return (
      <span
        className={`${styles.add_huiyuan_img3} ${styles.memberBadge} ${className}`}
        {...res}
      />
    )
  } else if (memId === 7) {
    return (
      <span
        className={`${styles.add_huiyuan_img4} ${styles.memberBadge} ${className}`}
        {...res}
      />
    )
  }
  return (
    <span
      className={`${styles.add_huiyuan_img} ${styles.memberBadge} ${className}`}
      {...res}
    />
  )
}
