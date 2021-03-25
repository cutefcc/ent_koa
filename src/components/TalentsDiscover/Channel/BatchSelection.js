import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
import { Icon } from 'mm-ent-ui'
import * as R from 'ramda'
import { connect } from 'react-redux'

import ChannelInviteButton from 'components/Common/ChannelInviteButton'

import styles from './batchSelection.less'

@connect((state) => ({
  currentChannel: state.channels.currentChannel,
}))
class BatchSelection extends React.PureComponent {
  static propTypes = {
    isAllSelect: PropTypes.bool,
    selectedItems: PropTypes.array,
    onSelectChange: PropTypes.func.isRequired,
    onInviteFinish: PropTypes.func,
    onFilterChange: PropTypes.func,
    showFilter: PropTypes.bool,
  }

  static defaultProps = {
    isAllSelect: false,
    selectedItems: [],
    onInviteFinish: () => {},
    onFilterChange: () => {},
    showFilter: true,
  }

  getDirectImItems = () => {
    return this.props.selectedItems.filter((item) => !item.is_direct_im)
  }

  handleSelect = () => {
    this.props.onSelectChange(!this.props.isAllSelect)
  }

  handleOpFinish = (type, ids) => () => {
    if (type === 'directIm') {
      this.props.onInviteFinish(ids)
    }
  }

  handleDirectChatSelectionChange = (e) => {
    this.props.onFilterChange({
      is_direct_chat: e.target.checked ? 1 : 0,
    })
  }

  render() {
    const { isAllSelect } = this.props
    const directChatItems = this.getDirectImItems()
    const { length: selectedCount } = this.props.selectedItems
    const hasInvitedNum = R.propOr(
      0,
      'total_direct_num',
      this.props.currentChannel
    )
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
          {selectedCount > 0 && (
            <span className={styles.tip}>{`已选 ${selectedCount} 个人才`}</span>
          )}

          {hasInvitedNum
            ? `您已抢到 ${hasInvitedNum} 个人才`
            : '您还没有抢到人才'}
        </span>
        <span className={styles.buttons}>
          {this.props.showFilter && (
            <Checkbox
              onChange={this.handleDirectChatSelectionChange}
              className="margin-right-16"
              style={{ lineHeight: '25px' }}
              disabled={this.props.loading}
            >
              可立即沟通
            </Checkbox>
          )}
          <ChannelInviteButton
            key="DirectIMButton"
            talents={directChatItems}
            source={this.props.source}
            onInviteFinish={this.handleOpFinish(
              'directIm',
              directChatItems.map(R.prop('id'))
            )}
            disabled={directChatItems.length === 0}
            buttonText="批量极速联系"
            iconType="clock"
            className={styles.directChatButton}
          />
        </span>
      </div>
    )
  }
}

export default BatchSelection
