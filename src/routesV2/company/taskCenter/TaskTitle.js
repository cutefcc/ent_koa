import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Avatar } from 'antd'
import { Text } from 'mm-ent-ui'
import { EllipsisOutlined } from '@ant-design/icons'
import GoldenToolTip from 'componentsV2/Company/TimeLimitedTask/goldenTooltip'
import styles from './index.less'

const TaskTitle = withRouter(({ title = '限时任务', cData }) => {
  const { c_count = 0, clogos = [] } = cData
  return (
    <div className={styles.taskTitle}>
      <div className={styles.headerMain}>
        <Text type="title" size={16}>
          {title}
        </Text>
        {c_count > 2 && (
          <div className={styles.clogos}>
            <Avatar.Group size={24}>
              {clogos.map((logo) => (
                <Avatar shape="square" key={logo} size={24} src={logo} />
              ))}
              {c_count > 4 ? (
                <Avatar
                  shape="square"
                  size={24}
                  style={{
                    background: '#e6ecff',
                    fontSize: 20,
                    color: '#3375ff',
                  }}
                  icon={<EllipsisOutlined />}
                />
              ) : null}
            </Avatar.Group>
          </div>
        )}
        {c_count > 2 && <GoldenToolTip title={`${c_count}位雇主完成任务!`} />}
      </div>
    </div>
  )
})

export default connect((state) => ({
  auth: state.global.auth,
  totalPoints: state.companyTask.totalPoints,
  currentUser: state.global.currentUser,
}))(TaskTitle)
