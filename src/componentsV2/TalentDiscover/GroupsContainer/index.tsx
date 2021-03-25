import * as React from 'react'
import { connect } from 'react-redux'
import { Modal, Input } from 'antd'
import { setValuesByRange, nFormatter, asyncExtraData } from 'utils'
import { Icon, DrawerNew } from 'mm-ent-ui'
import * as R from 'ramda'

import List from './List'
import EditCustomGroup from './EditCustomGroup'
import EditCompanyFocused from './EditCompanyFocused_v2'
import PanelItem from './PanelItem'
import * as styles from './index.less'

export interface Props {
  groupList: object[]
  currentGroup: object
  currentUser: object
  personalGroupList: object[]
  groupModalVisible: boolean
}

export interface State {
  showEditCompanyGroup: boolean
  showEditCompanyFocus: boolean
  showEditPersonalGroup: boolean
  errorMsg: string
  addGroup: boolean
  editKey: string
  editGroupName: string
  personalGroupList: object[]
  visible: boolean
  hasGotGroupDataWithCount: boolean
}
@connect((state) => ({
  groupList: state.talentDiscover.groupList,
  currentGroup: state.talentDiscover.currentGroup,
  groupModalVisible: state.talentDiscover.groupModalVisible,
  currentUser: state.global.currentUser,
  personalGroupList: state.groups.list,
}))
export default class GroupsContainer extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      showEditCompanyGroup: false,
      showEditCompanyFocus: false,
      showEditPersonalGroup: false,
      errorMsg: '',
      addGroup: false,
      editKey: '',
      editGroupName: '',
      personalGroupList: props.personalGroupList,
      visible: false,
      hasGotGroupDataWithCount: false, // 是否已经获取到带有 total 的分组数据
    }
  }

  componentDidMount() {
    // 性能优化：先去没有 total 字段的分组，渲染面板，再异步获取 带 total 的数据
    this.fetchGroupLists({ has_count: 0 })
    this.fetchGroupLists().then(() => {
      this.setState({ hasGotGroupDataWithCount: true })
    })
    // 以上为性能优化的特殊处理

    window.addEventListener('click', this.handleClickEvents)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.personalGroupList !== this.props.personalGroupList) {
      this.setState({
        personalGroupList: newProps.personalGroupList,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickEvents)
  }

  handleClickEvents = () => {
    this.setState({
      visible: false,
    })
    this.handleCloseGroupModal()
  }

  // 需要关闭因意向回流点击事件而打开的分组面板
  handleCloseGroupModal = () => {
    if (!this.props.groupModalVisible) {
      return
    }
    this.props.dispatch({
      type: 'talentDiscover/setGroupModalVisible',
      payload: false,
    })
  }

  currentInMoreList = () => {
    const { groupList = [], currentGroup } = this.props
    if (!currentGroup || R.isEmpty(currentGroup)) {
      return false
    }
    const moreList = groupList.slice(2)
    const eqFunc = (v) => v.options && R.any(R.equals(currentGroup))(v.options)
    const inMore = R.findIndex(eqFunc)(moreList) > -1
    return inMore
  }

  handleHideEditCompanyGroup = () => {
    this.setState({
      showEditCompanyGroup: false,
    })
  }

  handleShowEditCompanyGroup = () => {
    this.setState({
      showEditCompanyGroup: true,
    })
  }

  handleHideEditCompanyFocus = () => {
    this.setState({
      showEditCompanyFocus: false,
    })
  }

  handleShowEditPersonalGroup = () => {
    this.setState({
      showEditPersonalGroup: true,
    })
  }

  handleEditStatus = (key) => {
    if (key === 'user_group') {
      this.handleShowEditPersonalGroup()
    } else if (key === 'company_group') {
      this.handleShowEditCompanyGroup()
    } else if (key === 'attention') {
      this.handleShowEditCompanyFocus()
    }
  }

  isAdmin = () => R.pathOr(0, ['ucard', 'is_adm'], this.props.currentUser) === 1

  handleShowEditCompanyFocus = () => {
    const remain = R.pathOr(
      0,
      ['talent_lib', 'attention_company_left'],
      this.props.currentUser
    )

    if (!this.isAdmin()) {
      Modal.confirm({
        title: '暂无权限',
        content: '您没有此操作的权限，请联系企业管理员进行此操作。',
        type: 'common',
      })
      return
    }

    if (!(remain > 0)) {
      Modal.confirm({
        title: '添加关注公司',
        content:
          '您的关注企业名额已经达上限，请联系销售专员开通高级服务获得更多名额',
        type: 'common',
      })
      return
    }

    this.setState({
      showEditCompanyFocus: true,
    })
  }

  fetchGroupLists = (param = {}) => {
    return this.props.dispatch({
      type: 'talentDiscover/fetchGroups',
      payload: {
        navigator_type: 3,
        ...param,
      },
    })
  }

  handleResetGroup = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'talentDiscover/setCurrentGroup',
      payload: {},
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  handleCurrentGroupChange = (payload, trackParam) => {
    const { dispatch } = this.props

    dispatch({
      type: 'talentDiscover/setCurrentGroup',
      payload,
      trackParam,
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {
        need_update_cache_time: 1,
      },
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  handleCancelEdit = () => {
    this.setState({
      showEditPersonalGroup: false,
      errorMsg: '',
    })
  }

  parseGroupList = (vals) => {
    if (!vals || vals.length === 0) {
      return []
    }

    const { hasGotGroupDataWithCount } = this.state
    const res = vals.map((items) => {
      // const total = R.sum(R.map(R.propOr(0, 'total'), R.propOr([], 'options', items)))
      const total = R.propOr(0, 'total', items)
      const hideTotal = !hasGotGroupDataWithCount && !total
      return {
        ...items,
        total: hideTotal ? '-' : total,
        formatTotal: hideTotal ? '-' : nFormatter(total, 1),
      }
    })
    return res
  }

  openDrawer = (e) => {
    e.stopPropagation()
    this.setState({
      visible: true,
    })
  }

  closeDrawer = () => {
    this.setState({
      visible: false,
    })
    this.handleCloseGroupModal()
  }

  renderGroupsItem = (list) => {
    const { key, title } = list
    return (
      <List
        key={key || title}
        data={list}
        onChangeCurrentGroup={this.handleCurrentGroupChange}
        onHandleShowEdit={this.handleEditStatus}
        showTotal={this.state.hasGotGroupDataWithCount}
      />
    )
  }

  renderPanelItems = (list) => {
    const { key, title } = list
    return <PanelItem key={key || title} data={list} />
  }

  render() {
    const { groupList = [], currentGroup, groupModalVisible } = this.props
    const clsName = R.propOr('', 'className', this.props)
    const parseList = this.parseGroupList(groupList)
    const selected = !R.isEmpty(currentGroup)
    const selectedText = selected
      ? `已选"${R.propOr('', 'title', currentGroup)}"`
      : ''
    const { hasGotGroupDataWithCount } = this.state
    if (groupList.length === 0) {
      return null
    }
    return (
      <React.Fragment>
        <div className={styles.littlePanel} onClick={this.openDrawer}>
          <div
            className={`${styles.littlePanelHeader} flex flex-column flex-align-center flex-justify-center`}
          >
            <div>储备</div>
            <div>人才</div>
          </div>
          <div className={styles.littlePanelContent}>
            {parseList.map(this.renderPanelItems)}
          </div>
          <div
            className={`${styles.littlePanelBtn} flex flex-column flex-align-center flex-justify-center`}
          >
            <Icon type="arrow-left" className={styles.icon} />
          </div>
        </div>
        <DrawerNew
          placement="right"
          closable={false}
          onClose={this.closeDrawer}
          mask={false}
          visible={this.state.visible || groupModalVisible}
          width={236}
          className={styles.drawerStyle}
          zIndex={11}
        >
          <div
            className={`${styles.groupListHeader} ${
              selected ? styles.selected : ''
            } flex flex-column flex-align-center flex-justify-center`}
          >
            <div className={`${styles.title} flex space-between`}>
              <span>储备人才</span>
              <span>
                {hasGotGroupDataWithCount
                  ? R.sum(R.map(R.propOr(0, 'total'), parseList))
                  : '-'}
              </span>
            </div>
            {selected && (
              <div className={`${styles.currentGroup} flex space-between`}>
                <span
                  className={`${styles.selected} text-ellipsis`}
                  title={selectedText}
                >
                  {selectedText}
                </span>
                <span
                  className={`${styles.reset} cursor-pointer`}
                  onClick={this.handleResetGroup}
                >
                  取消选择
                  <Icon type="delete" className="margin-left-5" />
                </span>
              </div>
            )}
          </div>
          <div
            onClick={this.closeDrawer}
            className={`${styles.groupListFooter} flex flex-column flex-align-center flex-justify-center`}
          >
            <Icon type="arrow-right" className={styles.icon} />
          </div>
          <div
            className={`${styles.groupListWrapper} ${clsName} ${
              selected ? styles.selected : ''
            }  flex flex-column flex-align-start flex-justify-start`}
          >
            {parseList.map(this.renderGroupsItem)}

            {this.state.showEditCompanyFocus && (
              <EditCompanyFocused onCancel={this.handleHideEditCompanyFocus} />
            )}
            {this.state.showEditPersonalGroup && (
              <EditCustomGroup
                type="personal"
                onCancel={this.handleCancelEdit}
                canDelete={this.isAdmin()}
              />
            )}
            {this.state.showEditCompanyGroup && (
              <EditCustomGroup
                type="ent"
                onCancel={this.handleHideEditCompanyGroup}
                canDelete={this.isAdmin()}
              />
            )}
          </div>
        </DrawerNew>
      </React.Fragment>
    )
  }
}
