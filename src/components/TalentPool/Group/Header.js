import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import * as R from 'ramda'
import { Modal, Input } from 'antd'
import { Icon } from 'mm-ent-ui'
import { setValuesByRange } from 'utils'
import { GROUP_UPPER_LIMIT } from 'constants'
import { GROUP_NAME_MAX_LEN } from 'constants/talentPool'

import styles from './header.less'

@connect((state) => ({
  groupList: state.groups.list,
}))
export default class Header extends React.PureComponent {
  static propTypes = {
    currentGroupId: PropTypes.number.isRequired,
    onGroupIdChange: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      collapse: true,
      showEditModal: false,
      editKey: 0,
      editGroupName: '',
      groupList: props.groupList,
      addGroup: false,
      errorMsg: '',
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
    this.props.dispatch({
      type: 'groups/fetch',
    })
  }

  handleGroupIdChange = (groupId) => () => {
    this.props.onGroupIdChange(groupId)
  }

  handleEdit = () => {
    this.setState({
      showEditModal: true,
    })
  }

  handleCancelEdit = () => {
    this.setState({
      showEditModal: false,
      errorMsg: '',
    })
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

  handleAddGroupFinish = (data) => {
    this.fetchGroupList()
    this.setState({
      addGroup: false,
    })
    if (!this.props.currentGroupId) {
      this.props.onGroupIdChange(data.id)
    }
  }

  handleEditGroupFinish = () => {
    this.setState({
      groupList: setValuesByRange(
        this.state.groupList,
        { name: this.state.editGroupName },
        'id',
        [this.state.editKey]
      ),
      editKey: 0,
      editGroupName: '',
    })
  }

  handleConfirmEditGroup = () => {
    const { editGroupName = '', addGroup, editKey } = this.state
    const hasRepeatName = this.state.groupList
      .filter((item) => item.id !== this.state.editKey)
      .map(R.prop('name'))
      .includes(editGroupName)

    if (hasRepeatName) {
      this.setState({
        errorMsg: '分组名称不能重复',
      })
      return
    }

    if (R.trim(editGroupName) === '') {
      this.setState({
        errorMsg: '分组名称不能为空',
      })
      return
    }

    if (editGroupName.length > GROUP_NAME_MAX_LEN) {
      this.setState({
        errorMsg: `分组名称长度不能超过${GROUP_NAME_MAX_LEN}`,
      })
      return
    }

    const type = addGroup ? 'groups/add' : 'groups/edit'
    const param = addGroup
      ? {
          group_name: editGroupName,
        }
      : {
          group_name: editGroupName,
          group_id: editKey,
        }

    this.props
      .dispatch({
        type,
        payload: param,
      })
      .then(({ data }) => {
        if (addGroup) {
          this.handleAddGroupFinish(data)
          return
        }
        this.handleEditGroupFinish()
      })
  }

  handleEditGroup = (item) => () => {
    this.setState({
      editKey: item.id,
      editGroupName: item.name,
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
        type: 'groups/delete',
        payload: {
          group_id: id,
        },
      })
      .then(() => {
        const groupList = this.state.groupList.filter((item) => item.id !== id)
        this.setState({
          groupList,
        })
        if (this.props.currentGroupId === id) {
          const currentGroupId = R.pathOr(0, [0, 'id'], groupList)
          this.props.onGroupIdChange(currentGroupId)
        }
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

  renderGroupItem = (item) => {
    return (
      <span
        className={classnames({
          [styles.item]: true,
          [styles.activeItem]: item.id === this.props.currentGroupId,
        })}
        onClick={this.handleGroupIdChange(item.id)}
        key={item.id}
      >
        {item.name}
        <span className="margin-left-8">{item.talents_num}</span>
      </span>
    )
  }

  renderGroups = () => {
    const { collapse, groupList } = this.state
    return (
      <div
        className={`${styles.groups} ${collapse ? styles.collapseGroup : ''}`}
      >
        <div className={styles.groupList}>
          {groupList.map(this.renderGroupItem)}
        </div>
        <div className={styles.operation}>
          <span
            className={classnames({
              [styles.collapse]: collapse,
              [styles.unCollapse]: !collapse,
              [styles.collapseButton]: true,
            })}
            onClick={this.handleCollapseChange}
          >
            {collapse ? '展开' : '收起'}
            <Icon type={collapse ? 'down' : 'up'} className="margin-left-8" />
          </span>
          <span onClick={this.handleEdit} className={styles.editButton}>
            编辑
          </span>
        </div>
      </div>
    )
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
                placeholder={`分组名称，最多输入${GROUP_NAME_MAX_LEN}个字符`}
              />
              {this.state.errorMsg && (
                <span className="color-red font-size-12">
                  {this.state.errorMsg}
                </span>
              )}
            </span>
          ) : (
            <span>
              <span>{item.name}</span>
              <span className="margin-left-8 color-dilution">
                {R.propOr(0, 'talents_num', item)}人
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
        {R.propOr(0, 'length', groupList) < GROUP_UPPER_LIMIT ? (
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
          提示：分组上限{GROUP_UPPER_LIMIT}个，每个分组人数上限100人
        </p>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        <div>{this.renderGroups()}</div>
        <Modal
          title="编辑分组"
          visible={this.state.showEditModal}
          onCancel={this.handleCancelEdit}
          footer={null}
        >
          {this.renderEditModal()}
        </Modal>
      </div>
    )
  }
}
