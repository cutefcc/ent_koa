import * as React from 'react'
// import PropTypes from 'prop-types'
import { Modal, message, Button } from 'antd'
import { connect } from 'react-redux'
// import * as R from 'ramda'
// import {isEmpty} from 'utils'

import * as styles from './editConditionModal.less'

export interface Props {
  conditionList: object[]
  onCancel: () => {}
  data: object
  id: number
}

export interface State {}
@connect((state: any) => ({
  conditionList: state.subscribe.conditionList,
}))
export default class EditConditionModal extends React.PureComponent<
  Props,
  State
> {
  getRegions = () => `${this.props.data.province}${this.props.data.cities}`

  // requiredFields = ['positions', 'worktimes', 'degrees']
  requiredFields = []

  fetchConditionList = () =>
    this.props.dispatch({ type: 'subscribe/fetchConditionList' })

  handleAddCondition = () => {
    if (this.props.conditionList.length >= 10) {
      this.props.onCancel()
      message.warning('已经到达订阅上限')
      return null
    }

    return this.props
      .dispatch({
        type: 'subscribe/addCondition',
        payload: this.props.data,
      })
      .then(() => {
        this.fetchConditionList()
        this.props.onCancel()
        message.success('添加人才订阅成功!')
      })
  }

  handleModifyCondition = () =>
    this.props
      .dispatch({
        type: 'subscribe/modifyCondition',
        payload: {
          ...this.props.data,
          id: this.props.id,
        },
      })
      .then(() => {
        this.fetchConditionList()
        this.props.onCancel()
        message.success('修改人才订阅成功!')
      })

  render() {
    // const valid =
    //   !R.any(
    //     isEmpty,
    //     Object.values(R.pickAll(this.requiredFields, this.props.data))
    //   ) && this.getRegions()
    const { data } = this.props
    const valid = !!(data.positions || data.query || data.companys)

    if (!valid) {
      return (
        <Modal
          onCancel={this.props.onCancel}
          width={400}
          className={styles.main}
          footer={
            <div className="flex space-between">
              <Button
                onClick={this.props.onCancel}
                className="primary-button flex-1"
              >
                确认
              </Button>
            </div>
          }
          visible
        >
          <p className="font-size-16">
            至少添加
            <span className="font-weight-bold">
              "关键词"，"职位技能"，"公司"
            </span>
            任意一项，才能保存
          </p>
        </Modal>
      )
    }

    if (!this.props.id) {
      this.props.onCancel()
      this.handleAddCondition()
      return null
    }

    return (
      <Modal
        onCancel={this.props.onCancel}
        width={400}
        className={styles.main}
        footer={
          <div className="flex space-between">
            <Button
              key="add"
              onClick={this.handleAddCondition}
              className="ghost-button flex-1"
            >
              新建订阅
            </Button>
            <Button
              key="modify"
              onClick={this.handleModifyCondition}
              className="primary-button flex-1"
            >
              覆盖原订阅
            </Button>
          </div>
        }
        visible
      >
        <p className="font-size-16">
          <span className="font-weight-bold">新建人才订阅 </span>
          还是直接
          <span className="font-weight-bold"> 覆盖原订阅方案</span>
        </p>
      </Modal>
    )
  }
}
