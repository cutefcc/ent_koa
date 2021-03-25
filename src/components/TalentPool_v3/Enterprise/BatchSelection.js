import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { Icon } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'

import DirectChatButton from 'components/Common/DirectChatButton'
import GroupButton from 'components/Common/GroupButton'
import AddFriendButton from 'components/Common/AddFriendButton'

import styles from './batchSelection.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  addFriendLoading: state.loading.effects['personalAsset/addFriend'],
}))
export default class BatchSelection extends React.PureComponent {
  static propTypes = {
    isAllSelect: PropTypes.bool,
    selectedItems: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onOpFinish: PropTypes.func,
    hasInvitedIds: PropTypes.array,
    hasAddFriendIds: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
    wrapperDom: PropTypes.node.isRequired,
  }

  static defaultProps = {
    isAllSelect: false,
    selectedItems: [],
    hasInvitedIds: [],
    hasAddFriendIds: [],
    onOpFinish: () => {},
    onChange: () => {},
    value: '0',
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
        !item.is_direct_im && !this.props.hasInvitedIds.includes(item.id)
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

  handleSortKeyChange = (value) => {
    const {
      currentUser: { role = '' },
    } = this.props
    // 个人会员只能默认排序，不能使用其他排序
    if (`${value}` !== '0' && role === 'personalUser') {
      this.handleShowTipOpenMember()
      return
    }

    this.props.onChange(value)
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

  handleShowTipGroupButtonDisable = () => {
    alert('已标记为"不合适"的人才，无法修改分组。请"移回"人才后重新勾选')
  }

  render() {
    const {
      isAllSelect,
      selectedItems,
      currentUser: { role = '' },
    } = this.props
    const groupButtonDisable =
      R.findIndex(R.propEq('op_state', 1))(selectedItems) >= 0
    const addFriendItems = this.getAddFriendItems()
    const directChatItems = this.getDirectImItems()
    const { length: selectedCount } = this.props.selectedItems
    const isPersonalOrPersonalRecruiter =
      role === 'personalUser' || role === 'personalRecruiter'
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
            {selectedCount > 0 ? `已选 ${selectedCount} 个人才` : ''}
          </span>
          <span className={styles.buttons}>
            <GroupButton
              key="groupButton"
              talents={selectedItems}
              buttonText="修改分组"
              onGroupFinish={this.handleGroupFinish}
              disabled={selectedItems.length === 0}
              iconType="add_label"
              className={styles.groupButton}
              onClick={
                // 如果是个人会员，禁用功能，用 onClick 覆盖默认的 onClick 事件
                // eslint-disable-next-line no-nested-ternary
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : groupButtonDisable
                  ? this.handleShowTipGroupButtonDisable
                  : undefined
              }
            />
            <AddFriendButton
              key="addFriendButton"
              talents={addFriendItems}
              source={this.props.source}
              onAddFinish={this.handleOpFinish(
                'addFriend',
                addFriendItems.map(R.prop('id'))
              )}
              disabled={
                addFriendItems.length === 0 || this.props.addFriendLoading
              }
              buttonText="加好友"
              iconType="add_friend"
              className={styles.addFriendButton}
              trackParam={this.props.trackParam}
              onClick={
                // 如果是个人版，则用自定义的 onclick 事件，取代默认的 onclick 事件，阻止使用该功能
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : undefined
              }
            />
            <DirectChatButton
              key="DirectIMButton"
              talents={directChatItems}
              source={this.props.source}
              onInviteFinish={this.handleOpFinish(
                'directIm',
                directChatItems.map(R.prop('id'))
              )}
              disabled={directChatItems.length === 0}
              buttonText="极速联系"
              iconType="direct_im"
              className={styles.directChatButton}
              trackParam={this.props.trackParam}
              onClick={
                // 如果是个人版，则用自定义的 onclick 事件，取代默认的 onclick 事件，阻止使用该功能
                isPersonalOrPersonalRecruiter
                  ? this.handleShowTipOpenMember
                  : undefined
              }
            />
          </span>
        </span>
        <span>
          {/* <Radio.Group
            onChange={this.handleSortKeyChange}
            value={this.props.search.sortby || '0'}
          >
            <Radio value="0">默认排序</Radio>
            <Radio value="1">活跃优先</Radio>
          </Radio.Group> */}
          <Select
            placeholder="职位技能"
            onChange={this.handleSortKeyChange}
            value={this.props.value}
            style={{ width: 150, textAlign: 'right' }}
            className={styles.sortSelection}
            getPopupContainer={() => this.props.wrapperDom || document.body}
          >
            <Select.Option key="4" value="4">
              按入库时间排序
            </Select.Option>
            <Select.Option key="1" value="1">
              按匹配度排序
            </Select.Option>
            <Select.Option key="2" value="2">
              按意愿度排序
            </Select.Option>
            <Select.Option key="3" value="3">
              按活跃时间排序
            </Select.Option>
          </Select>
        </span>
      </div>
    )
  }
}
