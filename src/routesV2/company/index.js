import React from 'react'
import { Button, Tab, Message, Empty, Icon } from 'mm-ent-ui'
import { connect } from 'react-redux'
import locale from 'antd/es/date-picker/locale/zh_CN'
import * as R from 'ramda'
import urlParse from 'url'
import { injectUnmount, trackEvent } from 'utils'
import { DatePicker, Select, Pagination, Skeleton } from 'antd'
import DynamicCard from 'componentsV2/Company/DynamicCard'
import PrimaryData from 'componentsV2/Company/PrimaryData'
import PublishDynamicModal from 'componentsV2/Company/PublishDynamic/Modal'
import GuideDynamicModal from 'componentsV2/Company/GuideDynamicModal'
import SnatchTalentModal from 'componentsV2/Company/SnatchTalentModal'
import TimeLimitedTask from 'componentsV2/Company/TimeLimitedTask'
import CommonTask from 'componentsV2/Company/CommonTask'
import QuestionDynamic from './questionAnswer/QuestionDynamic/index'
import UiDebug from 'componentsV2/Common/UiDebug'
import styles from './index.less'
import { QqCircleFilled } from '@ant-design/icons'
import company from 'models/company'

const { RangePicker } = DatePicker

@connect((state) => ({
  loading: false, //state.loading.effects,
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
@UiDebug('/ui/company_home.png')
export default class CompanyHome extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      primaryIndexData: {
        // total_follows_uv: '1089',
        // total_visitors_pv: '8948',
        // total_feeds_show_pv: '1089',
        // week_follows_uv: '8948',
        // week_visitors_pv: '8948',
        // week_feeds_show_pv: '1089',
      },
      currentTabKey: 1,
      dateRange: [],
      sort: 0,
      dynamics: { feeds: [] },
      pagination: {
        page: 0,
        size: 10,
      },
      paginationOne: {
        page: 0,
        size: 10,
      },
      answerDynamicData: [],
      snatchModalVisible: false,
      answerList: { feeds: [] },
    }
  }

  getWebcid = (user = this.props.bprofileUser) =>
    R.pathOr('', ['company', 'webcid'], user)

  componentDidMount() {
    this.fetchPrimaryIndexData(this.props.bprofileUser)
    this.fetchDynamicList()
    this.commenntPageIndex = 0
    // this.loadCommmentList()
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.bprofileUser, this.props.bprofileUser)) {
      this.fetchPrimaryIndexData(newProps.bprofileUser)
      this.fetchDynamicList(newProps.bprofileUser)
    }
    const fr = R.pathOr(
      '',
      ['query', 'fr'],
      urlParse.parse(window.location.href, true)
    )
    const webcid = this.getWebcid(newProps.bprofileUser)
    if (
      ['talent_bank', 'publish_task'].indexOf(fr) > -1 &&
      !this.props.dynamicModalVisible &&
      webcid
    ) {
      this.goPublishDynamic()
    }
  }

  onCancelSnatch = () => {
    this.setState({ snatchModalVisible: false })
    window.history.pushState(null, null, window.location.pathname)
  }

  onCancelPublish = () => {
    this.props.dispatch({
      type: 'company/setData',
      payload: {
        dynamicModalVisible: false,
      },
    })
    window.history.pushState(null, null, window.location.pathname)
  }

  onCancelGuide = () => {
    this.props.dispatch({
      type: 'company/setData',
      payload: {
        guideType: 0,
      },
    })
  }

  goPublishDynamic = () => {
    this.props.dispatch({
      type: 'company/setData',
      payload: {
        dynamicModalVisible: true,
      },
    })
  }

  guideToPublish = () => {
    trackEvent('bprofile_company_weekly', {
      target_type: 'click',
      modal_type: this.props.guideType,
    })
    this.onCancelGuide()
    this.goPublishDynamic()
  }

  getTabsConfig = () => {
    const { company = {} } = this.props.bprofileUser
    const { auths = {} } = company
    const { auth_asking } = auths
    const employeeFeedUnreadCnt = R.pathOr(
      0,
      ['employee_feed_unread_cnt'],
      this.props.bprofileUser
    )

    const otherFeedUnreadCnt = R.pathOr(
      0,
      ['other_feed_unread_cnt'],
      this.props.bprofileUser
    )

    // let totalCnt = employeeFeedUnreadCnt + otherFeedUnreadCnt
    // totalCnt = totalCnt > 99 ? '99+' : totalCnt
    const getBubble = (tab) => {
      const getCount = (num) => {
        return num > 99 ? '99+' : num
      }

      const getTabText = () => {
        let tabText = null
        if (tab === 1) {
          tabText = getCount(employeeFeedUnreadCnt)
        }
        if (tab === 2) {
          tabText = getCount(otherFeedUnreadCnt)
        }
        return tabText
      }
      const bubbleText = getTabText()
      return bubbleText ? (
        <span className={styles.bubble}>{bubbleText}</span>
      ) : null
    }

    const getTabSpan = (title, tab) => {
      return (
        <span className={styles.tabWrap}>
          {title}
          {getBubble(tab)}
        </span>
      )
    }
    if (auth_asking) {
      return [
        {
          title: '企业动态',
          key: 1,
        },
        {
          title: getTabSpan('员工动态', 1),
          key: 2,
        },
        {
          title: getTabSpan('外部用户动态', 2),
          key: 3,
        },
        {
          title: getTabSpan('问答动态', 3),
          key: 8,
        },
      ]
    } else {
      return [
        {
          title: '企业动态',
          key: 1,
        },
        {
          title: getTabSpan('员工动态', 1),
          key: 2,
        },
        {
          title: getTabSpan('外部用户动态', 2),
          key: 3,
        },
      ]
    }
  }

  /* eslint-disable */
  fetchPrimaryIndexData = (user) => {
    const webcid = this.getWebcid(user)

    const fr = R.pathOr(
      '',
      ['query', 'fr'],
      urlParse.parse(window.location.href, true)
    )

    if (!webcid) {
      return
    }

    if (['talent_bank', 'publish_task'].indexOf(fr) > -1) {
      this.goPublishDynamic()
    }

    if (fr === 'snatch_talent') {
      this.setState({ snatchModalVisible: true })
    }

    this.props
      .dispatch({
        type: 'company/fetchEnterpriseData',
        payload: {
          webcid,
        },
      })
      .then((data) => {
        this.setState({
          primaryIndexData: data,
        })
      })

    this.props.dispatch({
      type: 'company/getWeeklyReport',
      payload: {
        webcid,
      },
    })
    this.props.dispatch({
      type: 'company/getTaskData',
      payload: {
        webcid,
      },
    })
  }

  getCommonQuery = () => {
    const webcid = this.getWebcid()
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    return { webcid, cuid, version: '4.0.0' }
  }

  addCmt = (item, param) => {
    this.props
      .dispatch({
        type: 'company/addCmt',
        payload: { ...this.getCommonQuery(), ...param },
      })
      .then(() => {
        // const cmt = res.comment
        Message.success('评论成功')
        const newItem = item
        newItem.cmt = null
        // this.addFeedComment(cmt,item.id)
        this.loadCommmentList(newItem, true)
      })
  }

  /* eslint-disable */
  loadCommmentList = (item, first) => {
    const page = R.pathOr(0, ['cmt', 'page'], item)
    let cmt = R.pathOr(0, ['cmt'], item)
    const param = {
      ...this.getCommonQuery(),
      gfid: item.gfid,
      fid: item.fid,
      page: first ? page : page + 1,
    }
    cmt = { loading: true, ...cmt }
    this.setFeedComment(cmt, item.id)
    this.props
      .dispatch({
        type: 'company/getCommmentList',
        payload: param,
      })
      .then((res) => {
        cmt = item.cmt || {}
        if (!Array.isArray(cmt.lst)) {
          cmt = res
        } else {
          cmt.lst = cmt.lst.concat(res.lst)
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
      cid,
      ...this.getCommonQuery(),
      fid: item.id,
      gfid: item.gfid,
      page: !lv2Cmt.page ? 0 : lv2Cmt.page + 1,
    }
    /* eslint-disable */
    this.props
      .dispatch({
        type: 'company/getCommmentLv2List',
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
        // cmt = item.cmt || {}
        // if (!Array.isArray(cmt.lst)) {
        //   cmt = res
        // } else {
        //   cmt.lst = cmt.lst.concat(res.lst)
        //   cmt.more = res.more
        //   cmt.page = res.page
        // }
        // cmt.loading = false
        this.setFeedItem(item.id, item)
      })
  }

  //问答动态回答列表接口
  answerDynamicList = (user = this.props.bprofileUser) => {
    const { sort, dateRange, currentTabKey, pagination } = this.state
    const { page, size } = pagination
    const webcid = this.getWebcid(user)
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    if (!webcid) {
      return
    }

    const param = {
      sortby: sort,
      tab_id: currentTabKey,
      time_begin: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
      time_end: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
      webcid,
      cuid,
      page,
      count: size,
      query_from: 0,
    }
    // const param = {
    //   sortby: sort,
    //   tab_id: currentTabKey,
    //   time_begin: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
    //   time_end: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
    //   webcid,
    //   cuid,
    //   page,
    //   count: size,
    //   query_from: 0,
    //   uid:124616480
    // }
    return this.props
      .dispatch({
        type: 'company/answerDynamicList',
        payload: param,
      })
      .then((data) => {
        this.setState({
          answerList: data,
        })
      })
  }

  fetchDynamicList = (user = this.props.bprofileUser) => {
    const { sort, dateRange, currentTabKey, pagination } = this.state
    const { page, size } = pagination
    const webcid = this.getWebcid(user)
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)

    if (!webcid) {
      return
    }
    const param = {
      sortby: sort,
      tab_id: currentTabKey,
      time_begin: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
      time_end: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
      webcid,
      cuid,
      page,
      count: size,
      query_from: 0,
    }
    return this.props
      .dispatch({
        type: 'company/fetchDynamicList',
        payload: param,
      })
      .then((data) => {
        this.setState({
          dynamics: data,
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
        this.fetchDynamicList().then(() => {
          callback && callback()
        })
      }
    )
  }

  refreshDynamicList = (callback) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          page: 0,
        },
      },
      () => {
        this.answerDynamicList().then(() => {
          callback && callback()
        })
      }
    )
  }

  handleTabChange = (config) => {
    if (config.key === 8) {
      this.setState(
        {
          currentTabKey: config.key,
        },
        () => {
          this.refreshDynamicList(() => {
            this.props.dispatch({
              type: 'global/fetchCurrentUser',
            })
          })
        }
      )
    } else {
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
  }

  handleAdd = (isVideo, fid) => {
    const webcid = this.getWebcid()
    const fr = R.pathOr(
      '',
      ['query', 'fr'],
      urlParse.parse(window.location.href, true)
    )
    if (this.props.guideTag) {
      this.props.dispatch({
        type: 'company/removeExposureTag',
        payload: {
          webcid,
        },
      })
      trackEvent('bprofile_company_weekly', {
        target_type: 'success',
        fid,
        modal_type: this.props.addFeedLastWeek,
      })
      Message.success(
        isVideo
          ? '视频审核通过后，将使用专享曝光推广包，请耐心等待'
          : '发布动态成功，专享曝光推广包生效中'
      )
    } else {
      Message.success(isVideo ? '视频审核中，请耐心等待' : '发布动态成功')
    }

    if (fr === 'talent_bank') {
      trackEvent('talent_bank_to_bprofile_modal', {
        target_type: 'publish',
        is_pay: this.props.auth.isCompanyPayUser,
      })
    }
    this.onCancelPublish()
    this.fetchDynamicList()
    this.props.dispatch({
      type: 'company/getTaskData',
      payload: {
        webcid,
      },
    })
  }

  handleDelete = (item, e) => {
    e.stopPropagation()
    this.props
      .dispatch({
        type: 'company/deleteCompanyFeed',
        payload: {
          ...this.getCommonQuery(),
          fid: item.id,
          gfid: item.gfid,
          cid: R.propOr('', ['cid'], this.props.bprofileUser),
        },
      })
      .then(() => {
        Message.success('删除动态成功')
        this.fetchDynamicList()
      })
  }

  handleOnToTop = (item, e) => {
    e.stopPropagation()
    if (!this.props.auth.isCompanyPayUser) {
      Message.warn('升级为付费版企业号即可解锁该功能！请联系官方销售顾问')
      return
    }
    this.props
      .dispatch({
        type: 'company/setOnTop',
        payload: {
          fid: item.id,
          gfid: item.gfid,
          // TODO cid 需要动态取
          cid: R.pathOr('', ['cid'], this.props.bprofileUser),
          is_on_top:
            typeof item.is_on_top === 'undefined' || item.is_on_top === 0
              ? 1
              : 0,
        },
      })
      .then(() => {
        Message.success('设置成功')
        this.fetchDynamicList()
      })
  }
  //问答动态置顶
  answerOnToTop = (item, e) => {
    let is_top = 0
    if (item.is_top === 1) {
      is_top = 0
    } else {
      is_top = 1
    }
    e.stopPropagation()
    if (!this.props.auth.isCompanyPayUser) {
      Message.warn('升级为付费版企业号即可解锁该功能！请联系官方销售顾问')
      return
    }
    this.props
      .dispatch({
        type: 'company/toppingCompanyAnswer',
        payload: {
          answer_id: item.answer_id,
          // uid: 124616480,
          is_top,
        },
      })
      .then(() => {
        Message.success('设置成功')
        this.answerDynamicList()
      })
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
  //问答动态移出企业号
  onQuestionRemove = (item, e) => {
    e.stopPropagation()
    this.props
      .dispatch({
        type: 'company/removeCompanyAnswer',
        payload: {
          answer_id: item.answer_id,
          // uid: 124616480,
        },
      })
      .then(() => {
        Message.success('已将一条员工动态移出企业号')
        this.answerDynamicList()
      })
  }
  handleSendToFans = (item, e) => {
    e.stopPropagation()
    this.props
      .dispatch({
        type: 'company/sendToFans',
        payload: {
          fid: item.id,
          gfid: item.gfid,
          cid: R.pathOr('', ['cid'], this.props.bprofileUser),
        },
      })
      .then(() => {
        const { dynamics } = this.state
        this.setState({
          dynamics: {
            ...dynamics,
            residue_times: R.propOr(1, 'residue_times', dynamics) - 1,
          },
        })
        Message.success('已经动态推送给粉丝')
      })
  }

  handleDateRangeChange = (dateRange) =>
    this.setState({ dateRange: [] }, this.refreshList)

  handleSortChange = (sort) => {
    this.setState({ sort }, this.refreshList)
  }

  handlePageChange = (page) => {
    if (this.state.currentTabKey === 8) {
      this.setState(
        {
          pagination: {
            ...this.state.pagination,
            page: page - 1,
          },
        },
        this.answerDynamicList
      )
    } else {
      this.setState(
        {
          pagination: {
            ...this.state.pagination,
            page: page - 1,
          },
        },
        this.fetchDynamicList
      )
    }
  }

  renderTop = () => {
    const webcid = this.getWebcid()
    const cid = R.pathOr('', ['cid'], this.props.bprofileUser)
    const cuid = R.pathOr('', ['company', 'cuid'], this.props.bprofileUser)
    const { guideType, guideTag } = this.props
    return (
      <div className={styles.top}>
        <PrimaryData data={this.state.primaryIndexData} webcid={webcid} />
        <div className={styles.buttons}>
          <Button type="button_l_fixed_blue450" onClick={this.goPublishDynamic}>
            {guideTag ? (
              <img
                className={styles.guideTag}
                src="https://i9.taou.com/maimai/p/24665/7049_53_11Sjo6nHzUzZLXNZ"
              />
            ) : null}
            <Icon
              type="publish_dynamic"
              className="margin-right-8 font-size-16"
            />
            发布企业动态
          </Button>
          <a
            href={`https://maimai.cn/company/editArticle?cid=${cid}&is_company_article=1&cuid=${cuid}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="button_l_fixed_blue650">
              <Icon
                type="publish_article"
                className="margin-right-8 font-size-16"
              />
              发布专栏文章
            </Button>
          </a>
        </div>
        {this.props.dynamicModalVisible ? (
          <PublishDynamicModal
            onOk={this.handleAdd}
            onCancel={this.onCancelPublish}
          />
        ) : null}
        {guideType &&
        !this.props.dynamicModalVisible &&
        !this.state.snatchModalVisible ? (
          <GuideDynamicModal
            type={guideType}
            onCancel={this.onCancelGuide}
            publishDynamic={this.guideToPublish}
            primaryIndexData={this.state.primaryIndexData}
          />
        ) : null}
        {this.state.snatchModalVisible ? (
          <SnatchTalentModal onCancel={this.onCancelSnatch} />
        ) : null}
      </div>
    )
  }

  onClickCommentMoreHandler = (item) => {
    this.loadCommmentList(item)
  }

  /* eslint-disable */
  onFeedActionHandler = (item, key) => {
    if (key === 'comment_cnt') {
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
      this.setFeedComment(null, item.id)
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

  // addFeedComment= (cmt,fid) => {
  //   const {dynamics: {feeds = []} = {}} = this.state
  //   feeds.map((item) => {
  //     if (item.id === fid) {
  //       if(!item.cmt)  item.cmt = {lst:[],loading:false}
  //       item.cmt.lst.unshift(cmt)
  //     }
  //   })
  //   this.setState({
  //     dynamics: {...this.state, feeds},
  //   })
  // }

  submitFeedCmtHandle = (textValue, item, lv2Item) => {
    const textLenth = R.trim(textValue).length
    if (textLenth === 0 || textLenth > 250) {
      Message.warning('评论必须在1～250字内')
      return
    }

    if (lv2Item) {
      this.addCmt(item, {
        gfid: item.gfid,
        fid: item.id,
        text: textValue,
        uid2: lv2Item.u.id,
        reply_to: lv2Item.id,
      })
    } else {
      this.addCmt(item, { gfid: item.gfid, fid: item.id, text: textValue })
    }
  }

  cmtLikeHandle = (cmt, item) => {
    const cid = R.propOr(0, 'id', cmt)
    const mylike = R.propOr(0, 'mylike', cmt)
    const param = {
      cid,
      gfid: item.gfid,
      fid: item.id,
      like: mylike === 1 ? 0 : 1,
      ...this.getCommonQuery(),
    }
    this.props
      .dispatch({
        type: 'company/likeCmt',
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
    const param = {
      cids: cid,
      fid: item.id,
      gfid: item.gfid,
      ...this.getCommonQuery(),
    }
    this.props
      .dispatch({
        type: 'company/delCmts',
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
      type={this.state.currentTabKey === 1 ? 'ent' : 'employee'}
      onDelete={(e) => this.handleDelete(item, e)}
      onRemove={(e) => this.handleRemove(item, e)}
      onSendToFans={(e) => this.handleSendToFans(item, e)}
      onToTop={(e) => this.handleOnToTop(item, e)}
      residueTimes={R.pathOr(0, ['dynamics', 'residue_times'], this.state)}
    />
  )
  renderQuestionDynamic = (item) => (
    <QuestionDynamic
      answerList={item}
      currentUser={this.props.currentUser}
      onCmtLike={(cmt) => this.cmtLikeHandle(cmt, item)}
      onDelCmts={(cmt) => this.delCmtsHandle(cmt, item)}
      onSubmitFeedCmt={(textValue, lv2Item) =>
        this.submitFeedCmtHandle(textValue, item, lv2Item)
      }
      onRelayMoreClick={(cid) => this.getCommmentLv2List(cid, item)}
      onClickMore={() => this.onClickCommentMoreHandler(item)}
      key={item.gfid}
      type={this.state.currentTabKey === 1 ? 'ent' : 'employee'}
      onDelete={(e) => this.handleDelete(item, e)}
      onRemove={(e) => this.onQuestionRemove(item, e)}
      answerOnToTop={(e) => this.answerOnToTop(item, e)}
      residueTimes={R.pathOr(0, ['dynamics', 'residue_times'], this.state)}
    />
  )
  renderTabContent = () => {
    const { dynamics: { feeds = [] } = {}, answerList } = this.state

    if (this.state.currentTabKey == 8) {
      const { answerList: { feeds = [] } = {} } = this.state
      if (feeds.length === 0) {
        return (
          <Empty
            image={`${this.props.urlPrefix}/images/empty_position.png`}
            description="暂无内容"
          />
        )
      }
      return feeds.map(this.renderQuestionDynamic)
    }

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
        showSizeChanger={false}
        onChange={this.handlePageChange}
      />
    )
  }
  renderDynamicPagination = () => {
    const { answerList: { total_count: total } = {} } = this.state
    const { size, page } = this.state.paginationOne
    if (total === 0) {
      return null
    }

    return (
      <Pagination
        total={total}
        pageSize={size}
        current={page + 1}
        showQuickJumper
        showSizeChanger={false}
        onChange={this.handlePageChange}
      />
    )
  }
  renderTask = () => {
    const { task_version } = this.props.taskData
    switch (task_version) {
      case 1:
        return <TimeLimitedTask onClickCard={this.goPublishDynamic} />
      case 2:
        return <CommonTask />
      default:
        return null
    }
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
          <div>
            <RangePicker
              onChange={this.handleDateRangeChange}
              locale={locale}
              style={{ width: '240px' }}
            />
            <Select
              className="margin-left-16"
              onChange={this.handleSortChange}
              value={this.state.sort}
            >
              <Select.Option value={0}>按时间排序</Select.Option>
              <Select.Option value={1}>按热门排序</Select.Option>
            </Select>
          </div>
        </div>
        <div className={styles.content}>{this.renderTabContent()}</div>
        {this.state.currentTabKey === 8 ? (
          <div className={styles.pagination}>
            {this.renderDynamicPagination()}
          </div>
        ) : (
          <div className={styles.pagination}>{this.renderPagination()}</div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        {this.renderTop()}
        {this.renderTask()}
        {this.renderBottom()}
      </div>
    )
  }
}
