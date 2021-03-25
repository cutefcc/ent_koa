import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Popover } from 'antd'
import { Icon } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'

import DirectChatButton from 'components/Common/DirectChatButton'
import GroupButton from 'components/Common/GroupButton'
import AddFriendButton from 'components/Common/AddFriendButton'

import styles from './batchSelection.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class BatchSelection extends React.PureComponent {
  static propTypes = {
    isAllSelect: PropTypes.bool,
    selectedItems: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onOpFinish: PropTypes.func,
    hasInvitedIds: PropTypes.array,
    hasAddFriendIds: PropTypes.array,
    search: PropTypes.object,
    onSearchChange: PropTypes.func,
    showSort: PropTypes.bool,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    isAllSelect: false,
    selectedItems: [],
    hasInvitedIds: [],
    hasAddFriendIds: [],
    onOpFinish: () => {},
    search: {},
    onSearchChange: () => {},
    showSort: true,
    loading: false,
  }

  getAddFriendItems = () => {
    return this.props.selectedItems.filter(
      (item) =>
        !item.friend_state && !this.props.hasAddFriendIds.includes(item.id)
    )
  }

  getDirectImItems = () => {
    return this.props.selectedItems.filter(
      (item) =>
        !item.is_direct_im &&
        !this.props.hasInvitedIds.includes(item.id) &&
        (item.right_type === 1 || item.direct_contact_st !== 1)
    )
  }

  handleSelect = () => {
    this.props.onSelect(!this.props.isAllSelect)
  }

  handleOpFinish = (type, ids) => () => {
    this.props.onOpFinish(type, ids)
  }

  handleGroupFinish = (ids, groupName) => {
    this.props.onOpFinish('group', ids, groupName)
  }

  handleSortKeyChange = (value) => () => {
    // const {currentUser: {role = ''}} = this.props
    // 个人会员只能默认排序，不能使用其他排序
    // if (`${value}` !== '0' && role === 'personalUser') {
    //   this.handleShowTipOpenMember()
    //   return
    // }

    this.props.onSearchChange({
      ...this.props.search,
      sortby: value,
    })
  }

  handleCheckboxChange = (field) => (e) => {
    // const {currentUser: {role = ''}} = this.props
    // const isPersonalOrPersonalRecruiter =
    //   role === 'personalUser' || role === 'personalRecruiter'
    // if (isPersonalOrPersonalRecruiter) {
    //   this.handleShowTipOpenMember()
    //   return
    // }
    this.props.onSearchChange({
      ...this.props.search,
      [field]: e.target.checked ? 1 : 0,
    })
  }

  handleShowTipOpenMember = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '开通招聘企业版 解锁更多功能',
        cancelTxt: '放弃开通',
        confirmTxt: '立即开通',
      },
    })
  }

  render() {
    const {
      isAllSelect,
      selectedItems,
      currentUser: { role = '' },
    } = this.props
    const addFriendItems = this.getAddFriendItems()
    const directChatItems = this.getDirectImItems()
    const { length: selectedCount } = this.props.selectedItems
    const isPersonalOrPersonalRecruiter =
      role === 'personalUser' || role === 'personalRecruiter'
    const sortBy = this.props.search.sortby || '0'
    const sid = this.props.type === 'search' ? window.pc_search_sid : ''
    const trackParam = {
      type: this.props.type,
      sid,
    }
    return (
      <div className={styles.main}>
        <span className="flex">
          <span>
            <Icon
              type="select_all"
              className={`${styles.selectAllButton} ${
                isAllSelect ? styles.activeIcon : ''
              }`}
              onClick={this.handleSelect}
            />
            {selectedCount > 0 ? `已选${selectedCount}人` : ''}
          </span>
          <span className={styles.buttons}>
            <GroupButton
              key="groupButton"
              talents={selectedItems}
              buttonText="加入人才银行"
              onGroupFinish={this.handleGroupFinish}
              disabled={selectedItems.length === 0}
              iconType="add_label"
              className={styles.groupButton}
              trackParam={trackParam}
              onClick={
                // 如果是个人会员，禁用功能，用 onClick 覆盖默认的 onClick 事件
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : undefined
              }
            />
            <AddFriendButton
              key="addFriendButton"
              talents={addFriendItems}
              onAddFinish={this.handleOpFinish(
                'addFriend',
                addFriendItems.map(R.prop('id'))
              )}
              disabled={addFriendItems.length === 0}
              buttonText="加好友"
              iconType="add_friend"
              className={styles.addFriendButton}
              onClick={
                // 如果是个人版，则用自定义的 onclick 事件，取代默认的 onclick 事件，阻止使用该功能
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : undefined
              }
              trackParam={trackParam}
            />
            <DirectChatButton
              key="DirectIMButton"
              talents={directChatItems}
              onInviteFinish={this.handleOpFinish(
                'directIm',
                directChatItems.map(R.prop('id'))
              )}
              disabled={directChatItems.length === 0}
              buttonText="极速联系"
              iconType="direct_im"
              className={styles.directChatButton}
              onClick={
                // 如果是个人版，则用自定义的 onclick 事件，取代默认的 onclick 事件，阻止使用该功能
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : undefined
              }
              trackParam={trackParam}
            />
          </span>
        </span>
        {this.props.showSort && (
          <span>
            <Checkbox
              onChange={this.handleCheckboxChange('is_no_communication')}
              disabled={this.props.loading}
              checked={this.props.search.is_no_communication === 1}
            >
              未沟通{' '}
              <Popover
                content="指最近30天，你没有发起好友请求、直聊、极速联系的人才。"
                placement="bottom"
              >
                <Icon
                  type="question_circle"
                  className="cursor-pointer color-dilution font-size-14"
                />
              </Popover>
            </Checkbox>
            <Checkbox
              onChange={this.handleCheckboxChange('is_direct_chat')}
              disabled={this.props.loading}
              checked={this.props.search.is_direct_chat === 1}
            >
              可立即沟通
            </Checkbox>
            {/* <Radio.Group
              onChange={this.handleSortKeyChange}
              value={this.props.search.sortby || '0'}
            >
              <Radio value="0">默认排序</Radio>
              {
                // <Radio value="">活跃优先</Radio>
              }
              <Radio value="1">活跃优先</Radio>
            </Radio.Group> */}
            <span
              className={`${styles.sortBy} ${
                sortBy === '0' ? styles.sortByActive : ''
              }`}
              onClick={this.handleSortKeyChange('0')}
            >
              默认排序
            </span>
            <span
              className={`${styles.sortBy} ${
                sortBy === '1' ? styles.sortByActive : ''
              }`}
              onClick={this.handleSortKeyChange('1')}
            >
              意愿优先
            </span>
          </span>
        )}
      </div>
    )
  }
}
