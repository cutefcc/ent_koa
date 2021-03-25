import React from 'react'
import { Tab, Message, Empty } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'
import { injectUnmount, trackEvent } from 'utils'
import { Pagination, Skeleton } from 'antd'
import DynamicCard from './QuestionCard/index'
import styles from './index.less'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  urlPrefix: state.global.urlPrefix,
  auth: state.global.auth,
  guideType: state.company.guideType,
  guideTag: state.company.guideTag,
  addFeedLastWeek: state.company.addFeedLastWeek,
  taskData: state.company.taskData,
  dynamicModalVisible: state.company.dynamicModalVisible,
}))
@injectUnmount
export default class CompanyHome extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      primaryIndexData: {},
      currentTabKey: 1,
      sort: 0,
      commendKey: 0,
      dynamics: { feeds: [] },
      pagination: {
        page: 0,
        size: 20,
      },
      showCommentStatue: false,
    }
  }

  getWebcid = (user = this.props.bprofileUser) =>
    R.pathOr('', ['company', 'webcid'], user)

  componentDidMount() {
    this.fetchQuestionList()
    // this.getCommmentLv2List()
    // this.commenntPageIndex = 0
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.bprofileUser, this.props.bprofileUser)) {
      this.fetchQuestionList(newProps.bprofileUser)
    }
    const fr = R.pathOr(
      '',
      ['query', 'fr'],
      urlParse.parse(window.location.href, true)
    )
  }

  getTabsConfig = () => {
    return [
      {
        title: '用户提问',
        key: 1,
      },
    ]
  }
  getCommonQuery = () => {
    const webcid = this.getWebcid()
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    return { webcid, cuid, version: '4.0.0' }
  }
  addCmt = (item, param) => {
    this.props
      .dispatch({
        type: 'company/answerQuestion',
        payload: { ...this.getCommonQuery(), ...param },
      })
      .then(() => {
        Message.success('评论成功')
        const newItem = item
        newItem.cmt = null
        this.loadCommmentList(newItem, true)
      })
  }
  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })
  /* eslint-disable */
  loadCommmentList = (item, first) => {
    const page = R.pathOr(0, ['cmt', 'page'], item)
    let cmt = R.pathOr(0, ['cmt'], item)
    const param = {
      // uid: 124616480,
      asking_id: item.id,
      page: first ? page : page + 1,
    }
    cmt = { loading: true, ...cmt }
    this.setFeedComment(cmt, item.id)
    this.props
      .dispatch({
        type: 'company/getFirstCommmentList',
        payload: param,
      })
      .then((res) => {
        cmt = res || {}
        if (!Array.isArray(cmt.lst)) {
          cmt = res
        } else {
          // cmt.lst = cmt.lst.concat(res.lst)
          cmt.more = res.more
          cmt.page = res.page
        }
        cmt.lst.forEach((item) => (item.more = 1))
        cmt.loading = false
        this.setFeedComment(cmt, item.id)
      })
  }

  getCommmentLv2List = (cid, item) => {
    const lv2Cmt = item.cmt.lst.find((cmtItem) => cmtItem.id === cid)
    const param = {
      asking_id: item.id,
      // uid: '',
      answer_id: lv2Cmt.id,
      page: !lv2Cmt.page ? 0 : lv2Cmt.page + 1,
    }
    /* eslint-disable */
    this.props
      .dispatch({
        type: 'company/getSecondCommmentList',
        payload: param,
      })
      .then((res) => {
        item.cmt.lst.forEach((cmt) => {
          if (cmt.id === cid) {
            if (cmt.cmt.length === 1) {
              cmt.cmt = res.comments.lst
            } else {
              cmt.cmt.concat(res.comments.lst)
            }
            cmt.more = res.comments.more
          }
        })
        this.setFeedItem(item.id, item)
      })
  }
  fetchQuestionList = (user = this.props.bprofileUser) => {
    const { pagination } = this.state
    const { page, size } = pagination
    const webcid = this.getWebcid(user)
    // const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    if (!webcid) {
      return
    }
    const param = {
      // uid: 124616480,
      cid: R.pathOr('', ['cid'], user),
      page,
      count: size,
    }
    return this.props
      .dispatch({
        type: 'company/fetchQuestionList',
        payload: param,
      })
      .then((data) => {
        this.refreshCurrentUser()
        this.setState({
          dynamics: {
            ...this.state,
            feeds: data.data,
            count: data.count,
            page: data.page,
            remain: data.remain,
          },
        })
      })
  }

  refreshList = (callback) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          page: 0,
        },
      },
      () => {
        this.fetchQuestionList().then(() => {
          callback && callback()
        })
      }
    )
  }

  handleTabChange = (config) => {
    this.setState(
      {
        currentTabKey: config.key,
      },
      () => {
        this.refreshList(() => {
          this.props.dispatch({
            type: 'global/fetchCurrentUser',
          })
        })
      }
    )
  }

  handleRemove = (item, e) => {
    e.stopPropagation()
    this.props
      .dispatch({
        type: 'company/removeEmployeeFeed',
        payload: {
          fid: item.id,
          gfid: item.gfid,
          // TODO cid 需要动态取
          cid: R.pathOr('', ['cid'], this.props.bprofileUser),
        },
      })
      .then(() => {
        Message.success('已将一条员工动态移出企业号')
        this.fetchDynamicList()
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
      this.fetchQuestionList
    )
    if (this.state.showCommentStatue) {
      this.state.showCommentStatue = false
    }
  }

  onClickCommentMoreHandler = (item) => {
    this.loadCommmentList(item)
  }

  /* eslint-disable */
  onFeedActionHandler = (item, key) => {
    if (key === 'answer_cnt') {
      this.showFeedComment(item)
    }
    if (key === 'like_cnt') {
      const like = item.common.action_bar.liked
      const liked = like === 0 ? 1 : 0
      this.props
        .dispatch({
          type: 'company/likeFeed',
          payload: {
            gfid: item.gfid,
            fid: item.id,
            like: liked,
            ...this.getCommonQuery(),
          },
        })
        .then(() => {
          this.setFeedList(item.id, liked)
        })
    }
  }

  /* eslint-disable */
  setFeedList = (fid, like) => {
    const { dynamics: { feeds = [] } = {} } = this.state
    feeds.map((item) => {
      if (item.id === fid) {
        item.common.action_bar.liked = like
        const oldLikeCnt = item.common.action_bar.like_cnt
        if (like) {
          item.common.action_bar.like_cnt = oldLikeCnt + 1
        } else {
          item.common.action_bar.like_cnt = oldLikeCnt - 1
        }
      }
    })
    this.setState({
      dynamics: { ...this.state, feeds },
    })
  }

  /* eslint-disable */
  setFeedItem = (fid, newItem) => {
    const { dynamics: { feeds = [] } = {} } = this.state
    feeds.map((item) => {
      if (item.id === fid) {
        item = { ...item, ...newItem }
      }
    })
    this.setState({
      dynamics: { ...this.state, feeds },
    })
  }

  /* eslint-disable */
  setFeed = (fid, key, value) => {
    const { dynamics: { feeds = [] } = {} } = this.state
    feeds.map((item) => {
      if (item.id === fid) {
        item[key] = value
      }
    })
    this.setState({
      dynamics: { ...this.state, feeds },
    })
  }

  fetchLikeFeed = () => {}

  setShowCmtStatu = (fid, nowStat) => {
    this.setFeed(fid, 'showCmt', !nowStat)
  }

  showFeedComment = (item) => {
    this.setShowCmtStatu(item.id, item.showCmt)
    if (item.cmt && Array.isArray(item.cmt.lst) && item.cmt.lst.length > 0) {
      this.setFeedComment(item.cmt, item.id)
    } else {
      this.loadCommmentList(item, true)
    }
  }

  /* eslint-disable */
  setFeedComment = (cmt, fid) => {
    const { dynamics: { feeds = [] } = {} } = this.state
    feeds.map((item) => {
      if (item.id === fid) {
        item.cmt = cmt
      }
    })
    this.setState({
      dynamics: { ...this.state, feeds },
    })
  }

  submitFeedCmtHandle = (textValue, item, lv2Item) => {
    const { company = {} } = this.props.currentUser
    const { clogo, stdname } = company
    const textLenth = R.trim(textValue).length
    if (textLenth === 0 || textLenth > 250) {
      Message.warning('评论必须在1～250字内')
      return
    }
    const user = this.props.bprofileUser
    const { ucard, cid } = user
    const { id } = ucard
    if (lv2Item) {
      this.addCmt(item, {
        // uid: id,
        asking_id: item.id,
        text: textValue,
        reply_to: lv2Item.id,
        avatar: clogo,
        name: stdname,
        username_type: 6,
        judge: 0,
        cid: cid,
      })
    } else {
      this.addCmt(item, {
        // uid: id,
        asking_id: item.id,
        text: textValue,
        avatar: clogo,
        name: stdname,
        username_type: 6,
        judge: 0,
        cid: cid,
      })
    }
  }

  cmtLikeHandle = (cmt, item) => {
    const cid = R.propOr(0, 'id', cmt)
    const mylike = R.propOr(0, 'mylike', cmt)
    let likeStatus = 0
    if (cmt.mylike === 0) {
      likeStatus = 1
    } else {
      likeStatus = 0
    }
    const param = {
      answer_id: cmt.id,
      // uid: 124616480,
      like_status: likeStatus,
    }
    this.props
      .dispatch({
        type: 'company/answerLike',
        payload: param,
      })
      .then(() => {
        item.cmt = null
        this.loadCommmentList(item, true)
        Message.success(mylike === 1 ? '取消赞成功' : '点赞成功')
      })
  }

  delCmtsHandle = (cmt, item) => {
    const cid = R.propOr(0, 'id', cmt)
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    const param = {
      answer_id: cmt.id,
      // uid: 124616480,
      cuid: cuid,
    }
    this.props
      .dispatch({
        type: 'company/deleteFirstAnswer',
        payload: param,
      })
      .then(() => {
        const newItem = item
        newItem.cmt = null
        this.loadCommmentList(newItem, true)
        Message.success('删除评论成功')
      })
  }

  renderDynamicCard = (item) => (
    <DynamicCard
      data={item}
      currentUser={this.props.currentUser}
      onCmtLike={(cmt) => this.cmtLikeHandle(cmt, item)}
      onDelCmts={(cmt) => this.delCmtsHandle(cmt, item)}
      onSubmitFeedCmt={(textValue, lv2Item) =>
        this.submitFeedCmtHandle(textValue, item, lv2Item)
      }
      onRelayMoreClick={(cid) => this.getCommmentLv2List(cid, item)}
      feedActionClick={(key) => this.onFeedActionHandler(item, key)}
      onClickMore={() => this.onClickCommentMoreHandler(item)}
      key={item.gfid}
      commendKey={this.state.commendKey}
      // onRemove={(e) => this.handleRemove(item, e)}
      // onToTop={(e) => this.handleOnToTop(item, e)}
      showCommentStatue={this.state.showCommentStatue}
      questionList={item.style49}
    />
  )

  renderTabContent = () => {
    const { dynamics: { feeds = [] } = {} } = this.state
    if (this.props.loading['company/fetchDynamicList']) {
      return R.range(0, 3).map((index) => (
        <Skeleton
          loading
          avatar
          active
          key={index}
          className={styles.skeleton}
        />
      ))
    }
    if (feeds.length === 0) {
      return (
        <Empty
          image={`${this.props.urlPrefix}/images/empty_position.png`}
          description="暂无内容"
        />
      )
    }
    return feeds.map(this.renderDynamicCard)
  }

  renderPagination = () => {
    const { dynamics: { total_count: total } = {} } = this.state
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

  renderBottom = () => {
    const { currentTabKey } = this.state
    const tabsConfig = this.getTabsConfig()
    return (
      <div className={styles.bottom}>
        <div className={styles.filter}>
          <Tab
            tabs={tabsConfig}
            activeKeys={[currentTabKey]}
            onChange={this.handleTabChange}
            type="large"
          />
          <div style={{ color: '#AFB1BC', fontSize: 14 }}>
            帮助用户，回答与公司相关的提问，有利于建立良好的雇主形象
          </div>
        </div>
        <div className={styles.content}>{this.renderTabContent()}</div>
        <div className={styles.pagination}>{this.renderPagination()}</div>
      </div>
    )
  }

  render() {
    return <div className={styles.main}>{this.renderBottom()}</div>
  }
}
