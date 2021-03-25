import { Button } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import styles from './index.less'

const CallRecords = withRouter(
  ({ data, dispatch, hideHeader = true, hidePager = true }) => {
    const { count, contact_status } = data

    if (!count || !contact_status.length) return null
    const size = 5
    const [page, setPage] = useState(0)
    // const [remain, setRemain] = useState(data.remain);
    const [uid, setUid] = useState(data.id)
    const [list, setList] = useState(data.contact_status)
    const [isNextAvailable, setIsNextAvailable] = useState(false)
    const [isPreviousAvailable, setIsPreviousAvailable] = useState(false)

    const fetchList = (page) => {
      dispatch({
        type: 'talents/fetchContact',
        payload: {
          to_uid: uid,
          page,
          size,
        },
      }).then(({ data: res }) => {
        const { id } = res
        setUid(id)
        // setRemain(remain);
        setList(res.contact_status)
        setIsNextAvailable(res.count > (page + 1) * size)
        setIsPreviousAvailable(page >= 1)
      })
    }

    useEffect(() => {
      // fetchList();
    }, [])

    useEffect(() => {
      fetchList(page)
    }, [page])

    const handlePrevPage = () => {
      if (page > 0) {
        setPage(page - 1)
      }
    }

    const handleNextPage = () => {
      if (isNextAvailable) {
        setPage(page + 1)
      }
    }

    const getTimeStr = (time) => {
      const curYear = new Date().getFullYear()
      if (typeof time === 'string') {
        return time.indexOf(curYear) === 0 ? time.substr(5) : time
      } else {
        return time
      }
    }

    const renderPagination = () => {
      const preClassName = `${styles.prev} ${
        isPreviousAvailable ? styles.available : styles.unAvailable
      }`
      const nextClassName = `${styles.next} ${
        isNextAvailable ? styles.available : styles.unAvailable
      }`
      return (
        <div className={styles.prevAndNext}>
          <span className={preClassName} onClick={handlePrevPage}>
            上一页
          </span>
          <span className={nextClassName} onClick={handleNextPage}>
            下一页
          </span>
        </div>
      )
    }

    return (
      <div className={styles.callRecords}>
        {!hideHeader && (
          <div className={styles.callRecordsTitle}>
            <span>发起过{count}次沟通</span>
            {!hidePager && renderPagination()}
          </div>
        )}
        {list.map((item, index) => (
          <div className={styles.callRecordsItem} key={index}>
            <div className={styles.callRecordsDetail}>
              <img className={styles.avatar} src={item.avatar} />
              <div>
                <h6 className={styles.name}>{item.name}</h6>
                <h6 className={styles.detail}>{item.text}</h6>
              </div>
            </div>
            <span className={styles.crtime}>{getTimeStr(item.time)}</span>
          </div>
        ))}
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  dispatch,
}))(CallRecords)
