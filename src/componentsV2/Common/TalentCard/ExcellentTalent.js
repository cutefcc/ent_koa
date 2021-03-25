import React, { memo } from 'react'
import styles from './ExcellentTalent.less'

/** 企业粉丝 popover */
export default memo(({ data }) => {
  const { title = '' } = data
  return (
    <div className={styles.itemWrapper}>
      <div className={styles.item}>
        <div className={styles.top}>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </div>
  )
})
