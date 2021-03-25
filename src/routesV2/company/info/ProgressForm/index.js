/* eslint-disable */

import React, { useState, useEffect } from 'react'
import { Modal, DatePicker, Input, message, Radio } from 'antd'
import moment from 'moment'
import styles from './index.less'
import * as R from 'ramda'

const { MonthPicker, RangePicker } = DatePicker
const progressForm = (props) => {
  const { onEdit, onSave, onDel, onCancel, onCreate, data } = props
  const monthFormat = 'YYYY/MM'

  const renderRow = (item, index) => {
    const { desc, id, month, year, editStatus } = item
    const timeText = `${year}年${month}月`
    const formValue = {
      history_id: id,
      year,
      month,
    }

    const onPickerChange = (date, dateString) => {
      const dataArray = dateString.split('-')
      formValue['year'] = dataArray[0]
      formValue['month'] = dataArray[1]
    }
    const onInputChange = (e) => {
      formValue['desc'] = e.target.value
    }
    const edit = () => {
      onEdit(index)
    }
    const save = () => {
      if (!formValue.year || !formValue.month) {
        message.error('缺少日期')
        return
      }
      if (!R.trim(desc)) {
        message.error('缺少内容')
        return
      }
      onSave({ ...item, ...formValue })
    }
    const del = () => {
      onDel(id)
    }
    return (
      <div className={styles.row} key={id}>
        <div className={styles.time}>
          {editStatus ? (
            <MonthPicker
              placeholder={'请选择'}
              style={{
                width: '104px',
              }}
              defaultValue={moment(`${year}/${month}`, monthFormat)}
              format={monthFormat}
              onChange={onPickerChange}
            />
          ) : (
            timeText
          )}
        </div>
        <div className={styles.content}>
          {editStatus ? (
            <Input
              placeholder={'请输入1～200字'}
              style={{
                width: '564px',
              }}
              maxLength={200}
              onChange={onInputChange}
              defaultValue={desc}
            />
          ) : (
            desc
          )}
        </div>
        <div className={styles.action}>
          {editStatus ? (
            <a className={styles.edit} onClick={save}>
              完成
            </a>
          ) : (
            <div>
              {' '}
              <a className={styles.edit} onClick={edit}>
                编辑
              </a>
              <a className={styles.delete} onClick={del}>
                删除
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  const NewRow = () => {
    const [formValue, setFormValue] = useState({ year: 0, month: 0, desc: '' })
    const onPickerChange = (date, dateString) => {
      const dataArray = dateString.split('-')
      console.log(date)
      setFormValue({
        ...formValue,
        year: dataArray[0],
        month: dataArray[1],
      })
    }
    const onInputChange = (e) => {
      setFormValue({
        ...formValue,
        desc: e.target.value,
      })
    }
    const add = () => {
      console.log(formValue)
      if (!formValue.year || !formValue.month) {
        message.error('缺少日期')
        return
      }
      if (!R.trim(desc)) {
        message.error('缺少内容')
        return
      }
      onCreate(formValue)
      // clear
      setFormValue({ year: 0, month: 0, desc: '' })
    }
    const { year, month, desc } = formValue
    return (
      <div className={styles.row}>
        <div className={styles.time}>
          <MonthPicker
            placeholder={'请选择'}
            style={{
              width: '104px',
            }}
            defaultValue={year ? moment(`${year}/${month}`, monthFormat) : null}
            onChange={onPickerChange}
          />
        </div>
        <div className={styles.content}>
          <Input
            placeholder={'请选择'}
            onChange={onInputChange}
            style={{
              width: '564px',
            }}
            defaultValue={desc}
          />
        </div>
        <div className={styles.action}>
          <a className={styles.edit} onClick={add}>
            添加
          </a>
        </div>
      </div>
    )
  }
  return (
    <Modal
      visible={true}
      onCancel={onCancel}
      footer={null}
      title="发展历程设置"
      width="800px"
    >
      <div className={styles.progressForm}>
        <NewRow />
        <div className={styles.wrap}>
          {data.map((item, index) => renderRow(item, index))}
        </div>
      </div>
    </Modal>
  )
}

export default progressForm
