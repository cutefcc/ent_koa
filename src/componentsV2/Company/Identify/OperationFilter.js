import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { MUIButton } from 'mm-ent-ui'
import { Select, Input, Dropdown, Menu } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './OperationFilter.less'

const { Option } = Select

const OperationFilter = withRouter(
  ({ onSearch, handleBatchOpreate, history }) => {
    const [values, setvalues] = useState({ judge: 0, query: '' })
    const checkoutRecords = () => {
      history.push('/ent/v2/company/admin/identify?tab=records')
    }
    const onChange = (v, key) => {
      setvalues({ ...values, [key]: v })
      if (key === 'judge') {
        onSearch({ ...values, [key]: v })
      }
    }
    const options = [
      { label: '全部', value: 0 },
      { label: '平台未认证', value: 2 },
      { label: '平台已认证', value: 1 },
    ]
    const renderOptions = options.map((d) => (
      <Option key={d.value}>{d.label}</Option>
    ))

    const menu = (
      <Menu onClick={handleBatchOpreate}>
        <Menu.Item key={2}>已离职</Menu.Item>
        <Menu.Item key={3}>身份作假</Menu.Item>
      </Menu>
    )

    return (
      <div className={styles.filterWrap}>
        <Select
          options={options}
          defaultValue={[0]}
          style={{ width: 160 }}
          onSelect={(v) => onChange(parseInt(v), 'judge')}
        >
          {renderOptions}
        </Select>
        <Input
          placeholder="搜索姓名"
          onChange={(v) => onChange(v.target.value, 'query')}
          onPressEnter={() => onSearch(values)}
          style={{ width: 160 }}
          suffix={
            <SearchOutlined
              onClick={() => {
                onSearch(values)
              }}
              style={{ color: '#d9d9d9', cursor: 'pointer' }}
            />
          }
        />
        <div className={styles.goRecords}>
          <Dropdown overlay={menu}>
            <MUIButton type="mbutton_m_exact_blue450_l2">批量操作</MUIButton>
          </Dropdown>

          <MUIButton
            type="mbutton_m_exact_blue450_l2"
            onClick={checkoutRecords}
          >
            <span>
              <img
                alt="empty"
                src="https://i9.taou.com/maimai/p/24338/812_53_52hnJV3oAtYqO8Xr"
              />
              查看处理记录
            </span>
          </MUIButton>
        </div>
      </div>
    )
  }
)

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  config: state.global.config,
  dispatch,
}))(OperationFilter)
