import React, { memo } from 'react'
// import * as R from 'ramda'
import Avatar from 'componentsV2/Common/Avatar'
import styles from './ColleagueBrowse.less'

function renderAvatar(item) {
  const { avatar = '', name = '' } = item
  const style = {
    width: '40px',
    height: '40px',
    fontSize: '24px',
    lineHeight: '40px',
    borderRadius: '20px',
  }

  return <Avatar avatar={avatar} name={name} style={style} />
}

export default memo(({ data }) => {
  const { list = [] } = data
  return (
    <div className={styles.commonFriends}>
      {list.map((item, index) => {
        return (
          <div
            key={item.name}
            className={`${index === 0 ? '' : 'margin-top-16'} flex`}
          >
            {renderAvatar(item)}
            <span className="flex-column space-between margin-left-24">
              <span className={`${styles.name} font-size-14`}>{item.name}</span>
              <span className={`${styles.visitTime} font-size-14`}>
                {item.visit_time}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
})
