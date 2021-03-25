import React from 'react'

import styles from './index.less'

export default function Loading() {
  return (
    <span className={styles.loading}>
      <span className={`${styles.line} ${styles.line1}`} />
      <span className={`${styles.line} ${styles.line2}`} />
      <span className={`${styles.line} ${styles.line3}`} />
    </span>
  )
}
