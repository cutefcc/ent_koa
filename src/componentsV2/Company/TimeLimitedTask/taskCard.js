import React from 'react'
import styles from './index.less'

function TaskCard({ dateString, data, mode, fans, complete, onClickCard }) {
  const { time_interval, count = 0, status = 0 } = data || {}
  const statusText = {
    0: '未完成',
    1: '未开始',
    2: '进行中 🔥',
    3: '已完成',
  }

  const onClick = () => {
    if (status === 2) {
      onClickCard()
    }
  }

  return (
    <div
      className={`${styles.taskCardWrap} ${styles[`taskCardWrap${status}`]} ${
        styles[`taskCardWrap${complete ? 'Done' : ''}`]
      }`}
      onClick={onClick}
    >
      <div className="task-card">
        {mode === 'total' ? (
          <p>{`累计完成三次任务 ${count}/3`}</p>
        ) : (
          <p>{`发布企业动态 ${count}/1`}</p>
        )}
        <span className="add-fans">{`+${fans || 100}粉丝`}</span>
      </div>
      <div className="task-footer">
        <span>{`${time_interval || dateString} `}</span>
        {!mode && <span>{statusText[status]}</span>}
      </div>
    </div>
  )
}

export default TaskCard
