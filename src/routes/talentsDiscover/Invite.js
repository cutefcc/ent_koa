import React from 'react'
import styles from './invite.less'

export default function TalentPool() {
  return (
    <div className={styles.main}>
      <div className={styles.iframe}>
        <iframe
          frameBorder="0"
          seamless
          src="https://maimai.cn/zp/invite"
          style={{ flex: 1 }}
          title="stat"
          id="stat"
        />
      </div>
    </div>
  )
}
