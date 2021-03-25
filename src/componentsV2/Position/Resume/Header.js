import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'
import classnames from 'classnames'
import { withRouter } from 'react-router-dom'
import { Select } from 'antd'
import styles from './Header.less'
const { Option } = Select

@connect((state) => ({
  jobs: state.global.jobs,
}))
@withRouter
export default class JobMan extends React.Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const ejid = R.trim(R.pathOr('', ['query', 'ejid'], urlObj))
    this.state = {
      tabAction: 0,
      ejid,
      has_oppo: '-1',
    }
  }

  // 职位切换
  handlePositionChange = (value) => {
    const { ejid } = this.state
    if (ejid !== value) {
      this.setState({ ejid: value }, () => {
        this.props.clickCallback({
          ejid: value,
        })
      })
    }
  }

  // tab简历状态切换
  handleTabAction = (v) => {
    const { type = 0 } = v
    const { tabAction } = this.state
    if (tabAction !== type) {
      this.setState({ tabAction: type }, () => {
        this.props.clickCallback({ rtype: type })
      })
    }
  }

  // 初始化header
  renderHeader = () => {
    let { tabAction = 0 } = this.state
    const { filterStatus = [] } = this.props
    tabAction = tabAction > 0 ? (tabAction -= 1) : tabAction
    return filterStatus.map((v, k) => {
      const { name = '' } = v || {}
      return (
        <div
          key={`header_${name}`}
          onClick={() => {
            this.handleTabAction(v)
          }}
          className={classnames({
            [styles.tabAction]: tabAction === k,
          })}
        >
          {name}
        </div>
      )
    })
  }

  handleCommunicateSyayusChange = (value) => {
    const { has_oppo = -1 } = this.state
    if (has_oppo !== value) {
      this.setState({ has_oppo: value }, () => {
        this.props.clickCallback({ has_oppo: value })
      })
    }
  }

  render() {
    const { validData } = this.props
    const { ejid = '', has_oppo = -1 } = this.state
    return (
      <div className={styles.header}>
        {this.renderHeader()}
        <div>
          <Select
            optionFilterProp="children"
            defaultValue={ejid || '全部职位'}
            style={{
              marginTop: 8,
              right: 290,
              position: 'absolute',
              width: 240,
            }}
            onChange={(val) => this.handlePositionChange(val, validData)}
            virtual={false}
          >
            <Option value="0">
              {validData.length > 0 ? '全部职位' : '暂无职位'}
            </Option>
            {validData &&
              validData.length > 0 &&
              validData.map((v) => {
                const { ejid = '', position = '', crtime = '' } = v || {}
                return (
                  <Option key={`header_${ejid}`} value={ejid}>
                    <span>
                      {position}- {crtime.split(' ')[0]}
                    </span>
                  </Option>
                )
              })}
          </Select>
          <Select
            optionFilterProp="children"
            defaultValue={has_oppo || '全部沟通状态'}
            onChange={this.handleCommunicateSyayusChange}
            style={{
              marginTop: 8,
              right: 20,
              position: 'absolute',
              width: 240,
            }}
            virtual={false}
          >
            <Option value="-1">全部沟通状态</Option>
            <Option value="0">未沟通</Option>
            <Option value="1">已沟通</Option>
          </Select>
        </div>
      </div>
    )
  }
}
