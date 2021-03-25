import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import TaskCard from 'componentsV2/Company/TaskCard'
import TaskTitle from './TaskTitle'
import styles from './index.less'

const TaskPanel = withRouter(({ bprofileUser, taskData, dispatch }) => {
  const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
  const fetchData = () => {
    webcid &&
      dispatch({
        type: 'companyTask/fetchTaskData',
        payload: {
          webcid,
        },
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { novice_tasks, weekly_tasks, continuous_tasks } = taskData
  return (
    <div className={styles.taskPanel}>
      {novice_tasks && (
        <div>
          <TaskTitle
            title="新手任务，带你快速上手企业号"
            cData={novice_tasks}
          />
          {novice_tasks.task_info.map((item) => (
            <TaskCard key={item.task_name} data={item} />
          ))}
        </div>
      )}
      {weekly_tasks && (
        <div>
          <TaskTitle title="每周任务" cData={weekly_tasks} />
          {weekly_tasks.task_info.map((item) => (
            <TaskCard key={item.task_name} data={item} />
          ))}
        </div>
      )}
      {continuous_tasks && (
        <div>
          <TaskTitle title="连续任务" cData={continuous_tasks} />
          {continuous_tasks.task_info.map((item) => (
            <TaskCard key={item.task_name} data={item} />
          ))}
        </div>
      )}
    </div>
  )
})

export default connect((state, dispatch) => ({
  auth: state.global.auth,
  taskData: state.companyTask.taskData,
  bprofileUser: state.global.bprofileUser,
  dispatch,
}))(TaskPanel)
