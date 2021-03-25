import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Text, Icon, Avatar } from 'mm-ent-ui'
import * as styles from './index.less'

function MoreCare(props) {
  const { dispatch, state } = props
  const [list, setList] = useState([])
  const fetchCareList = () => {
    dispatch({
      type: 'talentDiscover/fetchCareList',
      payload: {
        uid: window.uid,
        module_type: 1,
      },
    }).then((data) => {
      const { code, data: { talents = [] } = {} } = data
      if (code === 0) {
        setList(talents)
      }
    })
  }

  const handleGoGroups = () => {
    window.open(
      `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ''
      }/ent/v3/index/groups?type=special_attention&currentTab=dynamic`
    )
  }

  useEffect(() => {
    fetchCareList()
  }, [])

  const renderList = (item, index) => {
    return (
      <div
        key={`${item.content}${index}`}
        className={`${styles.cardItem} flex`}
      >
        <Avatar shape="circle" size="48px" src={item.avatar} />
        <div className={`${styles.right}`}>
          <div className={`${styles.content}`} title={item.content}>
            {item.content}
            {item.judge === 1 && (
              <Icon type="v" key="v" className={`${styles.vIcon}`} />
            )}
          </div>
          <div className={`${styles.dynamic}`} title={item.recent_dynamic}>
            {item.recent_dynamic}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.moreCare}`} onClick={handleGoGroups}>
      <div className={`${styles.title} flex`}>
        <Text type="title" size={16}>
          特别关注
        </Text>
        <Icon type="icon_arrow_down" className={`${styles.downIcon}`} />
      </div>
      {R.pathOr(0, ['length'], list) > 0 && list.map(renderList)}
      {R.pathOr(0, ['length'], list) === 0 && (
        <div className={`${styles.blank}`}>
          <Text
            type="text_common"
            size={14}
            style={{ color: '#999', marginBottom: '16px' }}
          >
            暂无动态
          </Text>
        </div>
      )}
    </div>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
  }))(MoreCare)
)
