/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import styles from './importFormModal.less'
import SpecialButton from './SpecialButton'

function ImportFormModal({ dispatch, onCancel, jobs, onSubmit }) {
  const [buttonName, setButtonName] = useState(
    jobs ? new Array(jobs.length).fill('导入') : []
  )
  const [isNewAdd, setIsNewAdd] = useState(1)
  const fetchJobs = () => {
    dispatch({
      type: 'global/fetchJobs',
      // 请求参数
      payload: {
        is_new_add: isNewAdd,
      },
    })
  }
  const handleImport = (index) => {
    const params = {
      positions: jobs[index].position,
      worktimes: jobs[index].worktime,
      cities: jobs[index].city,
      degrees: jobs[index].degrees,
      companyscope: 0,
      ejid: jobs[index].ejid,
    }
    onSubmit(params)
    // setButtonName(buttonName[index] = '已导入')
  }

  useEffect(() => {
    fetchJobs()
  }, [])
  return (
    <Modal
      title="导入职位"
      visible
      className={styles.commonFormModal}
      maskClosable={false}
      onCancel={onCancel}
      width={560}
      footer={
        <Button onClick={onCancel} className={styles.cancel}>
          关闭
        </Button>
      }
    >
      <div className={styles.modalContant}>
        {jobs && jobs.length ? (
          <div className={styles.modalSuccess}>
            {jobs.map((item, index) => {
              return (
                <p key={item.id} className={styles.modalPage}>
                  <span className={styles.modalContant}>{item.position}</span>
                  <Button
                    className={styles.importButton}
                    onClick={() => handleImport(index)}
                    type="link"
                  >
                    {buttonName[index]}
                  </Button>
                </p>
              )
            })}
          </div>
        ) : (
          <div className={styles.modalFailure}>
            暂无在招职位,
            <SpecialButton
              path="/ent/v2/job/positions/publish"
              text="发布新职位"
            />
          </div>
        )}
      </div>
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  jobs: state.global.jobs,
  dispatch,
}))(ImportFormModal)
