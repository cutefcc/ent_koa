import React, { memo } from 'react'
import * as R from 'ramda'
import styles from './IntentionsItem.less'

/** 有过意向 */
export default memo(({ data }) => {
  const intentions = R.propOr([], 'intentions', data)
  const len = intentions.length
  return (
    <div className={styles.itemCon}>
      {len > 0 &&
        intentions.map((item, index) => {
          const { sub_title: subTitle, title, time } = item
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`${subTitle}${index}`}
              className={`${styles.intentionsItem} ${
                len === index + 1
                  ? styles.intentionsItemLast
                  : styles.intentionsItemNoLast
              }`}
            >
              <div className={styles.intentionsTop}>
                <div className={styles.intentionsLeft}>{title}</div>
                <div className={styles.intentionsRight}>{time}</div>
              </div>
              {subTitle && (
                <div className={styles.intentionsBottom}>{subTitle}</div>
              )}
            </div>
          )
        })}
    </div>
  )
})
