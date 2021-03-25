import React, { memo } from 'react'
import * as R from 'ramda'
import styles from './CompanyFansV3.less'

export default memo(({ data }) => {
  const list = R.propOr([], 'list', data)
  const getLeftTips = (item) => {
    // 行为类型。1：关注，2：访问，3：点赞，4：评论，5：转发
    const { action_type, count } = item
    if (action_type === 1) {
      return `关注了你公司企业号`
    } else if (action_type === 2) {
      return `访问了你公司企业号动态${count}次`
    } else if (action_type === 3) {
      return `点赞了你公司企业号动态${count}次`
    } else if (action_type === 4) {
      return `评论了你公司企业号动态${count}次`
    } else if (action_type === 5) {
      return `转发了你公司企业号动态${count}次`
    }
    return ``
  }
  return list.map((item, index) => {
    const { action_time } = item
    return (
      <div key={index} className={styles.dynamicDetail}>
        <div>{getLeftTips(item)}</div>
        <div className={styles.date}>{action_time}</div>
      </div>
    )
  })
})
