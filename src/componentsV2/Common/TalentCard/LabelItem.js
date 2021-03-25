import React, { memo } from 'react'
import styles from './LabelItem.less'

/** 标签 */
export default memo(({ data }) => {
  return <div className={styles.itemCon}>{data}</div>
})
