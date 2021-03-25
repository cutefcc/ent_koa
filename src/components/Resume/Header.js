import React from 'react'

import { connect } from 'react-redux'

import classnames from 'classnames'

import { Select } from 'antd'

import styles from './Header.less'

const { Option } = Select

@connect((state) => ({
  jobs: state.global.jobs,
}))
export default class JobMan extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabAction: '',
      opType: this.props.query.ejid || '0',
      headerCount: this.props.headerCount,
      headerData: [
        { text: '待处理', valueKey: 'pending_count' },
        { text: '待沟通', valueKey: 'interest_count' },
        { text: '储备人才', valueKey: 'reserve_talent_cnt' },
        { text: '不合适', valueKey: 'notprop_count' },
      ],
      validData: this.props.validData,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      headerCount: nextProps.headerCount,
      validData: nextProps.validData,
      opType: nextProps.query.ejid,
    })
  }

  // 职位切换
  handleChange = (value, options) => {
    const { opType } = this.state
    if (opType !== value) {
      this.setState({ opType: value }, () => {
        this.props.clickCallback({ ejid: value, options })
      })
    }
  }

  // tab简历状态切换
  handleTabAction = (k, v) => {
    const { tabAction } = this.state
    if (tabAction !== k) {
      this.setState({ tabAction: k }, () => {
        this.props.clickCallback({ tp: v })
      })
    }
  }

  // 初始化header
  renderHeader = () => {
    let { tabAction } = this.state
    const { headerData, headerCount } = this.state
    const { query } = this.props
    headerData.map((v, k) => {
      if (headerCount[v.valueKey] > 0 && tabAction === '') {
        tabAction = k
      }
      return v
    })

    tabAction = tabAction === '' ? 0 : tabAction

    if (query.tp === 2) {
      tabAction = 3
    } else if (query.tp === 3) {
      tabAction = 2
    } else if (query.tp || query.tp === 0) {
      tabAction = query.tp
    }

    return headerData.map((v, k) => {
      return (
        <div
          key={`header_${v.text}`}
          onClick={() => {
            this.handleTabAction(k, v.valueKey)
          }}
          className={classnames({
            [styles.tabAction]: tabAction === k,
          })}
        >
          {v.text}·{headerCount[v.valueKey]}
        </div>
      )
    })
  }

  render() {
    const { validData, opType } = this.state
    return (
      <div className={styles.header}>
        {this.renderHeader()}
        <div className={styles.select}>
          <Select
            showSearch
            optionFilterProp="children"
            defaultValue={opType}
            style={{
              width: 320,
              marginTop: 8,
              right: 100,
              position: 'absolute',
            }}
            onChange={(val) => this.handleChange(val, validData)}
          >
            <Option value="0">全部职位</Option>
            {validData &&
              validData.length > 0 &&
              validData.map((v) => {
                return (
                  <Option key={`header_${v.ejid}`} value={v.ejid}>
                    <span style={{ fontSize: '14px', color: '#666F80' }}>
                      {v.position}- {v.uptime.split(' ')[0]}
                    </span>
                  </Option>
                )
              })}
          </Select>
        </div>
      </div>
    )
  }
}
