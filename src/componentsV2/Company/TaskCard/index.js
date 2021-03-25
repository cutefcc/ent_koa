import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { MUIButton } from 'mm-ent-ui'
import { trackEvent } from 'utils'
import styles from './index.less'

const TaskCard = withRouter(({ history, data }) => {
  const {
    icon_type = 1,
    task_name,
    points,
    url,
    btn_desc,
    total_count,
    completed_count,
  } = data || {}
  const iconTypeMap = {
    1: 'https://i9.taou.com/maimai/p/25764/1310_53_31ncukWTf8DD9n5d',
    2: 'https://i9.taou.com/maimai/p/25764/1312_53_51ejSquzd0lAX3xN',
    3: 'https://i9.taou.com/maimai/p/25764/1311_53_41jRbjIyeBu4ymjL',
    4: 'https://i9.taou.com/maimai/p/25764/1313_53_61aYzegqctdCmNLZ',
  }

  useEffect(() => {
    trackEvent('bprofile_task_center', {
      target_type: 'show',
      card_type: 'task',
      card_name: task_name,
    })
  }, [])

  const handleClick = () => {
    trackEvent('bprofile_task_center', {
      target_type: 'click',
      card_type: 'task',
      card_name: task_name,
    })
    history.push(url.split('https://maimai.cn')[1])
  }

  return (
    <div className={styles.taskCardWrap}>
      <img alt="empty" src={iconTypeMap[icon_type]} />
      <div className={styles.taskMain}>
        <p>{task_name}</p>
        <p>
          <span>积分+{points}</span>
          <span>
            完成{completed_count}/{total_count}
          </span>
        </p>
      </div>
      <MUIButton
        disabled={completed_count >= total_count}
        type="mbutton_m_fixed_blue450_l1"
        onClick={handleClick}
      >
        {completed_count >= total_count ? '已完成' : btn_desc}
      </MUIButton>
    </div>
  )
})

export default TaskCard
