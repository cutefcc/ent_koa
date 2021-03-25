import React, { useState, useEffect } from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as styles from './index.less'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'

function JobEffect(props) {
  const { dispatch } = props
  const [jobEffectItem, setJobEffectItem] = useState([
    {
      name: '在招职位',
      jumpUrl: '/ent/v2/job/positions',
      num: 0,
      badge: '',
    },
    {
      name: '待处理简历',
      jumpUrl: '/ent/v2/job/resumes',
      num: 0,
      badge: '',
      initBadge: '',
    },
    {
      name: '可以聊',
      jumpUrl: '/ent/v2/job/recommend?tab=canchat',
      num: 0,
      badge: '',
      initBadge: '',
    },
    {
      name: '职位访客',
      jumpUrl: '/ent/v2/job/recommend?tab=visitor',
      num: 0,
      badge: 'new',
      initBadge: 'new',
    },
  ])
  const handleItemClick = (index) => () => {
    // 前端消badge
    if ([1, 2, 3].includes(index)) {
      jobEffectItem[index].badge =
        index === 3 ? '' : jobEffectItem[index].initBadge
      setJobEffectItem([...jobEffectItem])
    }
    window.open(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ''
      }${jobEffectItem[index].jumpUrl}`
    )
  }
  const dataConversion = (data) => {
    data =
      parseInt(data) >= 10000
        ? `${Math.floor(data / 10000)}.${Math.floor((data % 10000) / 1000)}万`
        : data
    return data
  }
  const renderJobEffectItems = (item, index) => {
    let badge = ''
    if (item.badge === 'new') {
      badge = 'new'
    } else {
      badge = dataConversion(item.badge)
      badge = item.badge > 0 ? `+${badge}` : ''
    }
    return (
      <div key={item.name} className={`${styles.jobEffectItem} flex`}>
        <div className={styles.text} onClick={handleItemClick(index)}>
          {item.name}
        </div>
        <span className={styles.num} onClick={handleItemClick(index)}>
          {dataConversion(item.num)}
          <span className={styles.badge}>{badge}</span>
        </span>
      </div>
    )
  }

  const getRecruiterBadge = () => {
    dispatch({
      type: 'talentDiscover/recruiterBadge',
      payload: {},
    }).then((data = {}) => {
      ;({
        open_jd_cnt: jobEffectItem[0].num,
        resume_need_deal_cnt: jobEffectItem[1].num,
        resume_unread_cnt: jobEffectItem[1].badge,
        accept_job_vcall_total: jobEffectItem[2].num,
        accept_job_vcall_badge: jobEffectItem[2].badge,
        job_visitors_total: jobEffectItem[3].num,
      } = data)
      // jobEffectItem[1].badge = 0
      // jobEffectItem[2].badge = 0
      jobEffectItem[3].badge = data.job_visitors_dot === 1 ? 'new' : ''
      setJobEffectItem([...jobEffectItem])
    })
  }

  useEffect(() => {
    hotPicPing()
    getRecruiterBadge()
    return () => {
      removeHotPicPing()
    }
  }, [])

  return (
    <div className={`${styles.JobEffect}`}>
      <div className={`${styles.top} flex`}>
        <div className={styles.l}>岗位效果</div>
        <div
          className={styles.r}
          onClick={() => {
            window.open(
              `${window.location.protocol}//${window.location.hostname}${
                window.location.port ? `:${window.location.port}` : ''
              }/ent/v2/job/positions/publish`
            )
          }}
        >
          发布职位
        </div>
      </div>
      <div className={`${styles.bottom} flex`}>
        {jobEffectItem[0].num !== 0 && jobEffectItem.map(renderJobEffectItems)}
        {jobEffectItem[0].num === 0 && (
          <div className={styles.noContent}>暂无在招岗位</div>
        )}
      </div>
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
  }))(JobEffect)
)
