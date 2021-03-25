import React from 'react'
import { connect } from 'react-redux'
import { Select, message } from 'antd'
import { Modal, Button, Icon } from 'mm-ent-ui'
import AddCompanyItem from './AddCompanyItem'
import * as R from 'ramda'

import styles from './editCompanyFocused_v3.less'

@connect((state) => ({
  groupList: state.talentPool.companyGroups,
  sugsLoading: state.loading.effects['global/fetchCompanySugs'],
  currentUser: state.global.currentUser,
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
      companyArr: [],
      focusCompanyNum: 0, // 关注公司数量
      maxCompanyNum: 0, // 最大关注公司数量
      remainCompanyNum: 0, // 剩余关注公司次数
      addProcess: false,
    }
  }

  componentDidMount() {
    this.fetchCompanyGroups()
    this.handleModiayModalStyle()
  }

  handleModiayModalStyle = () => {
    let antModalBody = null
    setTimeout(() => {
      // eslint-disable-next-line prefer-destructuring
      antModalBody = document.body.getElementsByClassName('ant-modal-body')[0]
      if (antModalBody) {
        antModalBody.style.paddingRight = '0px'
      }
    }, 500)
  }

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
  }

  fetchCompanyGroups = () => {
    const { id } = R.pathOr('', ['props', 'currentUser', 'ucard', 'id'], this)
    this.props
      .dispatch({
        type: 'talentPool/fetchCompanyGroups',
        payload: {
          uid: id,
        },
      })
      .then((data) => {
        const companyArr = R.filter(
          (item) => item.action_code !== 1,
          R.pathOr([], ['data', 'node', 'options'], data)
        )
        const maxCompanyNum = R.pathOr(
          0,
          ['data', 'attention_company_nbr'],
          data
        )
        const remainCompanyNum = maxCompanyNum - companyArr.length
        companyArr.forEach((item) => {
          item.status = 'normal'
        })

        this.setState({
          companyArr,
          focusCompanyNum: companyArr.length,
          maxCompanyNum,
          remainCompanyNum,
          addProcess: false,
        })
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
        if (onConfirm) {
          onConfirm()
        }
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

  handleModifyIconClick = (data) => {
    const { addProcess, companyArr } = this.state

    // if (addProcess) {
    //   companyArr.shift()
    //   companyArr.forEach(item => {
    //     if (item.title !== data.title) {
    //       item.status = 'normal'
    //     } else {
    //       item.status = 'edit'
    //     }
    //   })
    //   this.setState({
    //     companyArr: [...companyArr],
    //     addProcess: false,
    //   })
    // } else {
    //   companyArr.forEach(item => {
    //     if (item.title !== data.title) {
    //       item.status = 'normal'
    //     } else {
    //       item.status = 'edit'
    //     }
    //   })
    //   this.setState({
    //     companyArr: [...companyArr],
    //   })
    // }
    const editProcess = companyArr.find((item) => {
      return item.status === 'edit'
    })

    if (addProcess) {
      message.info('请先处理当前编辑状态')
      this.scrollDom.scrollTop = 0
      return
    }

    if (editProcess) {
      message.info('请先处理当前编辑状态')
      this.scrollDom.scrollTop = 0
      return
    }
    companyArr.forEach((item) => {
      if (item.title !== data.title) {
        item.status = 'normal'
      } else {
        item.status = 'edit'
      }
    })

    this.setState({
      companyArr: [...companyArr],
    })
  }

  handleCancelAdd = (data, type) => {
    const { companyArr } = this.state
    if (type === 'add') {
      companyArr.shift()
      this.setState({
        companyArr: [...companyArr],
        addProcess: false,
      })
    }
    if (type === 'edit') {
      companyArr.forEach((item) => {
        if (item.title === data.title) {
          item.status = 'normal'
        }
      })
      this.setState({
        companyArr: [...companyArr],
      })
    }
  }

  handleAddCompany = () => {
    const { addProcess, companyArr, remainCompanyNum } = this.state
    this.scrollDom.scrollTop = 0
    if (remainCompanyNum <= 0) {
      message.warn(`关注数量已达上限`)
      return
    }
    if (addProcess) {
      message.info(`请先处理当前编辑状态`)
      return
    }
    companyArr.forEach((item) => {
      item.status = 'normal'
    })
    this.setState({
      companyArr: [{ status: 'add' }, ...companyArr],
      addProcess: true,
    })
  }

  // 修改
  handleModifyCompany = (data, newData) => {
    const { companyArr } = this.state
    const companyName = R.pathOr('', ['name'], newData)
    const cid = R.pathOr('', ['cid'], newData)
    const attentionId = R.pathOr(
      '',
      ['post_param', 'sources', '0', 'source_sub_id'],
      data
    )
    companyArr.forEach((item) => {
      item.status = 'normal'
    })
    // 作出了更改
    if (companyName && cid && companyName !== data.title) {
      this.props
        .dispatch({
          type: 'talentPool/modifyCompanyGroup',
          payload: {
            name: companyName,
            cid,
            attention_id: attentionId,
          },
        })
        .then((res) => {
          const { code } = res
          if (code === 0) {
            this.fetchCompanyGroups()
            this.props.dispatch({ type: 'groups/fetchNav' })
          }
        })
    }
    this.setState({
      companyArr: [...companyArr],
    })
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

  renderCompanyList = (item, index) => {
    return (
      <AddCompanyItem
        // eslint-disable-next-line react/no-array-index-key
        key={`addCompanyItem${index}`}
        status={item.status}
        data={item}
        onFetchCompanyGroups={this.fetchCompanyGroups}
        onModifyIconClick={this.handleModifyIconClick}
        onCancelAdd={this.handleCancelAdd}
        onModifyCompany={this.handleModifyCompany}
      />
    )
  }

  renderModal = () => {
    const {
      maxCompanyNum,
      companyArr,
      addProcess,
      focusCompanyNum,
    } = this.state
    return (
      <div className={styles.modalContent}>
        <div className={styles.subTitle}>
          <div>{`当前会员版本可关注${maxCompanyNum}家公司，如需扩容请联系管理员升级`}</div>
          <div>{`${focusCompanyNum}/${maxCompanyNum}`}</div>
        </div>
        {!addProcess && (
          <div className={styles.addCompanys} onClick={this.handleAddCompany}>
            <div className={styles.addCompanysDiv}>
              <Icon type="close-outline" className={styles.addCompanyIcon} />
            </div>
            添加关注公司
          </div>
        )}
        <div
          className={styles.companyListCon}
          ref={(node) => {
            this.scrollDom = node
          }}
          style={{ maxHeight: addProcess ? '392px' : '352px' }}
        >
          {companyArr.map(this.renderCompanyList)}
        </div>
      </div>
    )
  }

  render() {
    const { company, confirmFlag } = this.state
    return (
      <Modal
        width={560}
        title="编辑关注公司"
        visible
        onCancel={this.props.onCancel}
        // footer={[
        //   <div
        //     className={styles.addCompany}
        //     key="addCompany"
        //     onClick={this.handleAddCompany}
        //   >
        //     <Icon type="close-outline" className={styles.addCompanyIcon} />添加关注公司
        //   </div>,
        // ]}
        footer={null}
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
