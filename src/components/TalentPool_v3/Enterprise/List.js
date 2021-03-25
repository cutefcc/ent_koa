import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/CommonCard'
import List from 'components/Common/List_v2'
import { Button, Typography, Empty } from 'mm-ent-ui'
// import emptyImgUrl from 'images/empty.png'

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
    onOpFinish: PropTypes.func,
    data: PropTypes.array.isRequired,
    remain: PropTypes.bool.isRequired,
    setScrollDom: PropTypes.func,
    search: PropTypes.string,
    currentNavigator: PropTypes.object,
  }

  static defaultProps = {
    onOpFinish: () => {},
    setScrollDom: () => {},
    search: '',
    currentNavigator: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      source: 'talentPool_v3',
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

  handleOpFinish = (type, item, state, groupName) => {
    this.props.onOpFinish(type, [item.id], state, groupName)
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
      },
    })
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
          'aiCall',
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
          'setState',
          // 'askForPhone',
          // item.mobile ? 'showPhone' : '',
          // item.attachment_resume_url ? 'attachmentResume' : '',
        ]}
        source={this.state.source}
        onOpFinish={this.handleOpFinish}
        showCheckbox
        trackParam={this.props.trackParam}
        container={this.props.scrollDom}
      />
    )
  }

  renderList = () => <div>{this.props.data.map(this.renderTalentItem)}</div>

  renderEmptyImg = () => (
    <img src={`${this.props.urlPrefix}/images/empty.png`} alt="emptyImage" />
  )

  renderEmptyTip = () => {
    const { currentNavigator } = this.props
    if (currentNavigator.action_code === 1) {
      const desc = (
        <div>
          <Typography.Text
            size="16px"
            strong
            className="margin-top-24 display-block"
            type="stress"
          >
            开通企业高级会员
          </Typography.Text>
          <Typography.Text size="14px" className="margin-top-8 display-block">
            {currentNavigator.action_tip || '开通高级会员，解锁更多功能'}
          </Typography.Text>
          <div className="flex flex-justify-center margin-top-16">
            <Button type="primary" onClick={this.handleShowUpgradeMember}>
              立即开通
            </Button>
          </div>
        </div>
      )
      return (
        <Empty
          image={`${this.props.urlPrefix}/images/empty_position.png`}
          description={desc}
        />
      )
    }
    return (
      <div className={styles.defaultTip}>
        <div>
          <p className={styles.resultTip}>暂无人才</p>
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
            请输入查询关键词, 至少选择“关键词”、“职位技能”或“公司”
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
