import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TaskHeader from './TaskHeader'
import TaskPanel from './TaskPanel'
import PointsMall from './PointsMall'
import styles from './index.less'

const TaskCenter = withRouter(() => {
  return (
    <div className={styles.taskCenter}>
      <TaskHeader />
      <TaskPanel />
      <PointsMall />
    </div>
  )
})

export default connect((state) => ({
  auth: state.global.auth,
  currentUser: state.global.currentUser,
}))(TaskCenter)
