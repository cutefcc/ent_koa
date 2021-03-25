import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/CommonCard'
import List from 'components/Common/List'

import styles from './list.less'

@connect((state) => ({
  loadingList: state.loading.effects['global/fetchUrl'],
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
}))
export default class MyList extends React.Component {
  static propTypes = {
    onSelectChange: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    loadMore: PropTypes.func.isRequired,
    // isAllSelect: PropTypes.bool.isRequired,
    onOpFinish: PropTypes.func,

    data: PropTypes.array.isRequired,
    remain: PropTypes.bool.isRequired,
    setScrollDom: PropTypes.func,
    search: PropTypes.string,
  }

  static defaultProps = {
    onOpFinish: () => {},
    setScrollDom: () => {},
    search: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      source: 'talentPool_v2',
    }
  }

  handleSelect = (id) => (selected) => {
    const { data } = this.props
    const { selectedItems } = this.props
    const selectedIds = selectedItems.map(R.prop('id'))
    const ids = selected ? [...selectedIds, id] : R.without([id], selectedIds)

    this.props.onSelectChange(
      ids.length === data.length,
      data.filter((item) => R.contains(item.id, ids))
    )
  }

  handleOpFinish = (type, item, groupName) => {
    this.props.onOpFinish(type, [item.id], groupName)
  }

  renderTalentItem = (item) => {
    const selectedIds = this.props.selectedItems.map(R.prop('id'))
    const { id } = item
    const {
      currentUser: { isV3 },
    } = this.props

    return (
      <TalentCard
        data={item}
        key={id}
        checked={selectedIds.includes(id)}
        onCheck={this.handleSelect(id)}
        showSource
        showPhone
        opButtons={[
          // 'microResume',
          // 'profile',
          item.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
          // item.right_type === 1 ? 'directIm' : '',
          // item.right_type === 2 && item.direct_invite_status !== 3
          //   ? 'directInvite'
          //   : '',
          // item.right_type === 2 && item.direct_invite_status === 3
          //   ? 'chat'
          //   : '',
        ]}
        footerButtons={[
          item.friend_state === 2 ? 'communicate' : 'addFriend',
          'editGroup',
          'addRemark',
          // 'askForPhone',
          // item.mobile ? 'showPhone' : '',
          // item.attachment_resume_url ? 'attachmentResume' : '',
        ]}
        source={this.state.source}
        onOpFinish={this.handleOpFinish}
        showCheckbox
        trackParam={{
          type: 'talent_pool',
        }}
      />
    )
  }

  renderList = () => <div>{this.props.data.map(this.renderTalentItem)}</div>

  renderEmptyImg = () => {
    // return <img src={emptyImgUrl} alt="emptyImage" />
    return (
      <img src={`${this.props.urlPrefix}/images/empty.png`} alt="emptyImage" />
    )
  }

  renderEmptyTip = () => {
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          <p className={styles.resultTip}>暂无搜索结果</p>
        </div>
      </div>
    )
  }

  renderDefaultTip = () => {
    return (
      <div className={styles.defaultTip}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          <p className={styles.resultTip}>
            请输入查询关键词, 至少选择“职位技能”或“公司”
          </p>
        </div>
      </div>
    )
  }

  render() {
    const { loadingList, data } = this.props
    return (
      <List
        renderList={this.renderList}
        loadMore={this.props.loadMore}
        loading={loadingList}
        dataLength={data.length || 0}
        remain={this.props.remain}
        key="list"
        search={this.props.search}
        emptyTip={this.renderEmptyTip()}
        renderDefaultTip={this.renderDefaultTip}
        setScrollDom={this.props.setScrollDom}
      />
    )
  }
}
