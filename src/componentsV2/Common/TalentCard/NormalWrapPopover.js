import React, { memo } from 'react'
import { Icon } from 'mm-ent-ui'
import styles from './NormalWrapPopover.less'

/** 静态带标题容器 */
export default (Content) =>
  memo(({ data, bigTitle = '', icon = {} }) => {
    const { type, style = {} } = icon
    return (
      <div className={styles.popoverContainer}>
        <div
          className={`${styles.titleWrapper} flex flex-justify-start flex-align-center`}
        >
          {type && <Icon type={type} className={styles.icon} style={style} />}
          {bigTitle && <div className={styles.bigTitle}>{bigTitle}</div>}
        </div>
        <div className={styles.content}>
          <Content data={data} />
        </div>
      </div>
    )
  })
