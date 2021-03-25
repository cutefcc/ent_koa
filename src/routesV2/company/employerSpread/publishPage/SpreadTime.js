import React, { useState } from 'react'
import { Text } from 'mm-ent-ui'
import { DatePicker, Radio } from 'antd'
import ItemTitle from './ItemTitle'
import styles from './SpreadTime.less'
import moment from 'moment'

const format = 'YYYY-MM-DD HH:mm:ss'

export default function SpreadTime(props) {
  const {
    employerSpreadData,
    onPushStartTimeChange,
    onPushEndTimeChange,
  } = props
  const [duration, setDuration] = useState(7)
  const { invite_time: inviteTime } = employerSpreadData || {}

  function disabledStartDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  function onSelectDuration(e) {
    setDuration(e.target.value)
    onPushEndTimeChange(moment(inviteTime).add(e.target.value, 'days'))
  }

  const durationOptions = [
    { label: '7天', value: 7 },
    { label: '15天', value: 15 },
    { label: '30天', value: 30 },
    { label: '90天', value: 90 },
  ]

  return (
    <div className={styles.spreadCon}>
      <ItemTitle str="推广时间" />
      <div className={styles.row}>
        <div className={styles.left}>
          <Text type="text_primary" size={14}>
            开始时间<span style={{ color: '#FF4D3C' }}>*</span>
          </Text>
        </div>
        <div className={styles.right}>
          <DatePicker
            format={format}
            onChange={onPushStartTimeChange}
            value={inviteTime && moment(inviteTime)}
            defaultValue={moment(inviteTime)}
            disabledDate={disabledStartDate}
            placeholder="请选择开始日期和时间"
            showTime
          />
        </div>
      </div>
      <div className={styles.row} style={{ marginBottom: 64 }}>
        <div className={styles.left}>
          <Text type="text_primary" size={14}>
            持续时间<span style={{ color: '#FF4D3C' }}>*</span>
          </Text>
        </div>
        <div className={styles.right}>
          <Radio.Group
            options={durationOptions}
            onChange={onSelectDuration}
            value={duration}
            optionType="button"
          />
        </div>
      </div>
    </div>
  )
}
