import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'

import DirectChatButton from 'components/Common/DirectChatButton'

import styles from './batchSelection.less'

@connect((state) => ({
  loadingList: false,
}))
export default class BatchSelection extends React.Component {
  static propTypes = {
    onSelectAll: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    isSelectAll: PropTypes.bool.isRequired,
    onInviteFinish: PropTypes.func.isRequired,
  }

  handleSelectAll = (e) => {
    this.props.onSelectAll(e.target.checked)
  }

  render() {
    const { isSelectAll, selectedItems, onInviteFinish } = this.props

    return (
      <div className={styles.main}>
        <Checkbox onChange={this.handleSelectAll} checked={isSelectAll}>
          全选
        </Checkbox>
        <DirectChatButton
          key="DirectIMButton"
          talents={selectedItems}
          source="talentPool2"
          onInviteFinish={onInviteFinish}
          disabled={selectedItems.length === 0}
        />
      </div>
    )
  }
}
