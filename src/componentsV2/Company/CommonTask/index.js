import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Text } from 'mm-ent-ui'
import { Avatar, Button } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import TaskCard from 'componentsV2/Company/TaskCard'
import GoldenToolTip from 'componentsV2/Company/TimeLimitedTask/goldenTooltip'
import styles from './index.less'

const CommonTask = withRouter(({ taskData, history }) => {
  const { c_count = 0, clogos = [], task_list = [] } = taskData

  const goTaskCenter = () => {
    history.push('/ent/v2/company/taskCenter')
  }

  if (task_list.length === 0) {
    return null
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <Text type="title" size={16}>
            完成企业号任务，赢取积分奖励🔥
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

        <div className={styles.ruleInfo}>
          <Button
            type="link"
            style={{ color: '#6E727A', padding: 0 }}
            onClick={goTaskCenter}
          >
            查看全部任务
          </Button>
        </div>
      </div>
      <div className={styles.main}>
        {task_list.map((item) => (
          <TaskCard key={item.task_name} data={item} />
        ))}
      </div>
    </div>
  )
})

export default connect((state, dispatch) => ({
  taskData: state.company.taskData,
  currentUser: state.global.currentUser,
  config: state.global.config,
  dispatch,
}))(CommonTask)
