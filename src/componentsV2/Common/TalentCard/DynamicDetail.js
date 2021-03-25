import React, { memo } from 'react'
import * as R from 'ramda'
import styles from './DynamicDetail.less'

export default memo(({ data }) => {
  const list = R.propOr([], 'list', data)

  // 是否显示求职偏好
  return list.map((item) => {
    const { describe, uptime } = item
    return (
      <div className={styles.dynamicDetail}>
        <div>{describe}</div>
        <div className={styles.date}>{uptime}</div>
      </div>
    )
  })
})
