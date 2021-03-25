import React from 'react'
import { connect } from 'react-redux'
import { Text } from 'mm-ent-ui'
import { Avatar, Button, Tooltip, Divider } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import GoldenToolTip from './goldenTooltip'
import TaskCard from './taskCard'
import styles from './index.less'

function TimeLimitedTask({ taskData, onClickCard }) {
  const { c_count = 0, week_info = {}, clogos = [] } = taskData

  const weekInfos = [
    {
      key: 'w1',
      dateString: '09.28-10.04',
      data: week_info.w1,
    },
    {
      key: 'w2',
      dateString: '10.05-10.11',
      data: week_info.w2,
    },
    {
      key: 'w3',
      dateString: '10.12-10.18',
      data: week_info.w3,
    },
    {
      key: 'w4',
      dateString: '10.19-10.25',
      data: week_info.w4,
    },
    {
      key: 'w5',
      dateString: '10.26-11.01',
      data: week_info.w5,
    },
  ]

  const renderRules = () => (
    <div className={styles.rules}>
      <p>活动规则：</p>
      <p>1.本周任务完成后，将会在次周进行粉丝邀约。</p>
      <p>2.累计任务完成后，将会在活动结束的次周进行粉丝邀约。</p>
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <Text type="title" size={16}>
            限时任务
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
          {c_count > 2 && (
            <GoldenToolTip title={`${c_count}位雇主正在参加活动!`} />
          )}
        </div>

        <div className={styles.ruleInfo}>
          <span className={styles.headerInfo}>
            完成全部任务最高触达30w目标人才获得800+中高端粉丝
          </span>
          <Divider type="vertical" />
          <Tooltip placement="topRight" title={renderRules}>
            <Button type="link" style={{ color: '#50679A', padding: 0 }}>
              活动规则
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.processTask}>
          {weekInfos.map((item) => (
            <TaskCard key={item.key} {...item} onClickCard={onClickCard} />
          ))}
        </div>
        <Divider className={styles.mainDivider} type="vertical" />
        <TaskCard
          mode="total"
          dateString="特殊奖励-仅限本期活动"
          fans={300}
          data={{ count: week_info.total, status: 4 }}
          complete={week_info.total > 2}
        />
      </div>
    </div>
  )
}

export default connect((state, dispatch) => ({
  taskData: state.company.taskData,
  currentUser: state.global.currentUser,
  config: state.global.config,
  dispatch,
}))(TimeLimitedTask)
