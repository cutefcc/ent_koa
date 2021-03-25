import * as React from 'react'
import { Table, Popover } from 'antd'
import { connect } from 'react-redux'
import { Message } from 'mm-ent-ui'
import * as R from 'ramda'
import AssignEquityModal from './AssignEquityModal'
import AddStaffModal from './AddModal'

import * as styles from './list.less'

export interface Props {
  data: object[]
  balance: number
  addfr: number
  uh: number
  direct_oppo: number
  reachNbr: number
  refresh: Function
  loading: boolean,
  currentUser: object,
}

export interface State {
  showAssignedModal: boolean
  showAddStaffModal: boolean
  assignItem: object
  assignType: string
}

@connect(state => ({
  currentUser: state.global.currentUser,
}))
export default class EquityList extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showAssignedModal: false,
      showAddStaffModal: false,
      assignItem: {},
      assignType: '',
    }
  }

  getColumns = () => {
    const { currentUser: { reach, equity_sys_type } } = this.props;
    let title = '';
    const isV3 = R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6;
    const callColumn = isV3 ? {
      title: '剩余立即沟通券',
      dataIndex: 'direct_oppo',
      key: 'direct_oppo',
      width: 140,
      render: v => v || '0',
    } : {
        title: '剩余极速联系券',
        dataIndex: 'uh',
        key: 'uh',
        width: 200,
        render: v => v || '0',
      };

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
        width: 200,
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
        render: v => v || '-',
      },
      {
        title: '剩余加好友券',
        dataIndex: 'addfr',
        key: 'addfr',
        width: 200,
        render: v => v || '0',
      },
      callColumn,
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

    // v2和v3旧权益都要修改
    if (reach && (reach.reach_type === 2 || reach.reach_type === 3)) {
      const column = {
        title: '',
        dataIndex: 'reach_nbr',
        key: 'reach_nbr',
        width: 140,
        render: value => `${value} 次`,
      };

      if (reach && reach.reach_type === 3) {
        if (equity_sys_type === 1) {
          column.title = '电话沟通券'
        } else if (equity_sys_type === 2) {
          column.title = '剩余电话沟通券'
        }
      } else {
        column.title = '索要电话次数';
        column.render = v => `${v || '0'}次/天`;
      }

      columns.splice(5, 0, column);
    }

    return columns;
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleDel = id => () => {
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
    const { addfr, direct_oppo, reachNbr, uh } = this.props
    if (R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 && assignType === 'assign' && addfr <= 0 && direct_oppo <= 0 && reachNbr <= 0) {
      Message.warning('加好友券和立即沟通券为0')
      return
    }
    if (R.pathOr(0, ['props', 'currentUser', 'identity'], this) !== 6 && assignType === 'assign' && addfr <= 0 && uh <= 0 && reachNbr <= 0) {
      Message.warning('加好友券和极速联系券为0')
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

  handleSubmitAssignedValue = ({ numAddfr, numUh, numDop, numReach }) =>
    this.props
      .dispatch({
        type: `companyAsset/${this.state.assignType}`,
        payload: {
          num_addfr: numAddfr,
          num_uh: numUh,
          num_direct_oppo: numDop,
          num_reach: numReach,
          license_id: this.state.assignItem.id,
        },
      })
      .then(() => {
        this.setState({
          showAssignedModal: false,
        })
        this.refreshCurrentUser()
        this.props.refresh()
      })

  handleShowAddStaffModal = item => () => {
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

  handleAddStaff = uid => {
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
    const {
      assignType,
      showAssignedModal,
      showAddStaffModal,
      assignItem,
    } = this.state
    const { addfr, direct_oppo, uh, reachNbr } = this.props
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
        {showAssignedModal && (
          <AssignEquityModal
            type={assignType}
            visible={showAssignedModal}
            item={assignItem}
            addfr={addfr}
            uh={uh}
            direct_oppo={direct_oppo}
            reachNbr={reachNbr}
            onSubmit={this.handleSubmitAssignedValue}
            onCancel={this.handleCancelAssignedModal}
          />
        )}
        {showAddStaffModal && (
          <AddStaffModal
            visible={showAddStaffModal}
            onCancel={this.handleHideAddStaffModal}
            onSubmit={this.handleAddStaff}
          />
        )}
      </div>
    )
  }
}
