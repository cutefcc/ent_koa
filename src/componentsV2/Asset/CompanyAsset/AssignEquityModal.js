import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, InputNumber, message } from 'antd'
import { Button } from 'mm-ent-ui'
import * as R from 'ramda'
import styles from './assignEquityModal.less'

@Form.create()
@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class AssignEquityModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { item, addfr, uh, direct_oppo, reachNbr } = props
    this.state = {
      leftAddfr: item.addfr || 0,
      leftUh:
        R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6
          ? item.purchase_left || 0
          : item.uh || 0,
      addfr,
      uh,
      direct_oppo,
      reachNbr,
      reachNbrLeft: item.reach_nbr,
      op: props.type === 'assign' ? '分配' : '回收',
      numAddfr: 0,
      numUh: 0,
      numDop: 0,
      addfrError: false,
      uhError: false,
      reachError: false,
    }
  }

  static propTyes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    addfr: PropTypes.number.isRequired,
    uh: PropTypes.number.isRequired,
    direct_oppo: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  calInputAddfrMax = () =>
    this.props.type === 'assign' ? this.state.addfr : this.state.leftAddfr

  calInputUhMax = () => {
    let num = this.state.uh
    if (R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6) {
      num = this.state.direct_oppo
    }
    return this.props.type === 'assign' ? num : this.state.leftUh
  }

  calcReachMax = () =>
    this.props.type === 'assign' ? this.state.reachNbr : this.state.reachNbrLeft

  handleSubmit = () => {
    const {
      numAddfr,
      numDop,
      numUh,
      addfrError,
      uhError,
      reachError,
      numReach,
    } = this.state
    if (addfrError || uhError || reachError) {
      return
    }
    if (
      parseInt(numAddfr || '0', 0) <= 0 &&
      parseInt(numUh || '0', 0) <= 0 &&
      parseInt(numDop || '0', 0) <= 0 &&
      parseInt(numReach || '0', 0) <= 0
    ) {
      message.warning(`${this.state.op}资源不能为空或者0`)
      return
    }
    this.props.onSubmit({
      numAddfr,
      numDop,
      numUh,
      numReach,
    })
  }

  handleSetAddfrValueAfterAssigned = (value) => {
    const v = value.target ? value.target.value : value
    const addfrMax = this.calInputAddfrMax()
    this.setState({
      numAddfr: v,
      addfrError: v > addfrMax,
    })
  }

  handleSetUhValueAfterAssigned = (value) => {
    const v = value.target ? value.target.value : value
    const uhMax = this.calInputUhMax()

    this.setState({
      numDop:
        R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 ? v : 0,
      numUh:
        R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 ? 0 : v,
      uhError: v > uhMax,
    })
  }

  handleNumberReachSetValueAfterAssigned = (value) => {
    const v = value.target ? value.target.value : value
    const reachMax = this.calcReachMax()

    this.setState({
      numReach: v,
      reachError: v > reachMax,
    })
  }

  renderReachElement = (value) => {
    const {
      currentUser: { reach },
    } = this.props
    const { op, reachError } = this.state

    if (reach && reach.reach_type === 3) {
      return (
        <div className={`flex-column ${styles.inputPanel}`}>
          <span className={styles.label}>电话沟通券</span>
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
          <span className={styles.maxAllocate}>
            {reachError && <span className={styles.error}>余额不足</span>}
            {!reachError && `最多可${op}${value}张`}
          </span>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    const {
      type,
      item,
      visible,
      currentUser: { reach },
    } = this.props
    const {
      op,
      numDop,
      numUh,
      numAddfr,
      addfrError,
      uhError,
      reachError,
      numReach,
    } = this.state
    const title = (
      <div className={styles.title}>
        {type === 'assign'
          ? `为 ${item.sub_uname} 分配资源`
          : `回收 ${item.sub_uname} 的资源`}
      </div>
    )
    const isV3 = R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6
    let isReachType3 = false
    if (reach && reach.reach_type === 3) {
      isReachType3 = true
    }
    const num =
      R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6
        ? numDop
        : numUh
    const disableSubmit =
      (!numAddfr && !num && !numReach) || addfrError || uhError || reachError
    const footer = (
      <div className={styles.footer}>
        <span style={{ marginRight: '90px' }}>*仅支持回收管理员分配的额度</span>
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
    const addfrMax = this.calInputAddfrMax()
    const uhMax = this.calInputUhMax()
    const reachNum = this.calcReachMax()
    return (
      <Modal
        title={title}
        onCancel={this.props.onCancel}
        className={styles.equityModal}
        visible={visible}
        width={480}
        maskClosable={false}
        footer={footer}
      >
        <div className={`flex flex-align-center ${styles.contentWrapper}`}>
          {isV3 ? null : (
            <div
              className={`flex-column ${styles.inputPanel} ${styles.inputLeft}`}
            >
              <span className={styles.label}>加好友券</span>
              <InputNumber
                placeholder="请输入分配额度"
                type="number"
                min={0}
                max={addfrMax}
                onChange={this.handleSetAddfrValueAfterAssigned}
                onBlur={this.handleSetAddfrValueAfterAssigned}
                precision={0}
              />
              <span className={styles.maxAllocate}>
                {addfrError && <span className={styles.error}>余额不足</span>}
                {!addfrError && `最多可${op}${addfrMax}张`}
              </span>
            </div>
          )}
          {!isV3 && <div className={styles.gap} />}
          <div
            className={`flex-column ${styles.inputPanel} ${
              !isV3 ? styles.inputRight : null
            }`}
          >
            <span className={styles.label}>
              {isV3 ? '立即沟通券' : '极速联系劵'}
            </span>
            <InputNumber
              placeholder="请输入回收额度"
              type="number"
              min={0}
              max={uhMax}
              onChange={this.handleSetUhValueAfterAssigned}
              onBlur={this.handleSetUhValueAfterAssigned}
              precision={0}
            />
            <span className={styles.maxAllocate}>
              {uhError && <span className={styles.error}>余额不足</span>}
              {!uhError && `最多可${op}${uhMax}张`}
            </span>
          </div>
          {isV3 && isReachType3 && <div className={styles.gap} />}
          {isV3 && this.renderReachElement(reachNum)}
        </div>
        {isV3 ? null : (
          <div className={`flex flex-align-center ${styles.contentWrapper}`}>
            {this.renderReachElement(reachNum)}
          </div>
        )}
      </Modal>
    )
  }
}
