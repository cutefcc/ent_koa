import React from 'react'
import { Table, Popover } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Message } from 'mm-ent-ui'

import AssignedModal from './AssignedModal'
import AddStaffModal from './AddModal'

import styles from './list.less'
import { columns } from 'componentsV2/Data/constant'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class List extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    balance: PropTypes.number.isRequired,
    batch_invite_balance: PropTypes.number.isRequired,
    refresh: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    loading: false,
  }

  state = {
    showAssignedModal: false,
    showAddStaffModal: false,
    assignItem: {},
    assignType: '',
  }

  getColumns = () => {
    const {
      currentUser: { reach, equity_sys_type },
    } = this.props
    let title = ''

    const columns = [
      {
        title: 'license',
        dataIndex: 'license_serial',
        key: 'license_serial',
        width: 120,
        render: (v, item, index) => {
          return index + 1
        },
      },
      {
        title: '子账号',
        dataIndex: 'sub_uname',
        key: 'sub_uname',
        width: 280,
        render: (value, item) => (
          <div className={styles.subUname}>
            <span>{value || '未分配'}</span>
            {/* {item.reach_nbr !== undefined ? (
              <div
                className={
                  styles[`reachNbrTag${Math.ceil(item.reach_nbr / 10)}`]
                }
              >
                <Popover
                  content="此账号每天可使用的索要电话数量"
                  placement="topLeft"
                  overlayStyle={{width: 144}}
                >
                  电话{item.reach_nbr}个/天
                </Popover>
              </div>
            ) : null} */}
          </div>
        ),
      },
      {
        title: '手机号',
        dataIndex: 'sub_mobile',
        key: 'sub_mobile',
        width: 200,
        render: (v) => v || '-',
      },
      {
        title: '余量',
        dataIndex: 'balance',
        key: 'balance',
        width: 200,
        render: (value) => `${value} 点`,
      },
      {
        title: '智能邀约次数',
        dataIndex: 'batch_invite_balance',
        key: 'batch_invite_balance',
        width: 120,
        render: (value) => `${value} 次`,
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'uid',
        render: (value, item) => {
          if (!item.sub_uname) {
            return [
              <span
                onClick={this.handleShowAddStaffModal(item)}
                className={styles.op}
                key="add"
              >
                添加
              </span>,
              ' / ',
              <span
                onClick={this.handleShowAssignedModal('recycle', item)}
                key="recycle"
                className={styles.op}
              >
                回收
              </span>,
            ]
          }
          return [
            <span
              onClick={this.handleShowAssignedModal('assign', item)}
              key="assign"
              className={styles.op}
            >
              分配
            </span>,
            ' / ',
            <span
              onClick={this.handleShowAssignedModal('recycle', item)}
              key="recycle"
              className={styles.op}
            >
              回收
            </span>,
            ' / ',
            <span
              onClick={this.handleDel(item.id)}
              key="del"
              className={styles.op}
            >
              删除
            </span>,
          ]
        },
      },
    ]

    if (reach && (reach.reach_type === 2 || reach.reach_type === 3)) {
      const column = {
        title,
        dataIndex: 'reach_nbr',
        key: 'reach_nbr',
        width: 120,
        render: (value) => `${value} 次`,
      }

      if (reach.reach_type === 3) {
        if (equity_sys_type === 1) {
          column.title = '电话沟通券'
        } else if (equity_sys_type === 2) {
          column.title = '剩余电话沟通券'
        }
      } else {
        column.title = '索要电话次数'
        column.render = (v) => `${v || '0'}次/天`
      }

      columns.splice(5, 0, column)
    }

    return columns
  }

  handleDel = (id) => () => {
    this.props
      .dispatch({
        type: 'companyAsset/del',
        payload: {
          license_id: id,
        },
      })
      .then(this.props.refresh)
  }

  handleShowAssignedModal = (assignType, assignItem) => () => {
    const { balance, batch_invite_balance } = this.props
    const sign = [balance, batch_invite_balance].some((item) => item > 0)
    // if (assignType === 'assign' && this.props.balance <= 0) {
    if (assignType === 'assign' && !sign) {
      Message.warning('资产余额为0')
      return
    }
    this.setState({
      assignType,
      assignItem,
      showAssignedModal: true,
    })
  }

  handleCancelAssignedModal = () => {
    this.setState({
      showAssignedModal: false,
    })
  }

  handleSubmitAssignedValue = (num, batchInviteNum, numReach) =>
    this.props
      .dispatch({
        type: `companyAsset/${this.state.assignType}`,
        payload: {
          num,
          num_batch_invite: batchInviteNum,
          num_reach: numReach,
          license_id: this.state.assignItem.id,
        },
      })
      .then(() => {
        this.setState({
          showAssignedModal: false,
        })
        this.props.refresh()
      })

  handleShowAddStaffModal = (item) => () => {
    this.setState({
      showAddStaffModal: true,
      assignItem: item,
    })
  }

  handleHideAddStaffModal = () => {
    this.setState({
      showAddStaffModal: false,
    })
  }

  handleAddStaff = (uid) => {
    this.props
      .dispatch({
        type: 'companyAsset/add',
        payload: {
          sub_uid: uid,
          license_id: this.state.assignItem.id,
        },
      })
      .then(() => {
        this.handleHideAddStaffModal()
        this.props.refresh()
      })
  }

  render() {
    return (
      <div className={styles.main}>
        <Table
          dataSource={this.props.data}
          columns={this.getColumns()}
          rowKey="license_serial"
          pagination={false}
          loading={this.props.loading}
          scroll={{ y: 400 }}
        />
        {this.state.showAssignedModal && (
          <AssignedModal
            type={this.state.assignType}
            visible={this.state.showAssignedModal}
            item={this.state.assignItem}
            balance={this.props.balance}
            batch_invite_balance={this.props.batch_invite_balance}
            reach_nbr={this.props.reach_nbr}
            onSubmit={this.handleSubmitAssignedValue}
            onCancel={this.handleCancelAssignedModal}
          />
        )}
        {this.state.showAddStaffModal && (
          <AddStaffModal
            visible={this.state.showAddStaffModal}
            onCancel={this.handleHideAddStaffModal}
            onSubmit={this.handleAddStaff}
          />
        )}
      </div>
    )
  }
}
