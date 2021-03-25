import React, { memo } from 'react'
import * as R from 'ramda'
import styles from './GroupItem.less'

export default memo(({ data }) => {
  const personalGroup = R.propOr([], 'personal', data)
  const enterpriseGroup = R.propOr([], 'enterprise', data)
  return (
    <div className={styles.itemCon}>
      <div className={styles.intentionsItem}>
        {enterpriseGroup.length > 0 && (
          <div
            style={{
              paddingBottom: '20px',
            }}
          >
            <div className={`${styles.subTitle}`}>企业人才库分组</div>
            <span className={styles.groupItem}>
              {enterpriseGroup.join('，')}
            </span>
          </div>
        )}
        {personalGroup.length > 0 && (
          <div>
            <div className={`${styles.subTitle}`}>个人人才库分组</div>
            <span className={styles.groupItem}>{personalGroup.join('，')}</span>
          </div>
        )}
      </div>
    </div>
  )
})
