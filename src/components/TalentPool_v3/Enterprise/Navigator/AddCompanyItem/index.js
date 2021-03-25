import React from 'react'
import { connect } from 'react-redux'
import { Select, message } from 'antd'
import { InfoCircleFilled } from '@ant-design/icons'
import { Popover } from 'mm-ent-ui'
import * as R from 'ramda'
import styles from './index.less'

@connect((state) => ({
  sugsLoading: state.loading.effects['global/fetchCompanySugs'],
}))
export default class AddCompanyItem extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      status: props.status || 'normal',
      companySugs: [], // 公司下拉列表选项
      searchKey: '', // 当前搜索公司关键词
      company: {}, // 当前选中的公司
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { status } = this.state
    if (nextProps.status !== status) {
      this.setState({
        status: nextProps.status,
      })
    }
  }

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
      },
      this.fetchCompanyStaffNum
    )
  }

  handleAddCompany = () => {
    const { company = {}, searchKey } = this.state
    const { onFetchCompanyGroups = () => {} } = this.props
    message.config({
      top: 70,
      duration: 3,
      maxCount: 2,
    })
    if (!company.name && !searchKey) {
      message.info('公司名称不能为空')
      return
    }
    if (!company.name && searchKey) {
      message.info('请输入正确的公司名称')
      return
    }

    this.setState({
      staffNum: null,
    })
    this.props
      .dispatch({
        type: 'talentPool/addCompanyGroup',
        payload: {
          name: company.name,
          cid: company.cid,
        },
      })
      .then(() => {
        onFetchCompanyGroups()
        this.props.dispatch({ type: 'groups/fetchNav' })
        message.success(`添加成功`)
      })
  }

  handleModifyCompany = (data) => {
    const { onModifyCompany } = this.props
    const { company } = this.state
    this.setState({
      staffNum: null,
    })
    onModifyCompany(data, company)
  }

  handleCancel = (data, type) => {
    const { onCancelAdd } = this.props
    this.setState({
      company: {},
      staffNum: null,
    })
    onCancelAdd(data, type)
  }

  handleSearchCompany = (company) => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.fetchCompanySugs(company)
    }, 500)
  }

  modifyCompany = (data) => {
    const { onModifyIconClick } = this.props
    onModifyIconClick(data)
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

  render() {
    const { status, searchKey, staffNum, company = {} } = this.state
    const title = R.pathOr('', ['props', 'data', 'title'], this)
    const total = R.pathOr('', ['props', 'data', 'total'], this)
    return (
      <div className={styles.addCompanyItem}>
        {status === 'normal' && (
          <div className={`${styles.normalCon}`}>
            <div className={styles.companyName}>{title}</div>
            <div className={styles.companyNum}>{total}人</div>
            {/* <div
              className={styles.modifyIcon}
              onClick={() => {
                this.modifyCompany(this.props.data)
              }}
            >
              <img
                alt="empty"
                src="https://i9.taou.com/maimai/p/24386/7768_53_1Gc2hUKlJRsHdl"
              />
            </div> */}
          </div>
        )}
        {status === 'add' && (
          <div className={`${styles.editCon} flex`}>
            <div className={styles.selectContainer}>
              <Select
                onChange={this.handleCompanyChange}
                placeholder="请输入公司名称"
                onSearch={this.handleSearchCompany}
                // onBlur={this.handleStateChange('showStaffNum', true)}
                filterOption={false}
                className={styles.select}
                notFoundContent={R.isEmpty(searchKey) ? '' : '未找到该公司'}
                loading={this.props.sugsLoading}
                showSearch
                autoFocus
              >
                {this.renderCompanyOptions()}
              </Select>
            </div>
            {!company.name ? (
              <div
                className={styles.comfirmBtn}
                onClick={this.handleAddCompany}
              >
                确认
              </div>
            ) : (
              <Popover.Confirm
                title={
                  <div>
                    <span className="font-size-16">确定关注此公司吗？</span>
                    <span className="color-dilution width-p100 margin-top-8 display-inline-block">
                      添加关注后，公司名不可修改
                    </span>
                  </div>
                }
                trigger="click"
                showIcon={true}
                icon={
                  <InfoCircleFilled className={styles.popoverConfirmIcon} />
                }
                placement="topRight"
                overlayClassName={styles.popoverConfirmOverlay}
                onConfirm={this.handleAddCompany}
              >
                <div className={styles.comfirmBtn}>确认</div>
              </Popover.Confirm>
            )}
            <div
              className={styles.cancelBtn}
              onClick={() => {
                this.setState({
                  staffNum: null,
                })
                this.handleCancel(this.props.data, 'add')
              }}
            >
              取消
            </div>
            {staffNum && staffNum >= 0 ? (
              <span className={styles.staffNumTip}>{staffNum}位员工在脉脉</span>
            ) : (
              <span className={styles.staffNumTip}>0位员工在脉脉</span>
            )}
          </div>
        )}
        {status === 'edit' && (
          <div className={`${styles.editCon} flex`}>
            <div className={styles.selectContainer}>
              <Select
                // value={name || title}
                onChange={this.handleCompanyChange}
                placeholder={title}
                onSearch={this.handleSearchCompany}
                // onBlur={() => {
                //   setTimeout(() => {
                //     console.log(0)
                //     this.setState({
                //       company: {},
                //     })
                //   }, 200)
                // }}
                filterOption={false}
                className={styles.select}
                notFoundContent={R.isEmpty(searchKey) ? '' : '未找到该公司'}
                loading={this.props.sugsLoading}
                showSearch
                autoFocus
              >
                {this.renderCompanyOptions()}
              </Select>
            </div>
            <div
              className={styles.comfirmBtn}
              onClick={() => {
                this.handleModifyCompany(this.props.data)
              }}
            >
              确认
            </div>
            <div
              className={styles.cancelBtn}
              onClick={() => {
                this.handleCancel(this.props.data, 'edit')
              }}
            >
              取消
            </div>
            {(staffNum && staffNum >= 0) || total >= 0 ? (
              <span className={styles.staffNumTip}>
                {staffNum || total}位员工在脉脉
              </span>
            ) : null}
          </div>
        )}
      </div>
    )
  }
}
