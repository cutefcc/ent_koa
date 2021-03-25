import React from 'react'
import { connect } from 'react-redux'
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Select, message } from 'antd'
import { Modal, Typography, Button } from 'mm-ent-ui'
import * as R from 'ramda'

import styles from './editCompanyFocused_v2.less'

@connect((state) => ({
  groupList: state.talentPool.companyGroups,
  sugsLoading: state.loading.effects['global/fetchCompanySugs'],
}))
export default class EditEntCustomGroup extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      companySugs: [], // 公司下拉列表选项
      showStaffNum: false, // 是否展示选中公司的员工人数
      searchKey: '', // 当前搜索公司关键词
      confirmFlag: false, // 是否点击确认
      company: {}, // 当前选中的公司
    }
  }

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
  }

  fetchCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  fetchCompanySugs = (keyword) => {
    this.props
      .dispatch({
        type: 'global/fetchCompanySugs',
        payload: {
          keyword,
        },
      })
      .then(({ data }) => {
        this.setState({
          companySugs: (data || []).filter((i) => i.cid > 0),
          searchKey: keyword,
        })
      })
  }

  handleAddGroup = () => {
    const { company = {} } = this.state
    const { onConfirm } = this.props
    this.props
      .dispatch({
        type: 'talentPool/addCompanyGroup',
        payload: {
          name: company.name,
          cid: company.cid,
        },
      })
      .then(() => {
        this.fetchNavigator()
        this.fetchCurrentUser()
        this.props.onCancel()
        message.success(`关注${company.name}成功`)
        onConfirm && onConfirm()
      })
  }

  handleSearchCompany = (company) => {
    this.setState({
      showStaffNum: false,
    })
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.fetchCompanySugs(company)
    }, 500)
  }

  fetchCompanyStaffNum = () => {
    const { company } = this.state
    this.props
      .dispatch({
        type: 'global/fetchCompanyStaffNum',
        payload: {
          cid: company.cid,
        },
      })
      .then(({ data }) => {
        this.setState({
          staffNum: data.total,
        })
      })
  }

  handleCompanyChange = (value) => {
    const [cid, name] = value.split(' ')
    this.setState(
      {
        company: {
          cid,
          name,
        },
        showStaffNum: true,
        confirmFlag: false,
      },
      this.fetchCompanyStaffNum
    )
  }

  handleStateChange = (key, value) => (e) => {
    this.setState({
      [key]: value,
    })
    if (e && e.preventDefault) {
      e.preventDefault()
    }
  }

  renderCompanyOptions = () => {
    const { companySugs } = this.state
    return companySugs.map((item) => (
      <Select.Option
        value={`${item.cid} ${item.name}`}
        key={`${item.cid} ${item.name}`}
      >
        {item.name}
      </Select.Option>
    ))
  }

  renderModal = () => {
    const {
      searchKey,
      staffNum,
      company,
      showStaffNum,
      confirmFlag,
    } = this.state
    return (
      <div className={styles.modalContent}>
        <Typography.Text size="14px" className="display-block">
          建议添加同行或对标公司
        </Typography.Text>
        <div className={styles.selectContainer}>
          <Select
            onChange={this.handleCompanyChange}
            placeholder="输入公司名称"
            onSearch={this.handleSearchCompany}
            onBlur={this.handleStateChange('showStaffNum', true)}
            filterOption={false}
            className={styles.select}
            notFoundContent={R.isEmpty(searchKey) ? '' : '未找到该公司'}
            loading={this.props.sugsLoading}
            showSearch
          >
            {this.renderCompanyOptions()}
          </Select>
          {staffNum > 0 && showStaffNum && (
            <span className={styles.staffNumTip}>{staffNum}位员工在脉脉</span>
          )}
        </div>
        {!R.isEmpty(company) && (
          <div className={styles.confirmContainer} disabled={confirmFlag}>
            <span>
              {confirmFlag ? (
                <CheckCircleOutlined className="color-green" />
              ) : (
                <InfoCircleOutlined />
              )}
              <span className="margin-left-4">
                提交生效后，将不可更改和删除，请确认操作无误。
              </span>
            </span>
            <Button
              onClick={this.handleStateChange('confirmFlag', true)}
              className={styles.confirmButton}
              type="likeLink"
            >
              确认
            </Button>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { company, confirmFlag } = this.state
    return (
      <Modal
        title="添加关注公司"
        visible
        onCancel={this.props.onCancel}
        onOk={this.handleAddGroup}
        okText="提交并生效"
        okButtonProps={{
          disabled: R.isEmpty(company) || !confirmFlag,
        }}
        cancelButtonProps={{
          type: 'ghost',
        }}
        maskClosable={false}
      >
        {this.renderModal()}
      </Modal>
    )
  }
}
