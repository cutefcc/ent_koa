import React, { memo } from 'react'
import styles from './CompanyFans.less'

/** 企业粉丝 popover */
export default memo(({ data }) => {
  const { title = '', time = '' } = data
  return (
    <div className={styles.itemCon}>
      <div className={styles.fansItem}>
        <div className={styles.fansTop}>
          <div className={styles.fansLeft}>{title}</div>
          <div className={styles.fansRight}>{time}</div>
        </div>
      </div>
    </div>
  )
})
