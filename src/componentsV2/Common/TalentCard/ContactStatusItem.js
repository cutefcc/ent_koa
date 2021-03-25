import React, { memo } from 'react'
import * as R from 'ramda'
import Avatar from 'componentsV2/Common/Avatar'
// import {Icon} from 'mm-ent-ui'
// import {Button} from 'antd'
import styles from './ContactStatusItem.less'

const bigAvatarStyle = {
  width: '40px',
  height: '40px',
  fontSize: '22px',
  lineHeight: '40px',
  borderRadius: '20px',
  cursor: 'pointer',
}
export default memo(({ data }) => {
  const { contact_status: contactStatus = [] } = data
  return (
    <div className={styles.commonFriends}>
      {contactStatus.map((item, index) => {
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.name}${index}`}
            className={`flex ${styles.talentItem}`}
          >
            <Avatar
              avatar={item.avatar}
              name={R.propOr('保密', 'name', item)}
              style={bigAvatarStyle}
              key="avatar"
            />
            <div className={styles.right}>
              <div className="margin-left-16">
                <span className={`${styles.name} color-common`}>
                  {item.name}
                </span>
              </div>
              <div
                className={`${styles.bottom} flex space-between margin-left-16 flex-1`}
              >
                <span className={`${styles.time} color-dilution`}>
                  {`${item.time}·${item.text}`}
                </span>
                <span className={styles.status}>{item.status}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
