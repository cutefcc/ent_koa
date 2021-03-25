import React from 'react'
import { message, Modal, Popover } from 'antd'
import { Button, GroupUi } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import styles from './index.less'
import { asyncExtraData } from 'utils'

@connect((state) => ({
  personalGroup: state.groups.list,
  entGroup: state.groups.entGroups,
  currentGroup: state.talentDiscover.currentGroup,
}))
@withRouter
export default class GroupButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    trackParam: PropTypes.object,
    showPop: PropTypes.bool,
    onOk: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    disabled: false,
    className: '',
    trackParam: {},
    showPop: false,
    onOk: () => {},
    children: null,
  }

  state = {
    showGroupModal: false,
    isEditMode: false,
    personalGroupChecked: [],
    entGroupChecked: [],
    // true是v3
    editionThree: window.location.pathname.indexOf('v3') !== -1,
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }

    // this.fetchEntGroupList()
    // this.fetchPersonalGroupList()
  }

  // 获取当前人才所在分组
  fetchTalentGroup = (uid2) => {
    this.props
      .dispatch({
        type: 'groups/fetchTalentGroups',
        payload: {
          uid: window.uid,
          uid2,
        },
      })
      .then(({ data = {} }) => {
        const { user_group = {}, mbr_group = {} } = data
        const getIds = (list = []) => {
          return list.filter((l) => l.selected).map(R.prop('id'))
        }
        const defaultGroups = getIds(user_group.list).concat(
          getIds(mbr_group.list)
        )
        this.setState({
          personalGroupChecked: getIds(user_group.list),
          entGroupChecked: getIds(mbr_group.list),
          isEditMode: defaultGroups.length > 0,
          showGroupModal: true,
        })
      })
  }

  fetchPersonalGroupList = () => {
    this.props.dispatch({
      type: 'groups/fetch',
      payload: { editionThree: this.state.editionThree },
    })
  }

  fetchEntGroupList = () => {
    this.props.dispatch({
      type: 'groups/fetchEntGroups',
    })
  }
  // 右侧导航分组数据
  fetchNavigator = () => {
    const fetch = () =>
      this.props.dispatch({
        type: 'talentDiscover/fetchGroups',
        payload: {
          navigator_type: 3,
        },
      })

    /**
     * because add talent to group is async in backend
     * the delay time is not sure
     * so front end should fetch data twice to ensure group num is consistent with the actual situation
     */
    setTimeout(fetch, 2000)
    setTimeout(fetch, 5000)
  }

  fetchTableData = () => {
    const selected = !R.isEmpty(this.props.currentGroup)
    if (selected) {
      setTimeout(() => {
        const { dispatch } = this.props
        dispatch({
          type: 'talentDiscover/fetchData',
          payload: {},
        }).then((data) => {
          if (data) {
            const { list = [] } = data
            asyncExtraData(dispatch, list)
          }
        })
      }, 4000)
    }
  }

  handleSubmitGroup = () => {
    const talentIds = this.props.talents.map(R.prop('id'))
    const { personalGroupChecked, entGroupChecked, isEditMode } = this.state
    if (
      !personalGroupChecked.length &&
      !entGroupChecked.length &&
      !isEditMode
    ) {
      message.info('请选择分组')
      return
    }
    // 打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: talentIds.join(','),
      }
      const key = 'jobs_pc_talent_addtp_confirm'
      window.voyager.trackEvent(key, key, param)
    }

    // 添加至人才库
    const type =
      talentIds.length > 1
        ? 'groups/batchModifyTalentGroups'
        : 'groups/modifyTalentGroups'
    const payload =
      talentIds.length > 1
        ? {
            uid2_list: JSON.stringify(talentIds),
            data: JSON.stringify({
              user_group_ids: personalGroupChecked, // 个人分组id list
              mbr_group_ids: entGroupChecked,
            }),
          }
        : {
            uid2: talentIds[0],
            data: JSON.stringify({
              user_group_ids: personalGroupChecked,
              mbr_group_ids: entGroupChecked,
            }),
          }
    this.props.dispatch({ type, payload }).then(() => {
      if (window.voyager) {
        const param = {
          datetime: new Date().getTime(),
          uid: window.uid,
          p_group: personalGroupChecked.join(','),
          e_group: entGroupChecked.join(','),
          ...this.props.trackParam,
          u2: talentIds.join(','),
        }
        const key = 'jobs_pc_talent_addtp_success'
        window.voyager.trackEvent(key, key, param)
      }
      message.success(this.state.isEditMode ? '分组修改成功' : '添加成功')
      window.broadcast.send('addGroupSuccess', {
        groups: personalGroupChecked.concat(entGroupChecked),
        uids: talentIds,
      })

      this.fetchNavigator()
      // this.fetchTableData()
      this.fetchPersonalGroupList()
      this.fetchEntGroupList()
      this.handleCancelGroup()
      this.props.onOk(personalGroupChecked.concat(entGroupChecked))
    })
  }

  handleShowModal = (e) => {
    const { talents, trackParam } = this.props
    if (window.voyager) {
      const talentIds = talents.map(R.prop('id'))
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...trackParam,
        u2: talentIds.join(','),
      }
      const key = 'jobs_pc_talent_addtp_click'
      window.voyager.trackEvent(key, key, param)
    }

    // 单人模式请求已存在分组
    if (talents.length === 1) {
      this.fetchTalentGroup(talents[0].id)
    } else {
      this.setState({
        showGroupModal: true,
      })
    }
    if (!this.props.personalGroup.length) {
      this.fetchPersonalGroupList()
    }
    if (!this.props.entGroup.length) {
      this.fetchEntGroupList()
    }

    try {
      e.stopPropagation()
    } catch (error) {
      window.event.stopPropagation()
    }

    // 弹窗出现，重新拉取人才list
    this.fetchPersonalGroupList()
    this.fetchEntGroupList()
  }

  handleCancelGroup = () => {
    this.setState({
      showGroupModal: false,
      personalGroupChecked: [],
      entGroupChecked: [],
    })
  }

  handleGroupChange = (value) => {
    this.setState({
      personalGroupChecked: value.personalGroups,
      entGroupChecked: value.entGroups,
    })
  }

  render() {
    const {
      onClick,
      disabled,
      className,
      type,
      children,
      showPop,
      talents,
      personalGroup,
      entGroup,
      style = {},
      currentUser,
    } = this.props
    const {
      showGroupModal,
      isEditMode,
      entGroupChecked,
      personalGroupChecked,
    } = this.state
    let modalTitle = ''
    if (talents.length) {
      const singleTitle =
        talents[0].group_cnt > 0 || isEditMode
          ? '修改分组'
          : `添加 ${talents[0].name} 到储备人才`
      modalTitle =
        talents.length > 1 ? `添加 ${talents.length} 人到储备人才` : singleTitle
    }
    const node = (
      <Button
        onClick={onClick || this.handleShowModal}
        disabled={disabled}
        className={className}
        style={style}
        key="button"
        type={type || ''}
      >
        {children || '加入储备'}
      </Button>
    )
    return [
      showPop ? (
        <Popover
          placement="topLeft"
          content="添加到储备人才"
          trigger="hover"
          key="button"
        >
          {node}
        </Popover>
      ) : (
        node
      ),
      showGroupModal && (
        <Modal
          title={modalTitle}
          onOk={this.handleSubmitGroup}
          onCancel={this.handleCancelGroup}
          visible={showGroupModal}
          okText="确定"
          cancelText="取消"
          key="buttonModal"
          className={`${styles.groupModal} padding-top-24`}
        >
          <GroupUi
            talents={talents}
            currentUser={currentUser}
            groups={{
              entGroups: entGroup,
              personalGroups: personalGroup,
            }}
            value={{
              entGroups: entGroupChecked,
              personalGroups: personalGroupChecked,
            }}
            fetchEntGroupList={this.fetchEntGroupList}
            isEditMode={isEditMode}
            onChange={this.handleGroupChange}
          />
        </Modal>
      ),
    ]
  }
}
