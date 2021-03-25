import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Avatar } from 'mm-ent-ui'
import { Table, message } from 'antd'
import * as R from 'ramda'
import PositionFilter from './PositionFilter'

import styles from './index.less'

function PositionList({ companyJobList, pagination, bprofileUser, dispatch }) {
  const [search, setsearch] = useState({ job_title: '' })
  const [loading, setloading] = useState(false)

  const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
  const fetchData = (current) => {
    if (webcid) {
      setloading(true)
      dispatch({
        type: 'companyIdentify/fetchCompanyJobList',
        payload: {
          webcid,
          ...search,
          page: current - 1 || 0,
          count: pagination.pageSize,
        },
      }).then(() => {
        setloading(false)
      })
    }
  }

  useEffect(() => {
    fetchData()
    const tableBodyEle = document.getElementsByClassName('ant-table-body')
    if (tableBodyEle && tableBodyEle[0]) {
      tableBodyEle[0].scrollTop = 0
    }
  }, [search])

  const handleOperate = (e, stick_status, view_status, id) => {
    e.stopPropagation()
    dispatch({
      type: 'companyIdentify/changeCompanyJobList',
      payload: {
        webcid,
        stick_status,
        view_status,
        id,
      },
    }).then(({ result }) => {
      if (result === 'ok') {
        message.success('操作成功')
        fetchData(pagination.current)
      }
    })
  }

  const onSearch = (values) => {
    setsearch(values)
  }

  const onTableChange = (p) => {
    dispatch({
      type: 'companyIdentify/setData',
      payload: { operatePagination: p },
    })
    fetchData(p.current)
  }

  const columns = [
    {
      title: '职位',
      width: 390,
      render: (data) => (
        <div className={styles.jobInfo}>
          <div className={styles.jobInfoTitle}>
            <span>{data.position}</span>
            <span>{data.salary_info}</span>
            {data.is_stick ? (
              <span className={styles.jobRedTag}>急招</span>
            ) : null}
            {data.not_view ? (
              <span className={styles.jobGreyTag}>不可见</span>
            ) : null}
          </div>
          <div className={styles.jobInfoContent}>
            <span>{data.province}</span>
            <span>{data.degree}</span>
            <span>{data.worktime}</span>
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'user',
      title: '发布者',
      width: 310,
      render: (data, record) => (
        <div className={styles.userInfo}>
          <div>
            <Avatar shape="circle" size="20px" src={data.avatar} />
            <span style={{ marginLeft: 8 }}>
              {data.name}·{data.company}
              {data.position}
            </span>
          </div>
          <p>{record.refresh_time}回复过</p>
        </div>
      ),
    },
    {
      title: '操作',
      width: 228,
      render: (data) => (
        <div className={styles.operation}>
          <Button
            type="button_m_exact_link_blue"
            onClick={(e) => handleOperate(e, data.is_stick ? 0 : 1, 1, data.id)}
            disabled={data.not_view === 1}
          >
            {data.is_stick ? '取消急招' : '急招置顶'}
          </Button>
          <Button
            type="button_m_exact_link_blue"
            onClick={(e) => handleOperate(e, 0, data.not_view ? 1 : 0, data.id)}
            disabled={data.is_stick}
          >
            {data.not_view ? '设为可见' : '设为不可见'}
          </Button>
        </div>
      ),
    },
  ]
  const { normal_data } = companyJobList
  const stickData = companyJobList.stick_data.map((v) => ({
    ...v,
    is_stick: true,
  }))
  const dataSource = stickData.concat(normal_data)

  return (
    <div className={styles.positionWrap}>
      <PositionFilter onSearch={onSearch} />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        id="table"
        scroll={{ y: 390, scrollToFirstRowOnChange: true }}
        loading={loading}
        pagination={pagination}
        onChange={onTableChange}
        onRow={(record) => {
          return {
            onClick: () => {
              window.open(record.share_url)
            }, // 点击行
          }
        }}
      />
    </div>
  )
}

export default connect((state, dispatch) => ({
  companyJobList: state.companyIdentify.companyJobList,
  pagination: state.companyIdentify.jobListPagination,
  bprofileUser: state.global.bprofileUser,
  config: state.global.config,
  dispatch,
}))(PositionList)
