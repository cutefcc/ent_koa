import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Modal, Input } from 'antd'
import {
  ENT_GROUP_NAME_MAX_LEN,
  ENT_GROUP_NUM_CAP,
  ENT_GROUP_UPPER_LIMIT,
} from 'constants/talentPool'

import styles from './editEntCustomGroup.less'

@connect((state) => ({
  groupList: state.talentPool.customEntGroups,
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
    this.setState({
      addGroup: false,
    })
  }

  handleEditGroupFinish = () => {
    // const groupList = setValuesByRange(
    //   this.state.groupList,
    //   {title: this.state.editGroupName},
    //   'id',
    //   [this.state.editKey]
    // )
    // this.setState({
    //   groupList,
    //   editKey: 0,
    //   editGroupName: '',
    // })
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

    if (this.state.editGroupName.length > ENT_GROUP_NAME_MAX_LEN) {
      this.setState({
        errorMsg: `分组名称长度不能大于${ENT_GROUP_NAME_MAX_LEN}`,
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
      .then(() => {
        // const groupList = this.state.groupList.filter(item => item.id !== id)
        // this.setState({
        //   groupList,
        // })
        // if (this.props.currentGroupId === id) {
        //   const currentGroupId = R.pathOr(0, [0, 'id'], groupList)
        //   this.props.onGroupIdChange(currentGroupId)
        // }
        this.fetchGroupList()
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
      editKey: 0,
      editGroupName: '',
      addGroup: true,
      errorMsg: '',
    })
  }

  renderEditItem = (item) => {
    const editable = !item.id || this.state.editKey === item.id
    return (
      <p className={styles.editItem}>
        <span className={styles.groupName}>
          {editable ? (
            <span className="flex-column">
              <Input
                onChange={this.handleEditGroupNameChange}
                value={this.state.editGroupName}
                placeholder={`分组名称，最大长度${ENT_GROUP_NAME_MAX_LEN}`}
              />
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
                <EditOutlined />
              </span>
            )}
          </span>
          <span className="margin-left-16">
            {editable ? (
              <span onClick={this.handleCancelEditGroup}>取消</span>
            ) : (
              <span onClick={this.handleShowDeleteConfirm(item)}>
                <DeleteOutlined />
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
        {R.propOr(0, 'length', groupList) < ENT_GROUP_UPPER_LIMIT ? (
          <span className="cursor-pointer" onClick={this.handleAddGroup}>
            <span className="font-weight-bold font-size-16">新建分组</span>
            <PlusOutlined className="margin-left-8" />
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
          提示：分组上限{ENT_GROUP_UPPER_LIMIT}个,每个分组最多添加
          {ENT_GROUP_NUM_CAP}人
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
