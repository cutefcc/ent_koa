import React from 'react'

import styles from './positions.less'

export default function (props) {
  const { data } = props
  const handleClick = (position) => () => {
    props.onClick(position)
  }
  const renderJob = (job) => (
    <li key={job.jid} className={styles.item}>
      <span onClick={handleClick(job.position)}>{job.position}</span>
    </li>
  )
  return (
    <div className={styles.panel} key="jobSearch">
      <h3 className={styles.title} key="title">
        按 已发布职位 进行搜索{' '}
        <span className={styles.tip}>按职位快速搜索</span>
      </h3>
      <ul className={styles.list} key="jobs">
        {data.map(renderJob)}
      </ul>
    </div>
  )
}
