import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { message, Modal } from 'antd'

@connect((state) => ({
  currentConditionId: state.subscribe.currentConditionId,
  conditionList: state.subscribe.conditionList,
}))
export default class Subscribe extends React.Component {
  componentDidMount() {
    this.fetchList()
  }

  fetchList = () => {
    this.props.dispatch({
      type: 'subscribe/fetchConditionList',
      payload: {
        page: 0,
        size: 20,
      },
    })
  }

  fetchConditionList = () =>
    this.props.dispatch({ type: 'subscribe/fetchConditionList' })

  handleCurrentConditionChange = (id) => () => {
    this.props.dispatch({
      type: 'subscribe/setCurrentCondictionId',
      payload: id,
    })
  }

  handleDeleteCondition = (id) => () => {
    Modal.confirm({
      title: '',
      content: '删除订阅条件，系统将自动取消人才推送，是否确认删除？',
      onOk: () => {
        this.props
          .dispatch({
            type: 'subscribe/deleteCondition',
            payload: {
              id,
            },
          })
          .then(() => {
            // 如果删除的是当前选中的条件，则将选中的条件置空
            if (this.props.currentConditionId === id) {
              this.handleCurrentConditionChange(0)()
            }
            this.fetchConditionList()
            message.success('删除订阅条件成功')
          })
      },
      okText: '确认删除',
      cancelText: '取消',
    })
  }

  renderItem = (item) => {
    // const province = R.propOr('', 'provinces', item).split(',')
    // const city = R.propOr('', 'cities', item).split(',')
    // const regions = R.without([''], R.uniq([...province, ...city])).join(' ')
    const active = item.id === this.props.currentConditionId
    const values = R.without(
      [''],
      R.values(
        R.pickAll(
          ['cities', 'provinces', 'companys', 'query', 'positions'],
          item
        )
      )
    )
    return (
      <li
        key={item.id}
        style={{ lineHeight: '40px', width: '100%' }}
        className={`cursor-pointer font-size-13 flex ${
          active ? 'color-blue' : 'color-common'
        }`}
      >
        <span
          onClick={this.handleCurrentConditionChange(item.id)}
          className="ellipsis flex-1"
        >
          {/* {`${regions} · ${item.positions}`} */}
          {values.join('·').replace(',', ' ')}
        </span>
        <span
          onClick={this.handleDeleteCondition(item.id)}
          className="font-size-18 font-weight-bold margin-left-8"
        >
          ×
        </span>
      </li>
    )
  }

  render() {
    if (!this.props.conditionList.length) {
      return null
    }

    return (
      <div className="padding-16 margin-top-32">
        <span
          style={{
            height: '2px',
            background: '#266fff',
            display: 'inline-block',
            width: '35px',
            marginBottom: '10px',
            opacity: '0.65',
          }}
        />
        <h5
          className="font-size-14 color-common"
          style={{ lineHeight: '40px', opacity: '0.65' }}
        >
          已保存方案
        </h5>
        <ul>{this.props.conditionList.map(this.renderItem)}</ul>
      </div>
    )
  }
}
