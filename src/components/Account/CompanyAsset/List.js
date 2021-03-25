import React from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import AssiginedModal from './AssignedModal'
import AddStaffModal from './AddModal'

import styles from './list.less'

@connect()
export default class List extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    balance: PropTypes.number.isRequired,
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
    return [
      {
        title: 'license',
        dataIndex: 'license_serial',
        key: 'license_serial',
        width: 200,
      },
      {
        title: '子账号',
        dataIndex: 'sub_uname',
        key: 'sub_uname',
        width: 200,
        render: (value) => value || '未分配',
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
              onClick={this.handleDel(item.license_serial)}
              key="del"
              className={styles.op}
            >
              删除
            </span>,
          ]
        },
      },
    ]
  }

  handleDel = (license) => () => {
    this.props
      .dispatch({
        type: 'companyAsset/del',
        payload: {
          license_serial: license,
        },
      })
      .then(this.props.refresh)
  }

  handleShowAssignedModal = (assignType, assignItem) => () => {
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

  handleSubmitAssignedValue = (num) =>
    this.props
      .dispatch({
        type: `companyAsset/${this.state.assignType}`,
        payload: {
          num,
          to_license: this.state.assignItem.license_serial,
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
          license_serial: this.state.assignItem.license_serial,
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
          <AssiginedModal
            type={this.state.assignType}
            visible={this.state.showAssignedModal}
            item={this.state.assignItem}
            balance={this.props.balance}
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
