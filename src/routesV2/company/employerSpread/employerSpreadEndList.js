import React, { PureComponent } from 'react'
import { Button, Text, Tab, Message } from 'mm-ent-ui'
import { injectUnmount, trackEvent } from 'utils'
import * as R from 'ramda'
import moment from 'moment'
import { Pagination } from 'antd'
import { connect } from 'react-redux'
import DataPopover from './publishPage/DataPopover'
import { FeedCard } from './publishPage/SpreadContent'
import EpbBalanceDetail from './epbBalanceDetail'
import { employerSpreadDataInit } from './constant'
import styles from './employerSpreadEndList.less'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  urlPrefix: state.global.urlPrefix,
  jobs: state.global.jobs,
  employerSpreadData: state.company.employerSpreadData,
  employerBalance: state.company.employerBalance,
}))
@injectUnmount
export default class EmployerSpreadEndList extends PureComponent {
  state = {
    tabsConfig: [
      {
        title: '推广计划',
        key: 1,
      },
    ],
    activeKeys: [1],
    pagination: {
      page: 0,
      size: 20,
    },
    total: 0,
    list: [],
    epbBalanceDetailModal: false,
  }

  componentDidMount() {
    this.fetchList()
    this.fetchProfession()
  }

  fetchProfession = () =>
    this.props.dispatch({ type: 'global/fetchProfession' })

