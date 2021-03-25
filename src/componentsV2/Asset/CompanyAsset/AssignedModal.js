import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, InputNumber, message } from 'antd'
import { Button } from 'mm-ent-ui'
import styles from './assignedModal.less'

@Form.create()
@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class AssignedModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { item, balance, batch_invite_balance, reach_nbr } = props

    this.state = {
      left: item.balance,
      balance,
      num: 0,

      batch_invite_left: item.batch_invite_balance,
      batch_invite_balance,
      reach_nbr,
      reach_nbr_left: item.reach_nbr,
      batchInviteNum: 0,
      op: props.type === 'assign' ? '分配' : '回收',
      valueError: false,
      inviteError: false,
      reachError: false,
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

  calBatchInviteValueAfterAssigned = (value) => {
    const { type } = this.props
    const { batch_invite_left: left } = this.state
    return type === 'assign' ? left + Number(value) : left - Number(value)
  }

  calInputMax = () =>
    this.props.type === 'assign' ? this.state.balance : this.state.left

  calBatchInviteInputMax = () =>
    this.props.type === 'assign'
      ? this.state.batch_invite_balance
      : this.state.batch_invite_left

  calcReachMax = () =>
    this.props.type === 'assign'
      ? this.state.reach_nbr
      : this.state.reach_nbr_left
  handleSubmit = () => {
    const {
      num,
      batchInviteNum,
      numReach,
      valueError,
      inviteError,
      reachError,
    } = this.state
    if (valueError || inviteError || reachError) {
      return
    }
    if (
      parseInt(num || '0', 0) <= 0 &&
      parseInt(batchInviteNum || '0', 0) <= 0 &&
      parseInt(numReach || '0', 0) <= 0
    ) {
      message.warning(`${this.state.op}资源不能为空或者0`)
      return
    }
    this.props.onSubmit(num, batchInviteNum, numReach)
  }

  handleSetValueAfterAssigned = (value) => {
    const v = value && value.target ? value.target.value : value
    const max = this.calInputMax()
    this.setState({
      num: v,
      valueError: v > max,
    })
  }

  handlebatchInviteSetValueAfterAssigned = (value) => {
    const v = value && value.target ? value.target.value : value
    const batchInviteMax = this.calBatchInviteInputMax()
    this.setState({
      batchInviteNum: v,
      inviteError: v > batchInviteMax,
    })
  }

  handleNumberReachSetValueAfterAssigned = (value) => {
    const v = value && value.target ? value.target.value : value
    const reachNum = this.calcReachMax()
    this.setState({
      numReach: v,
      reachError: v > reachNum,
    })
  }

  renderReachElement = (value) => {
    const {
      currentUser: { reach },
    } = this.props
    const { op, reachError } = this.state

    if (reach && reach.reach_type === 3) {
      return (
        <div className={styles.oneLine} style={{ marginTop: 20 }}>
          <p className={styles.title}>电话沟通券</p>
          <span className={styles.inputPanel}>
            <InputNumber
              placeholder={`请输入${op}额度`}
              type="number"
              min={0}
              max={value}
              onChange={this.handleNumberReachSetValueAfterAssigned}
              onBlur={this.handleNumberReachSetValueAfterAssigned}
              precision={0}
              width={184}
            />
          </span>
          <p className={styles.leftValuePanel}>
            {reachError && <span className={styles.error}>余额不足</span>}
            {!reachError && `最多可${op}${value}次`}
            {/* {op}后余量：{batchInviteLeftAfterAssigned} */}
          </p>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const { type, item, visible } = this.props
    const {
      op,
      valueError,
      inviteError,
      reachError,
      num,
      batchInviteNum,
      numReach,
    } = this.state
    const title =
      type === 'assign'
        ? `为 ${item.sub_uname} 分配资源`
        : `回收 ${item.sub_uname} 的资源`
    const max = this.calInputMax()
    const batchInviteMax = this.calBatchInviteInputMax()
    const reachNum = this.calcReachMax()
    const disableSubmit =
      (!num && !batchInviteNum && !numReach) ||
      valueError ||
      inviteError ||
      reachError
    const footer = (
      <div className={styles.footer}>
        <Button key="cancel" type="default" onClick={this.props.onCancel}>
          取 消
        </Button>
        <Button
          type="primary"
          onClick={this.handleSubmit}
          key="submit"
          disabled={disableSubmit}
        >
          确 定
        </Button>
      </div>
    )
    return (
      <Modal
        title={title}
        onCancel={this.props.onCancel}
        className={styles.assignedModal}
        visible={visible}
        width={480}
        maskClosable={false}
        footer={footer}
      >
        <div className={`${styles.oneLine} ${styles.rightBorder}`}>
          <p className={styles.title}>点数</p>
          <span className={styles.inputPanel}>
            <InputNumber
              placeholder={`请输入${op}额度`}
              type="number"
              min={0}
              max={max}
              onChange={this.handleSetValueAfterAssigned}
              onBlur={this.handleSetValueAfterAssigned}
              precision={0}
              width={184}
            />
          </span>
          <p className={styles.leftValuePanel}>
            {valueError && <span className={styles.error}>余额不足</span>}
            {!valueError && `最多可${op}${max}点`}
            {/* {op}后余量：{leftAfterAssigned} */}
          </p>
        </div>
        <div className={styles.oneLine}>
          <p className={styles.title}>智能邀约</p>
          <span className={styles.inputPanel}>
            <InputNumber
              placeholder={`请输入${op}额度`}
              type="number"
              min={0}
              max={batchInviteMax}
              onChange={this.handlebatchInviteSetValueAfterAssigned}
              onBlur={this.handlebatchInviteSetValueAfterAssigned}
              precision={0}
              width={184}
            />
          </span>
          <p className={styles.leftValuePanel}>
            {inviteError && <span className={styles.error}>余额不足</span>}
            {!inviteError && `最多可${op}${batchInviteMax}次`}
            {/* {op}后余量：{batchInviteLeftAfterAssigned} */}
          </p>
        </div>
        {this.renderReachElement(reachNum)}
      </Modal>
    )
  }
}
