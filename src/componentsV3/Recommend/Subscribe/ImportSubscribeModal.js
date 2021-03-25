/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Popconfirm, Checkbox } from 'antd'
import { Message } from 'mm-ent-ui'
import styles from './importSubscribeModal.less'

function ImportSubscribeModal({
  subscribeList,
  onSubmit,
  onCancel,
  subscribeMaxCount,
}) {
  const [checked, setChecked] = useState([])
  const handleCheck = (id) => {
    const index = checked.indexOf(id)
    if (index >= 0) {
      checked.splice(index, 1)
    } else {
      if (checked.length >= subscribeMaxCount) {
        Message.warn('可选择数量已达上限')
        return
      }
      checked.push(id)
    }

    setChecked([...checked])
  }

  const renderContent = () => {
    const content = subscribeList.map((subscribe) => {
      const { positions, query, companys, id } = subscribe
      const title =
        subscribe.title.trim() ||
        [positions, query, companys].filter((item) => !!item).join('/')

      return (
        <div className={styles.subscribe} key={id}>
          <Checkbox
            checked={checked.includes(id)}
            onChange={handleCheck.bind(this, id)}
            className={styles.checkbox}
          >
            {title}
          </Checkbox>
        </div>
      )
    })

    return (
      <div>
        <div className={styles.warmTips}>
          请选择订阅项进行数据导入，已选择{checked.length}/{subscribeMaxCount}个
        </div>
        <div className={styles.subscribeList}>{content}</div>
      </div>
    )
  }

  const renderButton = () => {
    const title = checked.length
      ? `已选择${checked.length}个订阅项`
      : '当前没选择任何订阅项'
    const content = checked.length
      ? '确定后，未选择的订阅项将被清除'
      : '确定后，原所有订阅项将被清除'
    const titleEle = (
      <div>
        <div className={styles.popTitle}>{title}</div>
        <div className={styles.popContent}>{content}</div>
      </div>
    )
    return (
      <Popconfirm
        placement="topRight"
        title={titleEle}
        onConfirm={() => onSubmit(checked)}
      >
        <Button type="primary">确定</Button>
      </Popconfirm>
    )
  }

  return (
    <Modal
      title={'人才订阅功能升级'}
      width={560}
      visible
      closable={false}
      maskClosable={false}
      footer={
        <div className={styles.modalFooter}>
          <div className={styles.left} />
          <div>{renderButton()}</div>
        </div>
      }
      className={styles.commonFormModal}
      onCancel={onCancel}
    >
      {renderContent()}
    </Modal>
  )
}

export default connect((state) => ({
  subscribeList: state.homeSubscribe.subscribeList,
}))(ImportSubscribeModal)
