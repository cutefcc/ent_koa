import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'
import { Empty, Modal } from 'antd'
import { Loading } from 'mm-ent-ui'
import InfiniteScroll from 'react-infinite-scroller'
import styles from './employerSpreadEndList.less'

const EpbBalanceDetail = withRouter(
  ({
    dispatch,
    onCancel,
    bprofileUser,
    epbRecord,
    epbRecordRemain,
    employerBalance,
  }) => {
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(0)
    const recordTypeMap = {
      1: '充值',
      2: '推广使用',
      3: '推广差额退回',
      4: '失效过期',
      5: '赠送',
    }

    const handleInfiniteOnLoad = () => {
      const webcid = R.path(['company', 'webcid'], bprofileUser)
      if (epbRecordRemain < 1) return
      setLoading(true)
      dispatch({
        type: 'company/fetchEpbDetail',
        payload: {
          webcid,
          page,
          size: 20,
        },
      }).then(() => {
        setLoading(false)
        setPage(page + 1)
      })
    }

    useEffect(() => {
      handleInfiniteOnLoad()
      return () => {
        dispatch({
          type: 'company/setData',
          payload: {
            epbRecordRemain: 1,
            epbRecord: [],
          },
        })
      }
    }, [])

    return (
      <Modal
        title={`曝光币剩余总额：${employerBalance}`}
        visible={true}
        onCancel={onCancel}
        footer={null}
        bodyStyle={{
          padding: '0 24px 16px',
          maxHeight: '400px',
          overflow: 'scroll',
        }}
      >
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && !!epbRecordRemain}
          useWindow={false}
        >
          {epbRecord.map((item) => {
            const isNegative = [2, 4].indexOf(item.record_type) !== -1
            return (
              <div key={item.id} className={styles.epbRecord}>
                <span>{item.crtime}</span>
                <span>{recordTypeMap[item.record_type]}</span>
                <span style={{ color: isNegative ? '#6E727A' : '#FFA207' }}>
                  {isNegative ? '' : '+'}
                  {item.num}
                </span>
              </div>
            )
          })}
        </InfiniteScroll>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loading />
          </div>
        )}
        {epbRecord.length === 0 && (
          <Empty
            style={{ padding: 20 }}
            image="https://maimai.cn/ent/images/empty_position.png"
            description="暂无记录"
          />
        )}
      </Modal>
    )
  }
)

export default connect((state) => ({
  auth: state.global.auth,
  bprofileUser: state.global.bprofileUser,
  epbRecord: state.company.epbRecord,
  epbRecordRemain: state.company.epbRecordRemain,
  employerBalance: state.company.employerBalance,
}))(EpbBalanceDetail)
