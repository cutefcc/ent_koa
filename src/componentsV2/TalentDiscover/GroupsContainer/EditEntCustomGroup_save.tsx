import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Modal, Input } from 'antd'
import { Icon } from 'mm-ent-ui'
import { ENT_GROUP_UPPER_LIMIT, ENT_GROUP_NUM_CAP } from 'constants/talentPool'

import * as styles from './editCustomGroup.less'

export interface Props {
  groupList: object[]
  currentGroupId: number
  onGroupIdChange: Function
  canDelete: boolean
}

export interface State {
  collapse: boolean
  editKey: number
  editGroupName: string
  groupList: object[]
  addGroup: boolean
  errorMsg: string
}

@connect((state) => ({
  groupList: state.talentDiscover.customEntGroups,
}))
export default class EditEntCustomGroup extends React.PureComponent<
  Props,
  State
> {
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
      type: 'groups/fetchEntGroups',
    })
  }

  fetchGroups = () => {
    this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
      payload: {
        navigator_type: 3,
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
    this.fetchGroups()
    this.setState({
      addGroup: false,
    })
  }

  handleEditGroupFinish = () => {
    this.fetchGroups()
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
        errorMsg: '????????????????????????',
      })
      return
    }

    const type = this.state.addGroup
      ? 'talentDiscover/addGroup'
      : 'talentDiscover/modifyGroup'
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
        type: 'talentDiscover/deleteGroup',
        payload: {
          id,
        },
      })
      .then(this.handleEditGroupFinish)
  }

  handleShowDeleteConfirm = (item) => () => {
    Modal.confirm({
      icon: <LegacyIcon type={null} />,
      content: (
        <div>
          <p className="color-stress font-weight-bold font-size-16">
            ????????????????????????
          </p>
          <p className="color-dilution">?????????????????????????????????</p>
        </div>
      ),
      className: styles.deleteComfirmModal,
      onOk: () => {
        return this.handleConfirmDeleteGroup(item.id)
      },
      okText: '??????',
      cancelText: '??????',
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
              placeholder="??????????????????"
            />
            {this.state.errorMsg && (
              <span className="color-red font-size-12">
                {this.state.errorMsg}
              </span>
            )}
          </span>
        </span>
        <span className={styles.operation}>
          <span onClick={this.handleConfirmEditGroup}>??????</span>
          <span onClick={this.handleCancelEditGroup} className="margin-left-16">
            ??????
          </span>
        </span>
      </p>
    )
  }

  renderCommonItem = (item) => {
    return (
      <p className={styles.editItem}>
        <span className={styles.groupName}>
          <span>{item.title || '-'}</span>
          <span className="margin-left-8 color-dilution">
            {R.propOr(0, 'total', item)}???
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
            <span className="font-weight-bold font-size-14">+????????????</span>
            <span className="color-dilution font-size-12">
              ??????????????????????????????????????????{ENT_GROUP_UPPER_LIMIT}
              ??????????????????????????????{ENT_GROUP_NUM_CAP}??????
            </span>
          </span>
        ) : (
          <span className="color-dilution font-size-12">
            ?????????????????????????????????????????????????????????
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
      </div>
    )
  }

  render() {
    return (
      <Modal
        title="??????????????????"
        visible
        onCancel={this.props.onCancel}
        footer={null}
      >
        {this.renderEditModal()}
      </Modal>
    )
  }
}
