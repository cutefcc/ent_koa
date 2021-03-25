import React from 'react'
import { connect } from 'react-redux'
import {
  Text,
  Button,
  RichText,
  Icon,
  FeedCard,
  FeedMultiImg,
  ArticleCard,
} from 'mm-ent-ui'
import { getMMTimeStr } from 'utils/date'
import { compact, injectUnmount } from 'utils'
import styles from './index.less'

@connect((state) => ({
  currentUid: state.profile.currentUid,
}))
@injectUnmount
export default class RealnameStatus extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0, // 取数据时候用的 page, 由于接口每次返回的数据量不确定，所以前端设置，当本次返回的数据量不够一页时，取下一页数据，所以取数据的page和展示的page分开存
      showPage: 0, // 当前展示第几页数据
      remain: 0,
      showSize: 5,
    }
  }

  componentDidMount() {
    const { currentUid } = this.props
    this.fetchData(currentUid)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentUid !== this.props.currentUid) {
      this.fetchData(newProps.currentUid)
    }
  }

  hasMore = () => {
    const { tabsData } = this.props
    const { data, showPage, showSize, remain } = this.state
    const showLen = (showPage + 1) * showSize
    // 还有 remain 或者当前取到的数据个数大于展示的个数
    return (
      (remain || data.length > showLen) && tabsData.realname_status > showLen
    )
  }

  fetchData = (uid) => {
    const { currentUid } = this.props
    if (!uid && !currentUid) {
      return
    }

    const { page, showSize, showPage } = this.state

    this.props
      .dispatch({
        type: 'profile/fetchRealnameStatus',
        payload: {
          page,
          count: 10,
          u2: uid || currentUid,
        },
      })
      .then((data = {}) => {
        const feeds = data.feeds || []
        const d =
          page === 0
            ? feeds.filter((item) => ![1, 18].includes(item.type))
            : [...this.state.data, ...feeds].filter(
                (item) => ![1, 18].includes(item.type)
              )
        const showCount = (showPage + 1) * showSize
        const shouldFetchMore = data.remain && showCount > d.length

        this.setState(
          {
            data: d,
            remain: data.remain || 0,
            page: shouldFetchMore ? page + 1 : page,
          },
          () => {
            // 当数据不够的时候，继续请求下一页数据
            if (shouldFetchMore) {
              this.fetchData(uid)
            }
          }
        )
      })
  }

  handleLoadMore = () => {
    const { remain } = this.state

    // 没有更多数据可取，只增加实际展示的页数，不增加获取数据的页数
    if (!remain) {
      this.setState({
        showPage: this.state.showPage + 1,
      })
      return
    }

    this.setState(
      {
        showPage: this.state.showPage + 1,
        page: this.state.page + 1,
      },
      this.fetchData
    )
  }

  renderContent = (content) => {
    const { pics = [], card } = content
    const res = []
    if (pics.length > 0) {
      res.push(<FeedMultiImg pics={pics} key="multiImgs" />)
    }

    if (card) {
      res.push(<ArticleCard card={card} key="card" />)
    }

    return res
  }

  renderFeed = (feedInfo) => {
    const { main = {} } = feedInfo
    const { u: userInfo = {}, rtext = '', text = '' } = main
    const showText = rtext || text
    const line1 = (
      <React.Fragment>
        <Text type="title" size={14}>
          {userInfo.realname || '-'}
        </Text>
        <Text type="text-secondary" size={14} className="margin-left-8">
          {compact([userInfo.company, userInfo.position]).join('·')}
        </Text>
        {userInfo.judge === 1 && <Icon type="v" className="margin-left-4" />}
      </React.Fragment>
    )

    const line2 = (
      <Text type="text_week" size={14}>
        {feedInfo.crtime
          ? getMMTimeStr(feedInfo.crtime)
          : `${feedInfo.time || ''}`}
      </Text>
    )

    const line3 = showText ? (
      <Text type="text_primary" size={14}>
        <RichText text={showText} />
      </Text>
    ) : (
      ''
    )

    const line4 = this.renderContent(main)

    return (
      <div className="flex width-p100" key={feedInfo.id}>
        <FeedCard
          logoProps={{
            name: userInfo.realname,
            src: userInfo.avatar,
            shape: 'circle',
          }}
          line1={line1}
          line2={line2}
          line3={line3}
          line4={line4}
          className="margin-top-16 width-p100"
        />
      </div>
    )
  }

  render() {
    const { data = [], showSize, showPage } = this.state
    if (!data.length || !this.props.tabsData.realname_status) {
      return null
    }

    const showData = this.state.data.slice(0, showSize * (showPage + 1))

    return (
      <div className={styles.main} id={this.props.id}>
        <Text type="title" size={16}>
          {
            // ta的动态{this.props.tabsData.realname_status}条 8？*/
          }
          实名动态
        </Text>
        {showData.map(this.renderFeed)}
        {this.hasMore() && (
          <div className="flex flex-justify-center margin-top-20">
            <Button
              type="button_s_exact_link_bgray"
              onClick={this.handleLoadMore}
            >
              <span className="font-size-13">查看更多</span>
            </Button>
          </div>
        )}
      </div>
    )
  }
}