  fetchList = () => {
    const { page, size } = this.state.pagination
    const webcid = R.pathOr('', ['company', 'webcid'], this.props.bprofileUser)
    this.props
      .dispatch({
        type: 'company/employerList',
        payload: {
          uid: window.uid,
          page,
          size,
          channel: 'www',
          version: '1.0.0',
          webcid,
        },
      })
      .then(({ data }) => {
        this.setState({
          list: data.list,
          total: data.total,
        })
      })
  }

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          page: page - 1,
        },
      },
      this.fetchList
    )
  }

  handleTabChange = (config) => {
    this.setState({
      activeKeys: [config.key],
    })
  }

  handleChangeSchedule = () => {
    const { onScheduleChanged, employerSpreadData } = this.props
    // 清空数据
    this.props.dispatch({
      type: 'company/setData',
      payload: {
        employerSpreadData: {
          ...employerSpreadData,
          ...employerSpreadDataInit,
        },
        preData: {},
      },
    })
    onScheduleChanged('processing')
  }

  handleOpen = () => {
    this.props
      .dispatch({
        type: 'entInvite/keepBusiness',
        payload: {
          fr: 'employer_promote',
          uid: window.uid,
        },
      })
      .then(() => {
        Message.success('我们的销售顾问会尽快与您联系')
      })
  }

  checkEpbDetail = () => {
    this.setState({ epbBalanceDetailModal: true })
    trackEvent('bprofile_company_employerspread_balance', {
      target_type: 'show',
    })
  }

  isNotUndefined(value) {
    return typeof value !== 'undefined'
  }

  renderBottomBar = (item) => {
    const barViewArray = []
    const {
      statistical_info: {
        view,
        send,
        click,
        like,
        comment,
        spread,
        consume_num: consumeNum,
      },
      invite_state,
    } = item

    if (this.isNotUndefined(view)) {
      barViewArray.push(`曝光量 ${view}`)
    }
    if (invite_state === 3) {
      // 已结束
      if (this.isNotUndefined(consumeNum)) {
        barViewArray.push(`  ·  消耗币 ${consumeNum}`)
      }
      if (this.isNotUndefined(consumeNum)) {
        barViewArray.push(`  ·  返还币 ${consumeNum}`)
      }
    }
    if (this.isNotUndefined(click)) {
      barViewArray.push(`  ·  点击量 ${click}`)
    }
    if (this.isNotUndefined(like)) {
      barViewArray.push(`  ·  点赞 ${like}`)
    }
    if (this.isNotUndefined(comment)) {
      barViewArray.push(`  ·  评论 ${comment}`)
    }
    if (this.isNotUndefined(spread)) {
      barViewArray.push(`  ·  分享 ${spread}`)
    }

    return <span style={{ marginRight: '8px' }}>{barViewArray}</span>
  }

  renderCard = (item) => {
    const {
      jid,
      judge_state,
      invite_end_time,
      invite_state,
      invite_time,
      invite_type,
    } = item
    const judgeStateMap = ['审核中', '审核通过', '', '审核失败']
    const inviteStateMap = [
      '',
      '未开始',
      '进行中',
      '进行中',
      '推广失败',
      '已结束',
    ]
    const inviteTypeMap = {
      5: '精准增粉',
      6: '雇主活动',
      7: '职位急招',
      8: '内容推广',
    }
    let jidObj = null
    if (this.props.jobs.length !== 0) {
      // eslint-disable-next-line prefer-destructuring
      jidObj = this.props.jobs.filter((ite) => {
        return ite.jid === jid
      })[0]
    }
    const {
      ucard: { name = '', avatar = '', career = '' },
    } = this.props.currentUser.bprofileCompanyUser || this.props.currentUser
    let text =
      judge_state === 0 || judge_state === 3
        ? judgeStateMap[judge_state]
        : inviteStateMap[invite_state]

    if (judge_state === 1 && moment() < moment(invite_time)) {
      text = '未开始'
    }

    let textColor = '#222'
    if (text === '审核中' || text === '未开始') textColor = '#FFA408'
    if (text === '审核失败' || text === '推广失败') textColor = '#FF4D3C'
    if (text === '进行中') textColor = '#3B7AFF'
    if (text === '已结束') textColor = '#B7B9C3'

    return (
      <div className={`${styles.employerSpreadEndListItem} flex`} key={item.id}>
        <div className={styles.itemLeft}>
          <div className={styles.itemLeftLine}>
            <span>开始：</span>
            <span>{invite_time}</span>
          </div>
          <div className={styles.itemLeftLine}>
            <span>结束：</span>
            <span>{invite_end_time}</span>
          </div>
          <div className={styles.itemLeftLine}>
            <span>类型：</span>
            <span>{inviteTypeMap[invite_type]}</span>
          </div>
          <div className={styles.itemLeftLine} style={{ color: textColor }}>
            <span>状态：</span>
            <span>{text}</span>
          </div>
        </div>
        <div className={styles.itemRight}>
          <div className={styles.itemMidd}>
            {item.fid > 0 ? (
              <FeedCard {...item.finfo} />
            ) : (
              <div>
                {' '}
                <div className={styles.itemMiddContent}>
                  <Text type="text_primary" size={14} style={{ color: '#222' }}>
                    {item.content}
                  </Text>
                </div>
                <div className={`${styles.itemMiddMidd} flex`}>
                  {item.img_url && (
                    <img
                      className={styles.itemMiddMiddImg}
                      alt="img"
                      src={item.img_url}
                    />
                  )}
                  {jidObj && (
                    <div className={styles.itemMiddMiddRight}>
                      <div className={styles.itemMiddMiddRightL}>
                        <img src={avatar} alt="avatar" />
                      </div>
                      <div className={styles.itemMiddMiddRightR}>
                        <div className={styles.top}>
                          <Text
                            type="text_primary"
                            size={14}
                            style={{ color: '#666' }}
                          >
                            {`${`${jidObj.province}·${jidObj.position} ${jidObj.salary}`}`}
                          </Text>
                        </div>
                        <div className={styles.bottom}>
                          <Text
                            type="text_primary"
                            size={12}
                            style={{ color: '#999' }}
                          >
                            发布人：{name} {career}
                          </Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.itemMiddBottom}>
              {this.renderBottomBar(item)}
              <DataPopover item={item} />
            </div>
          </div>

          {/* <div className={styles.itemRightR}>
            {item.judge_state === 3 && (
              <Text type="text_primary" size={14} style={{color: '#0052FF'}}>
                重新编辑
              </Text>
            )}
          </div> */}
        </div>
      </div>
    )
  }

  renderTabContent = () => {
    const { list } = this.state
    return list.map(this.renderCard)
  }

  renderPagination = () => {
    const { total } = this.state
    const { size, page } = this.state.pagination
    if (total === 0) {
      return null
    }

    return (
      <Pagination
        total={total}
        pageSize={size}
        current={page + 1}
        showQuickJumper
        onChange={this.handlePageChange}
      />
    )
  }

  render() {
    const { employerBalance } = this.props

    return (
      <div className={`${styles.employerSpreadEndList}`}>
        <div className={`${styles.employerSpreadEndListHeader} flex`}>
          <Tab
            tabs={this.state.tabsConfig}
            activeKeys={this.state.activeKeys}
            onChange={this.handleTabChange}
            type="large"
            style={{ marginLeft: '24px' }}
          />
          <div className={styles.headerRight}>
            <p className={styles.epbBalance}>
              曝光币余额: {employerBalance} (
              <span onClick={this.checkEpbDetail}>查看明细</span>)
            </p>
            <Button
              type="button_m_exact_blue450"
              onClick={this.handleChangeSchedule}
            >
              + 新建推广
            </Button>
          </div>

          {/* ) : (
              <Button
                type="button_m_exact_blue450"
                onClick={this.handleOpen}
                style={{ marginTop: '16px', marginRight: '32px' }}
              >
                + 立即开通
              </Button>
            )} */}
        </div>
        {this.state.epbBalanceDetailModal && (
          <EpbBalanceDetail
            onCancel={() => this.setState({ epbBalanceDetailModal: false })}
          />
        )}
        <div className={styles.content}>{this.renderTabContent()}</div>
        <div className={styles.pagination}>{this.renderPagination()}</div>
      </div>
    )
  }
}
