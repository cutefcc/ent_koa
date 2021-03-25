import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Modal, Input } from 'antd'
//import { Icon } from 'mm-ent-ui'
import {
  GROUP_UPPER_LIMIT,
  GROUP_NUM_CAP,
  ENT_GROUP_NUM_CAP,
  GROUP_NAME_MAX_LEN,
} from 'constants/talentPool'

import * as styles from './editCustomGroup.less'

export interface Props {
  type: string
  canDelete: boolean
  onCancel: Function
  entGroupMax: number
}

export interface State {
  editKey: number
  editGroupName: string
  groupList: object[]
  addGroup: boolean
  errorMsg: string
  isEnt: boolean
  editionThree: boolean
  groupCondition: object
}

@connect((state) => ({
  entGroupList: state.groups.entGroups,
  personalGroupList: state.groups.list,
  currentGroup: state.talentDiscover.currentGroup,
  entGroupMax: state.groups.entGroupMax,
}))
export default class EditCustomGroup extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    const { currentUser = {} } = props
    const { identity = 0 } = currentUser
    this.state = {
      // true是v3
      editionThree:
        identity === 6 || window.location.pathname.indexOf('v3') !== -1,
      groupCondition: {},
      editKey: 0,
      editGroupName: '',
      groupList: props[`${props.type}GroupList`] || [],
      addGroup: false,
      errorMsg: '',
      isEnt: props.type === 'ent',
    }
  }

  componentDidMount() {
    if (
      R.propOr(0, 'length', this.props[`${this.props.type}GroupList`]) === 0
    ) {
      this.fetchGroupList()
    }
    this.handleGroupConditions()
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps[`${this.props.type}GroupList`] !==
      this.props[`${this.props.type}GroupList`]
    ) {
      this.setState({
        groupList: newProps[`${this.props.type}GroupList`],
      })
    }
  }

  // 自定义分组数据
  fetchGroupList = () => {
    const url = {
      personal: 'groups/fetch',
      ent: 'groups/fetchEntGroups',
    }
    return this.props.dispatch(
      this.props.type === 'personal'
        ? {
            type: url[this.props.type],
            payload: { editionThree: this.state.editionThree },
          }
        : {
            type: url[this.props.type],
          }
    )
  }

  // 右侧导航分组数据
  fetchGroups = () => {
    this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
      payload: {
        navigator_type: 3,
      },
    })
  }

  // 开始新增
  startAddGroup = () => {
    this.setState({
      editKey: 0,
      editGroupName: '',
      addGroup: true,
      errorMsg: '',
    })
  }

  // 开始编辑
  startEditGroup = (item) => () => {
    const name = item.title || item.name
    this.setState({
      editKey: item.id,
      editGroupName: name.slice(0, GROUP_NAME_MAX_LEN),
      errorMsg: '',
      addGroup: false,
    })
  }

  // 编辑中
  handleEditGroupChange = (e) => {
    this.setState({
      editGroupName: e.target.value,
      errorMsg: '',
    })
  }

  // 编辑确认
  handleConfirmEditGroup = () => {
    const {
      groupList,
      editGroupName = '',
      addGroup,
      editKey,
      isEnt,
    } = this.state
    const hasRepeatName = groupList
      .filter((item) => item.id !== editKey)
      .map(R.prop(isEnt ? 'title' : 'name'))
      .includes(editGroupName)

    if (hasRepeatName) {
      this.setState({
        errorMsg: '分组名不能重复',
      })
      return
    }

    if (R.trim(editGroupName) === '') {
      this.setState({
        errorMsg: '分组名不能为空',
      })
      return
    }
    let type = '',
      param = {}
    if (isEnt) {
      type = addGroup ? 'groups/addEnt' : 'groups/modifyEnt'
      param = addGroup
        ? {
            name: editGroupName,
          }
        : {
            name: editGroupName,
            id: editKey,
          }
    } else {
      type = addGroup ? 'groups/add' : 'groups/edit'
      param = addGroup
        ? {
            name: editGroupName,
          }
        : {
            name: editGroupName,
            group_id: editKey,
          }
    }

    this.props
      .dispatch({
        type,
        payload: param,
      })
      .then(({ data }) => {
        if (addGroup) {
          this.onAddGroupFinish()
          return
        }
        this.onEditGroupFinish()
      })
  }

  // 取消编辑
  handleCancelEditGroup = () => {
    this.setState({
      editKey: 0,
      editGroupName: '',
      addGroup: false,
      errorMsg: '',
    })
  }

  // 新增完成
  onAddGroupFinish = () => {
    this.fetchGroupList()
    this.fetchGroups()
    this.setState({
      addGroup: false,
    })
  }
  // 储备人数限制，分组数目限制
  handleGroupConditions = () => {
    const url = {
      personal: 'groups/fetch',
      ent: 'groups/fetchEntGroups',
    }
    this.props
      .dispatch(
        this.props.type === 'personal'
          ? {
              type: url[this.props.type],
              payload: { editionThree: this.state.editionThree },
            }
          : {
              type: url[this.props.type],
            }
      )
      .then((res) => {
        if (this.props.type === 'personal') {
          this.setState({
            groupCondition: {
              group_max: res.group_max,
              person_max: res.person_max,
            },
          })
        } else {
          this.setState({
            groupCondition: {
              group_max: res.data.group_max,
              person_max: res.data.person_max,
            },
          })
        }
      })
  }
  // 编辑完成
  onEditGroupFinish = () => {
    this.fetchGroups()
    this.fetchGroupList().then(() => {
      this.setState({
        editKey: 0,
        editGroupName: '',
      })
    })
  }

  // 询问删除
  handleShowDeleteConfirm = (item) => () => {
    Modal.confirm({
      icon: <LegacyIcon type={null} />,
      content: (
        <div>
          <p className="color-stress font-weight-bold font-size-16">
            确认删除分组吗？
          </p>
          <p className="color-dilution">删除分组将清空组内成员</p>
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

  // 确认删除
  handleConfirmDeleteGroup = (id) => {
    const url = {
      personal: 'groups/delete',
      ent: 'groups/deleteEnt',
    }
    const params = {
      personal: { group_id: id },
      ent: { id },
    }
    return this.props
      .dispatch({
        type: url[this.props.type],
        payload: params[this.props.type],
      })
      .then(() => {
        this.onEditGroupFinish()
        // 删除的分组为当前选中分组，则取消选中
        const { post_param = {} } = this.props.currentGroup
        const currentId =
          post_param.sources && post_param.sources[0].source_sub_id
        if (id == currentId) {
          this.handleResetGroup()
        }
      })
  }

  handleResetGroup = () => {
    this.props.dispatch({
      type: 'talentDiscover/setCurrentGroup',
      payload: {},
    })
    this.props.dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    })
  }

  renderEditItem = (item) => {
    const editable = !item.id || this.state.editKey === item.id
    return editable
      ? this.renderEditableItem(item)
      : this.renderCommonItem(item)
  }

  renderEditableItem = (item) => {
    return (
      <p className={styles.editItem} key={item.id}>
        <span className={styles.groupName}>
          <span className="flex-column">
            <Input
              onChange={this.handleEditGroupChange}
              value={this.state.editGroupName}
              maxLength={GROUP_NAME_MAX_LEN}
              placeholder="请输入分组名"
              suffix={`${this.state.editGroupName.length}/${GROUP_NAME_MAX_LEN}`}
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
    const total = this.props.type === 'ent' ? 'total' : 'talents_num'
    return (
      <p className={styles.editItem} key={item.id}>
        <span className={styles.groupName}>
          <span>{item.title || item.name || '-'}</span>
          <span className="margin-left-8 color-dilution">
            {R.propOr(0, total, item)}人
          </span>
        </span>
        <span className={styles.operation}>
          <span onClick={this.startEditGroup(item)}>
            <LegacyIcon type="edit" />
            {/* <Icon type="edit" />*/}
          </span>
          {(!this.state.isEnt || this.props.canDelete) && (
            <span
              onClick={this.handleShowDeleteConfirm(item)}
              className="margin-left-16"
            >
              <LegacyIcon type="delete" />
              {/*  <Icon type="delete" />*/}
            </span>
          )}
        </span>
      </p>
    )
  }

  renderAddGroup = () => {
    const { addGroup, groupList, isEnt } = this.state
    if (addGroup) {
      return <p className={styles.addGroup}>{this.renderEditItem({})}</p>
    }
    const max = isEnt
      ? {
          group: this.state.editionThree
            ? this.state.groupCondition.group_max
            : this.props.entGroupMax,
          cap: this.state.editionThree
            ? this.state.groupCondition.person_max
            : ENT_GROUP_NUM_CAP,
        }
      : {
          group: this.state.editionThree
            ? this.state.groupCondition.group_max
            : GROUP_UPPER_LIMIT,
          cap: this.state.editionThree
            ? this.state.groupCondition.person_max
            : GROUP_NUM_CAP,
        }
    // console.log('group_max', max.group)
    // console.log('person_max', max.cap)
    return this.state.editionThree ? (
      <p className={styles.addGroup}>
        {R.propOr(0, 'length', groupList) <= max.group ? (
          <span className="cursor-pointer" onClick={this.startAddGroup}>
            <span className="font-weight-bold font-size-14">+新建分组</span>
            <span className="color-dilution font-size-12">
              （分组名不能重复，分组数最多{max.group}个，总储备人才上限{max.cap}
              人）
            </span>
          </span>
        ) : (
          <span className="color-dilution font-size-12">
            您的分组数量已达上限，不能创建新的分组
          </span>
        )}
      </p>
    ) : (
      <p className={styles.addGroup}>
        {R.propOr(0, 'length', groupList) < max.group ? (
          <span className="cursor-pointer" onClick={this.startAddGroup}>
            <span className="font-weight-bold font-size-14">+新建分组</span>
            <span className="color-dilution font-size-12">
              （分组名不能重复，分组数最多{max.group}个，每个分组人数上限
              {max.cap}人）
            </span>
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
        <div className={styles.groupWrap}>
          {this.state.groupList.map(this.renderEditItem)}
        </div>
        {this.renderAddGroup()}
      </div>
    )
  }

  render() {
    const { type, onCancel } = this.props
    const title = {
      personal: '个人人才分组',
      ent: '企业人才分组',
    }
    return (
      <Modal
        title={title[type]}
        visible
        onCancel={onCancel}
        footer={null}
        className={`${styles.modalWrap}`}
      >
        {this.renderEditModal()}
      </Modal>
    )
  }
}
