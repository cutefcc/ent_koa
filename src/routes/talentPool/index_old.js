import React from 'react'
import styles from './index_old.less'

export default function TalentPool() {
  return (
    <div className={styles.main}>
      <div className={styles.iframe}>
        <iframe
          frameBorder="0"
          seamless
          src="https://maimai.cn/zp/talent?type=2"
          style={{ flex: 1 }}
          title="job_man"
          id="job_man"
        />
      </div>
    </div>
  )
}
