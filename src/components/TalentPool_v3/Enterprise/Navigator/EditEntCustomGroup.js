import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Modal, Input } from 'antd'
import { Icon } from 'mm-ent-ui'
import { ENT_GROUP_UPPER_LIMIT } from 'constants/talentPool'

import styles from './editEntCustomGroup.less'

@connect((state) => ({
  groupList: state.talentPool.customEntGroups,
}))
export default class EditEntCustomGroup extends React.PureComponent {
  static propTypes = {
    currentGroupId: PropTypes.number.isRequired,
    onGroupIdChange: PropTypes.func.isRequired,
    canDelete: PropTypes.bool,
  }

  static defaultProps = {
    canDelete: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      collapse: true,
      editKey: 0,
      editGroupName: '',
      groupList: props.groupList,
      addGroup: false,
      errorMsg: '',
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
      type: 'talentPool/fetchGroups',
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
        editKey: 0,
        editGroupName: '',
      })
    })
  }

  handleConfirmEditGroup = () => {
    if (R.trim(this.state.editGroupName) === '') {
      this.setState({
        errorMsg: '分组名称不能为空',
      })
      return
    }

    const type = this.state.addGroup
      ? 'talentPool/addGroup'
      : 'talentPool/modifyGroup'
    const param = this.state.addGroup
      ? {
          name: this.state.editGroupName,
        }
      : {
          name: this.state.editGroupName,
          id: this.state.editKey,
        }

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
    this.setState({
      editKey: item.id,
      editGroupName: item.title,
      errorMsg: '',
      addGroup: false,
    })
  }

  handleEditGroupNameChange = (e) => {
    this.setState({
      editGroupName: e.target.value,
      errorMsg: '',
    })
  }

  handleCancelEditGroup = () => {
    this.setState({
      editKey: 0,
      editGroupName: '',
      addGroup: false,
      errorMsg: '',
    })
  }

  handleConfirmDeleteGroup = (id) => {
    return this.props
      .dispatch({
        type: 'talentPool/deleteGroup',
        payload: {
          id,
        },
      })
      .then(this.handleEditGroupFinish)
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
      editKey: 0,
      editGroupName: '',
      addGroup: true,
      errorMsg: '',
    })
  }

  renderEditItem = (item) => {
    const editable = !item.id || this.state.editKey === item.id
    return editable
      ? this.renderEditableItem(item)
      : this.renderCommonItem(item)
  }

  renderEditableItem = () => {
    return (
      <p className={styles.editItem}>
        <span className={styles.groupName}>
          <span className="flex-column">
            <Input
              onChange={this.handleEditGroupNameChange}
              value={this.state.editGroupName}
              placeholder="请输入分组名称"
            />
            {this.state.errorMsg && (
              <span className="color-red font-size-12">
                {this.state.errorMsg}
              </span>
            )}
          </span>
        </span>
        <span className={styles.operation}>
          <span onClick={this.handleConfirmEditGroup}>确认</span>
          <span onClick={this.handleCancelEditGroup} className="margin-left-16">
            取消
          </span>
        </span>
      </p>
    )
  }

  renderCommonItem = (item) => {
    return (
      <p className={styles.editItem}>
        <span className={styles.groupName}>
          <span>{item.title}</span>
          <span className="margin-left-8 color-dilution">
            {R.propOr(0, 'total', item)}人
          </span>
        </span>
        <span className={styles.operation}>
          <span onClick={this.handleEditGroup(item)}>
            <Icon type="edit" />
          </span>
          {this.props.canDelete && (
            <span
              onClick={this.handleShowDeleteConfirm(item)}
              className="margin-left-16"
            >
              <Icon type="delete" />
            </span>
          )}
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
        {R.propOr(0, 'length', groupList) < ENT_GROUP_UPPER_LIMIT ? (
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
          提示：分组上限{ENT_GROUP_UPPER_LIMIT}个
        </p>
      </div>
    )
  }

  render() {
    return (
      <Modal
        title="编辑企业人才自定义分组"
        visible
        onCancel={this.props.onCancel}
        footer={null}
      >
        {this.renderEditModal()}
      </Modal>
    )
  }
}
