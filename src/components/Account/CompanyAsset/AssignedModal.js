import React from 'react'
import PropTypes from 'prop-types'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, InputNumber, Button, message } from 'antd'

import styles from './assignedModal.less'

@Form.create()
export default class AssignedModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { item, balance } = props

    this.state = {
      left: item.balance,
      balance,
      leftAfterAssigned: item.balance,
      op: props.type === 'assign' ? '分配' : '回收',
      num: 0,
    }
  }

  static propTyes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  calValueAfterAssigned = (value) => {
    const { type } = this.props
    const { left } = this.state
    return type === 'assign' ? left + Number(value) : left - Number(value)
  }

  calInputMax = () =>
    this.props.type === 'assign' ? this.state.balance : this.state.left

  handleSubmit = () => {
    if (!this.state.num) {
      message.warning(`${this.state.op}资源不能为空或者0`)
      return
    }
    this.props.onSubmit(this.state.num)
  }

  handleSetValueAfterAssigned = (value) => {
    const v = value.target ? value.target.value : value
    this.setState({
      leftAfterAssigned: this.calValueAfterAssigned(v),
      num: v,
    })
  }

  render() {
    const { type, item, visible } = this.props
    const { leftAfterAssigned, op } = this.state
    const title =
      type === 'assign'
        ? `为 ${item.sub_uname} 分配资源`
        : `回收 ${item.sub_uname} 的资源`
    const max = this.calInputMax()
    return (
      <Modal
        title={title}
        onCancel={this.props.onCancel}
        className={styles.modal}
        visible={visible}
        width={600}
        maskClosable={false}
        footer={[
          <Button
            className={styles.button}
            key="submit"
            type="primary"
            onClick={this.handleSubmit}
          >
            {`确定${this.state.op}资源`}
          </Button>,
        ]}
      >
        <span className={styles.inputPanel}>
          {op}点数：
          <InputNumber
            placeholder={`整数 最大可${op}${max}`}
            type="number"
            min={0}
            max={max}
            onChange={this.handleSetValueAfterAssigned}
            onBlur={this.handleSetValueAfterAssigned}
            precision={0}
            width={200}
            // value={this.state.num}
          />
        </span>
        <span className={styles.leftValuePanel}>
          {op}后余量：{leftAfterAssigned}
        </span>
      </Modal>
    )
  }
}
