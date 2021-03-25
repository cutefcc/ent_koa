/* eslint-disable */
import React from 'react'
import { Progress } from 'antd'
import { formateFileSize, formatSeconds } from '../utils'
import styles from './style.less'
import { Icon } from 'mm-ent-ui'

const UploadProgress = (props) => {
  const { data } = props || {}
  const { runTime = {}, total, uploadSuccess = 0 } = data || {}
  const { loaded, size, percent } = total || {}
  const done = uploadSuccess === 1 || percent === 100

  return (
    <div className={styles.mmProgress}>
      <Progress
        style={{ width: '98%' }}
        strokeLinecap="square"
        percent={parseInt(percent)}
      />
      {done && (
        <div className={styles.success}>
          <span>
            {' '}
            <Icon type="check_circle_fill" />
            <span className={styles.successText}>视频上传完成 </span>
          </span>
        </div>
      )}

      {!done ? (
        <div className={styles.status}>
          {loaded ? (
            <span className={styles.uploadeSize}>
              已上传{`${formateFileSize(loaded)}/${formateFileSize(size)}`}
            </span>
          ) : null}
          {runTime.frendlySpeed ? (
            <span className={styles.uploadeSpeed}>
              当前速度{runTime.frendlySpeed}
            </span>
          ) : null}
          {runTime.predictFrendlyTime ? (
            <span className={styles.uploadePredictTime}>
              预计剩余时间{runTime.predictFrendlyTime}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
export default UploadProgress
