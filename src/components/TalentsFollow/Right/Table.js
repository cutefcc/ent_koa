import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { IM_URL } from 'constants'
import { Table, Modal, Button, Popover } from 'antd'
import { Icon } from 'mm-ent-ui'
import DirectChatButton from 'components/Common/DirectChatButton'
import AddFriendButton from 'components/Common/AddFriendButton'
import Avatar from 'components/Common/Avatar'
import { rightStateMap } from 'constants/right'
import PreviewButton from 'components/Common/RightButton/PreviewButton'
import { dateTimeFormat, strToStr } from 'utils/date'

import styles from './table.less'

export default class MyTable extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    source: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    trackParam: PropTypes.object,
  }

  static defaultProps = {
    loading: false,
    trackParam: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      showImModal: false,
      target: 0,
      inviteUids: [],
      addFrUids: [],
    }
  }

  getColumns = () => [
    {
      title: '人才信息',
      dataIndex: 'candidate.name',
      key: 'candidate.name',
      render: (value, item) => this.renderTalentCard(value, item),
    },
    {
      title: '沟通职位',
      dataIndex: 'intend_position',
      key: 'intend_position',
      render: (value) => (
        <span className="ellipsis" style={{ width: '150px' }}>
          {value || '-'}
        </span>
      ),
      width: 200,
    },
    {
      title: '请求时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (value, item) => this.renderRequestTime(item),
      // sorter: true,
      // sortOrder:
      //   this.props.filter.sort_field === 'create_time'
      //     ? this.props.filter.sort_order
      //     : false,
      width: 160,
    },
    {
      title: '最新状态',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (state, item) => this.renderLatestStatus(item),
      // sorter: true,
      // sortOrder:
      //   this.props.filter.sort_field === 'update_time'
      //     ? this.props.filter.sort_order
      //     : false,
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, item) => {
        return (
          <span className={styles.operateButtons}>
            {this.renderButtons(item)}
          </span>
        )
      },
      // width: 216,
    },
  ]

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  handleDirectImFinish = (uids) => {
    this.setState({
      inviteUids: [...this.state.inviteUids, ...uids],
    })
  }

  handleAddFrFinish = (uids) => {
    this.setState({
      addFrUids: [...this.state.addFrUids, ...uids],
    })
  }

  handleHideImModal = () => {
    this.setState({
      showImModal: false,
    })
  }

  handleShowImModal = (candidate) => () => {
    const { id } = candidate
    // 打开会话打点
    this.trackEvent('jobs_pc_talent_recruit_follow_open_dialog', {
      u2: id || 0,
      ...this.props.trackParam,
    })
    this.setState({
      showImModal: true,
      target: id,
    })
  }

  handleDownLoad = (candidate) => () => {
    const { id, resume } = candidate
    // 下载简历打点
    this.trackEvent('jobs_pc_talent_download_resume', {
      u2: id || 0,
      ...this.props.trackParam,
    })
    window.open(resume)
  }

  handleTableSortChange = (pagination, filters, sorter) => {
    const { field, order } = sorter
    this.props.onFilterChange({
      ...this.props.filter,
      sort_field: field,
      sort_order: order,
    })
  }

  renderRequestTime = (item) => {
    const typeMap = {
      1: '申请加好友',
      6: '发送极速联系',
      7: '发起立即沟通',
    }
    return (
      <div className="flex-column" style={{ width: '102px' }}>
        <span className="color-common">
          {R.propOr('发出请求', item.right_type, typeMap)}
        </span>
        <span className="color-dilution margin-top-16">
          {strToStr(item.create_time, dateTimeFormat, 'M月D日 H:mm')}
        </span>
      </div>
    )
  }

  renderLatestStatus = (item) => {
    return (
      <div className="flex-column" style={{ width: '102px' }}>
        <span className="color-common">
          {R.propOr(
            '发出请求',
            item.right_state,
            rightStateMap[item.right_type]
          )}
        </span>
        <span className="color-dilution margin-top-16">
          {item.update_time
            ? strToStr(item.update_time, dateTimeFormat, 'M月D日 H:mm')
            : ''}
        </span>
      </div>
    )
  }

  renderButtons = (talent) => {
    const { candidate = {} } = talent
    const button = {
      directIm: () => (
        <DirectChatButton
          key="DirectIMButton"
          talents={[candidate]}
          source={this.props.source}
          onInviteFinish={this.handleDirectImFinish}
          iconType="direct_im"
          disabled={this.state.inviteUids.includes(talent.id)}
          buttonText=""
          className={`${styles.directButton} ${styles.commonButton}`}
          trackParam={this.props.trackParam}
        />
      ),
      addFr: () => (
        <AddFriendButton
          key="addfr"
          talents={[candidate]}
          source={this.props.source}
          onAddFinish={this.handleAddFrFinish}
          disabled={this.state.addFrUids.includes(talent.id)}
          iconType="add_friend"
          buttonText=""
          className={`${styles.addFrButton} ${styles.commonButton}`}
          trackParam={this.props.trackParam}
        />
      ),
      im: () => (
        <Popover title="" content="点击开始会话">
          <Button
            onClick={this.handleShowImModal(candidate)}
            className={`${styles.chatButton} ${styles.commonButton}`}
          >
            <Icon type="chat" />
          </Button>
        </Popover>
      ),
      download: () => (
        <Button
          onClick={this.handleDownLoad(candidate)}
          className={`${styles.downButton} ${styles.commonButton}`}
        >
          <Icon type="download" />
        </Button>
      ),
    }

    const canChatStates = [2, 63, 64, 65, 66]
    const buttons = [
      ...(talent.is_friend_add || talent.friend_state ? [] : ['addFr']),
      ...(talent.is_direct_im ? [] : ['directIm']),
      ...(canChatStates.includes(talent.right_state) ? ['im'] : []),
      ...(candidate.resume ? ['download'] : []),
    ]
    return buttons.map((b) => button[b]())
  }

  renderTalentCard = (value, item) => {
    const {
      avatar = '',
      name = '保密',
      position = '',
      company = '',
    } = item.candidate
    const briefFields = ['sdegree', 'worktime', 'age']
    const briefData = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(briefFields)
      )(item.candidate)
    )
    return (
      <div className={styles.card}>
        <PreviewButton
          showDetail={false}
          data={item.candidate || {}}
          trackParam={this.props.trackParam}
          content={
            <Avatar
              avatar={avatar}
              name={name}
              style={{
                width: '56px',
                height: '56px',
                fontSize: '30px',
                lineHeight: '56px',
                borderRadius: '28px',
                cursor: 'pointer',
              }}
              key="avatar"
            />
          }
        />
        <div className="margin-left-16 flex-column flex-justify-center flex-1 overflow-hidden">
          <div className="line-height-16 flex align-center">
            <span className="font-size-16 color-stress font-weight-bold line-height-16 ellipsis cursor-pointer hover-blue">
              <PreviewButton
                showDetail={false}
                data={item.candidate || {}}
                trackParam={this.props.trackParam}
                content={name}
              />
            </span>
            <span className={`${styles.brief} ellipsis`}>
              {Object.values(briefData).join(' / ')}
            </span>
          </div>

          <div className={`${styles.position} ellipsis margin-top-16`}>
            {`${company}·${position}`}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Table
          size="small"
          dataSource={this.props.data}
          columns={this.getColumns()}
          pagination={false}
          rowKey="id"
          className={styles.myTable}
          loading={this.props.loading}
          locale={{
            emptyText: '还没有数据~ 您可以在发现人才中找到您中意的候选人哦！',
          }}
          onChange={this.handleTableSortChange}
        />
        <Modal
          visible={this.state.showImModal}
          onCancel={this.handleHideImModal}
          footer={null}
          width={700}
        >
          <div className={styles.imContainer}>
            <iframe
              src={`${IM_URL}&target=${this.state.target}`}
              title="common_im"
              className={styles.im}
              frameBorder="0"
              seamless
            />
          </div>
        </Modal>
      </div>
    )
  }
}
