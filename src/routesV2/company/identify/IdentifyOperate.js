import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Avatar, Tab, Icon, Message } from 'mm-ent-ui'
import { Table } from 'antd'
import * as R from 'ramda'
import OperationFilter from 'componentsV2/Company/Identify/OperationFilter'
import ProveFakeModal from 'componentsV2/Company/Identify/ProveFakeModal'

import styles from './index.less'

function Identify({ employerList, pagination, bprofileUser, dispatch }) {
  const [proveModalVisible, setproveModalVisible] = useState(false)
  const [proveStatus, setproveStatus] = useState(1)
  const [proveUsers, setproveUsers] = useState([])
  const [selectedRowKeys, setselectedRowKeys] = useState([])
  const [search, setsearch] = useState({ judge: 0, query: '' })
  const [loading, setloading] = useState(false)

  const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
  const fetchData = (current) => {
    setloading(true)
    webcid &&
      dispatch({
        type: 'companyIdentify/fetchEmployerList',
        payload: {
          webcid,
          search,
          page: current - 1 || 0,
          size: pagination.pageSize,
        },
      }).then(() => {
        setloading(false)
        setselectedRowKeys([])
      })
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleOperate = (status, data) => {
    setproveModalVisible(true)
    setproveStatus(status)
    setproveUsers([data])
  }

  const handleBatchOpreate = (e) => {
    if (selectedRowKeys.length < 1) {
      Message.warn('未选中员工')
      return
    }

    setproveModalVisible(true)
    setproveStatus(Number(e.key))
    setproveUsers(
      employerList.filter((user) => selectedRowKeys.indexOf(user.uid) !== -1)
    )
  }

  const onSearch = (values) => {
    setsearch(values)
  }

  const onProveOk = () => {
    setproveModalVisible(false)
    setselectedRowKeys([])
    fetchData()
  }

  const onCancelProve = () => {
    setproveModalVisible(false)
  }

  const onTableChange = (p) => {
    dispatch({
      type: 'companyIdentify/setData',
      payload: { operatePagination: p },
    })
    fetchData(p.current)
  }

  const onSelectChange = (uids) => {
    setselectedRowKeys(uids)
  }

  const tabsConfig = [
    {
      title: '员工身份认证',
      key: 1,
    },
  ]

  const columns = [
    {
      title: '姓名公司职位',
      width: 480,
      render: (data) => (
        <div className={styles.userInfo}>
          <Avatar shape="circle" size="32px" src={data.avatar} />
          <span style={{ marginLeft: 8, marginTop: 6 }}>
            {data.name}·{data.company}
            {data.position}
          </span>
          {data.judge === 1 && (
            <Icon
              type="v"
              className="color-orange2 margin-left-4 margin-top-8 font-size-16"
            />
          )}
        </div>
      ),
    },
    {
      dataIndex: 'judge',
      title: '平台认证状态',
      width: 190,
      render: (value) => (
        <div className={styles.tdItem}>
          {value === 1 ? <span>已认证</span> : <span>未认证</span>}
        </div>
      ),
    },
    {
      title: '操作',
      width: 228,
      render: (data) => (
        <div className={styles.operation}>
          {/* <Button
            type="button_m_exact_link_blue"
            onClick={() => handleOperate(1, data)}
            disabled={data.judge == 1 || data.is_op}
          >
            在职
          </Button> */}
          <Button
            type="button_m_exact_link_blue"
            onClick={() => handleOperate(2, data)}
            disabled={data.is_op}
          >
            已离职
          </Button>
          <Button
            type="button_m_exact_link_blue"
            onClick={() => handleOperate(3, data)}
            disabled={data.is_op}
          >
            身份作假
          </Button>
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onSelect: onSelectChange,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.is_op === 1,
    }),
  }

  return (
    <div className={styles.identifyWrap}>
      <Tab
        tabs={tabsConfig}
        activeKeys={[1]}
        type="large"
        style={{ borderBottom: '1px solid #F2F4F8', paddingLeft: '24px' }}
      />
      <OperationFilter
        onSearch={onSearch}
        handleBatchOpreate={handleBatchOpreate}
      />
      <Table
        dataSource={employerList}
        columns={columns}
        rowKey="uid"
        id="table"
        scroll={{ y: 390 }}
        loading={loading}
        pagination={pagination}
        onChange={onTableChange}
        rowSelection={rowSelection}
      />
      {proveModalVisible && (
        <ProveFakeModal
          users={proveUsers}
          status={proveStatus}
          onOk={onProveOk}
          onCancel={onCancelProve}
        />
      )}
    </div>
  )
}

export default connect((state, dispatch) => ({
  employerList: state.companyIdentify.employerList,
  pagination: state.companyIdentify.operatePagination,
  bprofileUser: state.global.bprofileUser,
  config: state.global.config,
  dispatch,
}))(Identify)
