import React, { memo } from 'react'
import { getMMTimeStr } from 'utils/date'
import styles from './index.less'

/** 人才动态 */
export default memo(({ data }) => {
  return (
    <div className={styles.talentDynamicCon}>
      {data.map((item, index) => {
        const { describe, uptime } = item
        let formatTime = getMMTimeStr(uptime)
        if (formatTime.indexOf('年') !== -1) {
          ;[formatTime] = formatTime.split(' ')
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${index}${item.id}`} className={styles.item}>
            <div className={styles.describe} title={describe}>
              {describe}
            </div>
            <div className={styles.time} title={formatTime}>
              {formatTime}
            </div>
          </div>
        )
      })}
    </div>
  )
})
