import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.less'

function OperationFilter({ onSearch }) {
  const [values, setvalues] = useState({ job_title: '' })
  const onChange = (v, key) => {
    setvalues({ ...values, [key]: v })
  }

  return (
    <div className={styles.filterWrap}>
      <Input
        placeholder="搜索职位"
        onChange={(v) => onChange(v.target.value, 'job_title')}
        onPressEnter={() => onSearch(values)}
        style={{ width: 200 }}
        suffix={
          <SearchOutlined
            onClick={() => {
              onSearch(values)
            }}
            style={{ color: '#d9d9d9', cursor: 'pointer' }}
          />
        }
      />
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  config: state.global.config,
  dispatch,
}))(OperationFilter)
