import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Table } from 'antd'
import { Icon, Avatar } from 'mm-ent-ui'
import * as R from 'ramda'
import styles from './index.less'

const IdentifyRecords = withRouter(
  ({ recordList, pagination, bprofileUser, dispatch, history }) => {
    const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
    const [loading, setloading] = useState(false)
    const fetchData = (current) => {
      setloading(true)
      webcid &&
        dispatch({
          type: 'companyIdentify/fetchRecordList',
          payload: {
            webcid,
            page: current - 1 || 0,
            size: pagination.pageSize,
          },
        }).then(() => {
          setloading(false)
        })
    }

    const onTableChange = (p) => {
      dispatch({
        type: 'companyIdentify/setData',
        payload: { recordPagination: p },
      })
      fetchData(p.current)
    }

    useEffect(() => {
      fetchData()
      return () => {
        dispatch({
          type: 'companyIdentify/setData',
          payload: { recordList: [] },
        })
      }
    }, [])

    const columns = [
      {
        title: '被举报人',
        width: 300,
        render: ({ avatar, name, company, position, judge }) => (
          <div className={styles.userInfo}>
            <Avatar shape="circle" size="32px" src={avatar} />
            <span style={{ marginLeft: 8, marginTop: 6 }}>
              {name}·{company}
              {position}
            </span>
            {judge === 1 && (
              <Icon
                type="v"
                className="color-orange2 margin-left-4 margin-top-8 font-size-16"
              />
            )}
          </div>
        ),
      },
      {
        title: '举报材料',
        width: 300,
        render: ({ reason, file_url }) => (
          <div className={styles.tdItem}>
            <p>{reason}</p>
            {file_url && (
              <a href={file_url} target="_blank">
                <img
                  style={{ maxWidth: 56, maxHeight: 56 }}
                  alt="图片"
                  src={file_url}
                />
              </a>
            )}
          </div>
        ),
      },
      {
        dataIndex: 'crtime',
        title: '提交时间',
        width: 168,
        render: (v) => <div className={styles.tdItem}>{v}</div>,
      },
      {
        title: '审核结果',
        width: 100,
        render: ({ record_status }) => {
          const color = {
            0: '#FFA408',
            2: '#FF4D3C',
            3: '#FFA408',
          }[record_status]
          const desc = {
            0: '审核中',
            1: '审核通过',
            2: '审核失败',
            3: '待确认',
          }[record_status]

          return (
            <div style={{ color }} className={styles.operation}>
              {desc}
            </div>
          )
        },
      },
    ]

    return (
      <div className={styles.identifyWrap}>
        <div className={styles.header}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              history.push('/ent/v2/company/admin/identify')
            }}
          >
            员工身份认证 /{' '}
          </span>
          <span>处理记录</span>
        </div>
        <Table
          style={{ marginTop: 24 }}
          dataSource={recordList}
          columns={columns}
          rowKey="uid"
          id="table"
          scroll={{ y: 390 }}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
        />
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  recordList: state.companyIdentify.recordList,
  pagination: state.companyIdentify.recordPagination,
  bprofileUser: state.global.bprofileUser,
  config: state.global.config,
  dispatch,
}))(IdentifyRecords)
