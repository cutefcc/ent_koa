import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'mm-ent-ui'
import * as R from 'ramda'

import DirectChatButton from 'components/Common/DirectChatButton'
import GroupButton from 'components/Common/GroupButton'
import AddFriendButton from 'components/Common/AddFriendButton'

import styles from './batchSelection.less'

class BatchSelection extends React.PureComponent {
  static propTypes = {
    isAllSelect: PropTypes.bool,
    selectedItems: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onOpFinish: PropTypes.func,
    hasInvitedIds: PropTypes.array,
    hasAddFriendIds: PropTypes.array,
  }

  static defaultProps = {
    isAllSelect: false,
    selectedItems: [],
    hasInvitedIds: [],
    hasAddFriendIds: [],
    onOpFinish: () => {},
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

  render() {
    const { isAllSelect, selectedItems } = this.props
    const addFriendItems = this.getAddFriendItems()
    const directChatItems = this.getDirectImItems()
    const { length: selectedCount } = this.props.selectedItems
    return (
      <div className={styles.main}>
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
            buttonText="添加分组"
            onGroupFinish={this.handleGroupFinish}
            disabled={selectedItems.length === 0}
            iconType="add_label"
            className={styles.groupButton}
          />
          <AddFriendButton
            key="addFriendButton"
            talents={addFriendItems}
            source={this.props.source}
            onAddFinish={this.handleOpFinish(
              'addFriend',
              addFriendItems.map(R.prop('id'))
            )}
            disabled={addFriendItems.length === 0}
            buttonText="加好友"
            iconType="add_friend"
            className={styles.addFriendButton}
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
          />
        </span>
      </div>
    )
  }
}

export default BatchSelection
