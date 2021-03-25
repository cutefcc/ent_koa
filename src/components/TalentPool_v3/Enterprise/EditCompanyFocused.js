import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Modal, Select } from 'antd'
import { Icon } from 'mm-ent-ui'
import { ENT_COMPANYG_ROUP_UPPER_LIMIT } from 'constants/talentPool'

import styles from './editEntCustomGroup.less'

@connect((state) => ({
  groupList: state.talentPool.companyGroups,
}))
export default class EditEntCustomGroup extends React.PureComponent {
  static propTypes = {
    currentGroupId: PropTypes.number.isRequired,
    onGroupIdChange: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      collapse: true,
      groupList: props.groupList,
      addGroup: false,
      errorMsg: '',
      companySugs: [],
      editItem: {},
    }
  }

  componentDidMount() {
    if (R.propOr(0, 'length', this.props.groupList) === 0) {
      this.fetchGroupList()
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.groupList !== this.props.groupList) {
      this.setState({
        groupList: newProps.groupList,
      })
    }
  }

  fetchGroupList = () => {
    return this.props.dispatch({
      type: 'talentPool/fetchCompanyGroups',
    })
  }

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
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
          companySugs: data || [],
        })
      })
  }

  handleGroupIdChange = (groupId) => () => {
    this.props.onGroupIdChange(groupId)
  }

  handleCollapseChange = () => {
    if (!this.state.collapse && this.props.currentGroupId) {
      const index = R.findIndex(
        R.propEq('id', this.props.currentGroupId),
        this.state.groupList
      )
      const currentGroup = this.state.groupList[index]
      if (index !== -1) {
        this.setState({
          groupList: R.compose(
            R.insert(0, currentGroup),
            R.remove(index, 1)
          )(this.state.groupList),
          collapse: !this.state.collapse,
        })
      }
    }
    this.setState({
      collapse: !this.state.collapse,
    })
  }

  handleAddGroupFinish = () => {
    this.fetchGroupList()
    this.fetchNavigator()
    this.setState({
      addGroup: false,
    })
  }

  handleEditGroupFinish = () => {
    this.fetchNavigator()
    this.fetchGroupList().then(() => {
      this.setState({
        // editKey: -1,
        // editGroupName: '',
        editItem: {},
      })
    })
  }

  handleConfirmEditGroup = () => {
    // const hasRepeatName = this.state.groupList
    //   .filter(item => item.id !== this.state.editKey)
    //   .map(R.prop('name'))
    //   .includes(this.state.editItem.name)

    // if (hasRepeatName) {
    //   this.setState({
    //     errorMsg: '分组名称不能重复',
    //   })
    //   return
    // }
    const param = this.state.editItem
    if (R.trim(param.name) === '') {
      this.setState({
        errorMsg: '不能添加空的分组',
      })
      return
    }
    const type = this.state.addGroup
      ? 'talentPool/addCompanyGroup'
      : 'talentPool/modifyCompanyGroup'
    // const param = this.state.addGroup
    //   ? {
    //       name: this.state.editGroupName,
    //       cid: this.state.editKey,
    //     }
    //   : {
    //       name: this.state.editGroupName,
    //       cid: this.state.editKey,
    //       id: this.state.editKey,
    //     }

    this.props
      .dispatch({
        type,
        payload: param,
      })
      .then(({ data }) => {
        if (this.state.addGroup) {
          this.handleAddGroupFinish(data)
          return
        }
        this.handleEditGroupFinish()
      })
  }

  handleEditGroup = (item) => () => {
    // this.setState({
    //   editKey: item.cid,
    //   editGroupName: item.name,
    //   errorMsg: '',
    //   addGroup: false,
    // })
    this.setState({
      editItem: {
        id: item.id,
        name: item.title,
        cid: item.cid,
      },
      errorMsg: '',
      addGroup: false,
    })
  }

  handleEditGroupNameChange = (value) => {
    // this.setState({
    //   editGroupName: e.target.value,
    //   errorMsg: '',
    // })
    const editItem = {
      ...this.state.editItem,
      cid: R.propOr(0, 0, value.split('-')),
      name: R.propOr('', 1, value.split('-')),
    }
    this.setState({
      editItem,
      errorMsg: '',
    })
  }

  handleCancelEditGroup = () => {
    this.setState({
      addGroup: false,
      errorMsg: '',
      editItem: {},
    })
  }

  handleConfirmDeleteGroup = (id) => {
    return this.props
      .dispatch({
        type: 'talentPool/deleteCompanyGroup',
        payload: {
          id,
        },
      })
      .then(() => {
        // const groupList = this.state.groupList.filter(item => item.id !== id)
        // this.setState({
        //   groupList,
        // })
        this.fetchGroupList()
        // if (this.props.currentGroupId === id) {
        //   const currentGroupId = R.pathOr(0, [0, 'id'], groupList)
        //   this.props.onGroupIdChange(currentGroupId)
        // }
      })
  }

  handleShowDeleteConfirm = (item) => () => {
    Modal.confirm({
      content: (
        <div>
          <p className="color-stress font-weight-bold font-size-16 text-center">
            确认删除分组
            <span className="color-orange font-bold fonr-size-16">
              {item.name}
            </span>
            吗？
          </p>
          <p className="color-dilution text-center">删除分组将清空组内成员</p>
        </div>
      ),
      className: styles.deleteComfirmModal,
      onOk: () => {
        return this.handleConfirmDeleteGroup(item.id)
      },
      okText: '删除',
      cancelText: '取消',
    })
  }

  handleAddGroup = () => {
    this.setState({
      addGroup: true,
      errorMsg: '',
      editItem: {
        name: '',
        cid: '',
      },
    })
  }

  handleCompanyChange = (keyword) => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.fetchCompanySugs(keyword)
    }, 500)
  }

  renderCompanyOptions = () => {
    const { companySugs } = this.state
    return companySugs.map((item) => (
      <Select.Option
        value={`${item.cid}-${item.name}`}
        key={`${item.cid}-${item.name}`}
      >
        {item.name}
      </Select.Option>
    ))
  }

  renderEditItem = (item) => {
    const { editItem } = this.state
    const editable = item.id === undefined || editItem.id === item.id
    return (
      <p className={styles.editItem}>
        <span className={styles.groupName}>
          {editable ? (
            <span className="flex-column">
              <Select
                onChange={this.handleEditGroupNameChange}
                // value={
                //   editItem.cid ? `${editItem.cid}-${editItem.name}` : undefined
                // }
                value={editItem.name}
                placeholder="请输入分组名称"
                onSearch={this.handleCompanyChange}
                filterOption={false}
                showSearch
              >
                {this.renderCompanyOptions()}
              </Select>
              {this.state.errorMsg && (
                <span className="color-red font-size-12">
                  {this.state.errorMsg}
                </span>
              )}
            </span>
          ) : (
            <span>
              <span>{item.title}</span>
              <span className="margin-left-8 color-dilution">
                {R.propOr(0, 'total', item)}人
              </span>
            </span>
          )}
        </span>
        <span className={styles.operation}>
          <span>
            {editable ? (
              <span onClick={this.handleConfirmEditGroup}>确认</span>
            ) : (
              <span onClick={this.handleEditGroup(item)}>
                <Icon type="edit" />
              </span>
            )}
          </span>
          <span className="margin-left-16">
            {editable ? (
              <span onClick={this.handleCancelEditGroup}>取消</span>
            ) : (
              <span onClick={this.handleShowDeleteConfirm(item)}>
                <Icon type="delete" />
              </span>
            )}
          </span>
        </span>
      </p>
    )
  }

  renderAddGroup = () => {
    const { addGroup, groupList } = this.state
    if (addGroup) {
      return this.renderEditItem({})
    }
    return (
      <p className={styles.addGroup}>
        {R.propOr(0, 'length', groupList) < ENT_COMPANYG_ROUP_UPPER_LIMIT ? (
          <span className="cursor-pointer" onClick={this.handleAddGroup}>
            <span className="font-weight-bold font-size-16">新建分组</span>
            <Icon type="plus" className="margin-left-8" />
          </span>
        ) : (
          <span className="color-dilution font-size-12">
            您的分组数量已达上限，不能创建新的分组
          </span>
        )}
      </p>
    )
  }

  renderEditModal = () => {
    return (
      <div className={styles.modal}>
        {this.state.groupList.map(this.renderEditItem)}
        {this.renderAddGroup()}
        <p className="color-dilution font-size-12 margin-top-24">
          提示：分组名称不能重复，分组上限{ENT_COMPANYG_ROUP_UPPER_LIMIT}个
        </p>
      </div>
    )
  }

  render() {
    return (
      <Modal
        title="编辑企业人才公司分组"
        visible
        onCancel={this.props.onCancel}
        footer={null}
      >
        {this.renderEditModal()}
      </Modal>
    )
  }
}
