import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Modal } from 'antd'
import { Icon, Text } from 'mm-ent-ui'
import styles from './index.less'

const TaskHeader = withRouter(({ totalPoints }) => {
  const [ruleVisible, setruleVisible] = useState(false)
  return (
    <div className={styles.taskHeader}>
      <div className={styles.myPoint}>
        <Text type="title" size={16}>
          我的积分:
        </Text>
        <Icon type="icon_employer_star" />
        <p>{totalPoints}</p>
      </div>
      <div className={styles.rules}>
        <Button
          onClick={() => {
            setruleVisible(true)
          }}
          type="link"
          style={{ color: '#6E727A', padding: 0 }}
        >
          任务规则
        </Button>
      </div>
      <Modal
        visible={ruleVisible}
        title="任务规则"
        onCancel={() => {
          setruleVisible(false)
        }}
        footer={null}
      >
        <p>
          任务中心全新登场啦！各位雇主能够通过完成相应的任务，来获取积分用于兑换各类奖品。
        </p>
        <span>新手任务</span>
        <p>
          完成任务获得大额积分，您可以通过完成新手任务，帮助各位雇主快速上手运营企业号。全部任务完成后，该板块即会消失。
        </p>
        <span>每周任务</span>
        <p>
          帮助指导雇主更好的运营企业号，每个自然周从周一0点重新计算，只要在当周完成任务，即可获得积分奖励。
        </p>
        <span>连续任务</span>
        <p>
          完成连续任务可获得大额积分奖励，持续坚持既可以更好的做好雇主品牌传播，又可获得更多积分奖励。
        </p>
        <span>积分商城</span>
        <p>
          在您完成任务后，可以获得对应积分，点击选择您想兑换的奖品，成功兑换后将扣除相应的积分。后续还将不定期上线新的奖品内容，敬请期待！
        </p>
        <span>其他说明</span>
        <p>有任何问题欢迎咨询企业号运营小助手或者对应销售。</p>
      </Modal>
    </div>
  )
})

export default connect((state) => ({
  auth: state.global.auth,
  totalPoints: state.companyTask.totalPoints,
  currentUser: state.global.currentUser,
}))(TaskHeader)
