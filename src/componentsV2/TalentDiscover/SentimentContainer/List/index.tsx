import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { CURRENT_TAB } from 'constants/sentiment'
import { Spin, Empty, Text } from 'mm-ent-ui'
import { Pagination } from 'antd'
import EmptyTip from '../Empty'
import * as Highlighter from 'react-highlight-words'
import * as styles from './index.less'

export interface Props {
  loading: boolean
  data: object
  pagination: object
  currentTab: string
  urlPrefix: string
  currentSubscribe: object
  dispatch: Function
}

export interface State {}

@connect((state) => ({
  loading: state.loading.effects['sentiment/fetchSentimentData'],
  urlPrefix: state.global.urlPrefix,
  data: state.sentiment.sentimentData,
  pagination: state.sentiment.paginationParam,
  currentSubscribe: state.sentiment.currentSubscribe,
  currentTab: state.sentiment.currentTab,
  bprofileUser: state.global.bprofileUser,
}))
export default class SentimentListContainer extends React.PureComponent<
  Props,
  State
> {
  handleGoOrigin = (url) => {
    window.open(url)
  }

  handleGetSentimentComment = (item, query) => {
    const postId = R.pathOr('', ['post_id'], item)
    const webcid = R.path(['props', 'bprofileUser', 'company', 'webcid'], this)
    this.props
      .dispatch({
        type: 'sentiment/fetchSentimentComment',
        payload: { ...query, webcid },
      })
      .then((res) => {
        const {
          code,
          data: { list, total },
        } = res
        const oldList = R.pathOr([], ['props', 'data', 'list'], this)
        oldList.length > 0 &&
          oldList.forEach((obj) => {
            if (obj.post_id === postId) {
              obj.comments.comment_data = list
              obj.enableShowMore = false
              obj.pagination = {
                ...obj.pagination,
                page: query.page,
              }
            }
          })
        if (code === 0) {
          this.props.dispatch({
            type: 'sentiment/setSentimentData',
            payload: { ...this.props.data, list: oldList },
          })
        }
      })
  }

  handleShowMore = (item) => {
    const postId = R.pathOr('', ['post_id'], item)
    const query = {
      page: 0,
      size: 8,
      words_id: R.pathOr('', ['props', 'currentSubscribe', 'id'], this),
      data_type:
        R.pathOr('gossip', ['props', 'currentTab'], this) === 'gossip'
          ? '1'
          : '2',
      post_id: postId,
    }
    this.handleGetSentimentComment(item, query)
  }

  handlePageChange = (item, page) => {
    const postId = R.pathOr('', ['post_id'], item)
    const query = {
      page: page - 1,
      size: R.pathOr(8, ['pagination', 'size'], item),
      words_id: R.pathOr('', ['props', 'currentSubscribe', 'id'], this),
      data_type:
        R.pathOr('gossip', ['props', 'currentTab'], this) === 'gossip'
          ? '1'
          : '2',
      post_id: postId,
    }
    this.handleGetSentimentComment(item, query)
  }

  renderContent = () => {
    const { loading } = this.props
    const list = R.pathOr([], ['props', 'data', 'list'], this)
    return (
      <div>
        {!loading && list.map((item) => this.renderCard(item))}
        {this.renderDefault()}
      </div>
    )
  }

  renderDefault = () => {
    const { loading, currentSubscribe, currentTab } = this.props
    const list = R.pathOr([], ['props', 'data', 'list'], this)
    const isEmptySubscribe = R.isEmpty(currentSubscribe)
    const isEmptyList = list.length === 0
    const emptyText =
      currentTab === CURRENT_TAB.gossip ? '暂无职言信息' : '暂无动态信息'

    return [
      !loading && isEmptySubscribe && (
        <EmptyTip description={'订阅舆情监控，获取最新动态'} />
      ),
      !loading && !isEmptySubscribe && isEmptyList && (
        <Empty
          image={`${this.props.urlPrefix}/images/empty_position.png`}
          description={emptyText}
        />
      ),
      loading && (
        <Spin
          type={isEmptyList ? 'empty-list' : 'unempty-list'}
          key="loading"
        />
      ),
    ]
  }

  renderCard = (item) => {
    const hasComments = !R.isEmpty(
      R.pathOr({}, ['comments', 'comment_data'], item)
    )
    const commentTotal = R.pathOr(0, ['comments', 'comment_total'], item)
    const page = R.pathOr(0, ['pagination', 'page'], item)
    const size = R.pathOr(8, ['pagination', 'size'], item)

    let imageUrl = ''
    const {
      text,
      pics = [],
      comment_cnt: commentCount,
      detail_url: url,
      like_cnt: likeCount,
      crtime,
      quote_card: quoteCard = {},
    } = item
    let quoteTitle
    let quoteTarget
    let titleTag
    let icon
    const hasQuote = !R.isEmpty(quoteCard)
    if (hasQuote) {
      quoteTitle = R.pathOr('', ['card', 'title'], quoteCard)
      quoteTarget = R.pathOr('', ['card', 'target'], quoteCard)
      titleTag = R.pathOr('', ['card', 'title_tag'], quoteCard)
      icon = R.pathOr('', ['card', 'icon'], quoteCard)
    }
    if (pics.length > 0) {
      imageUrl = pics[0].turl || pics[0].url || pics[0].ourl
    }
    return (
      <div
        className={styles.itemWrapper}
        // onClick={() => this.handleGoOrigin(url)}
        key={text}
      >
        <div className={styles.text} onClick={() => this.handleGoOrigin(url)}>
          {hasQuote && (
            <div className={styles.quote}>
              <p className={styles.quoteTitle}>
                {text}
                {/* {
                  titleTag && <span className={styles.titleTag}>{titleTag}</span>
                } */}
              </p>
              <div className={`${styles.quoteBlock}`}>
                {icon && (
                  <img className={styles.icon} src={icon} alt="thumbnail" />
                )}
                <span>{quoteTitle}</span>
              </div>
            </div>
          )}
          {!hasQuote && (
            <Highlighter
              highlightStyle={{
                color: 'red',
                padding: 0,
                backgroundColor: '#fff',
              }}
              searchWords={[
                R.pathOr('', ['props', 'currentSubscribe', 'words'], this),
                ...R.pathOr([], ['props', 'data', 'segments'], this),
              ]}
              textToHighlight={text || ''}
              autoEscape={true}
            />
          )}
        </div>
        {imageUrl && (
          <img
            className={styles.img}
            src={imageUrl}
            alt="origin"
            onClick={() => this.handleGoOrigin(url)}
          />
        )}
        <div className={styles.time} onClick={() => this.handleGoOrigin(url)}>
          <span>{likeCount}赞</span>
          <span> · </span>
          <span>{commentCount}评论</span>
          <span> · </span>
          <span>{crtime}</span>
        </div>
        {hasComments && (
          <div className={styles.comments}>
            <span className={styles.topIcon}></span>
            <Text
              type="text_primary"
              size={12}
              style={{ marginBottom: '16px', color: '#222' }}
            >
              相关评论
            </Text>
            {R.pathOr([], ['comments', 'comment_data'], item).map(
              this.renderCommentList
            )}
            {commentTotal > 3 && item.enableShowMore && (
              <div className={styles.showMore}>
                还有{commentTotal - 3}条评论{' '}
                <span
                  style={{ color: '#3B7AFF', cursor: 'pointer' }}
                  onClick={() => {
                    this.handleShowMore(item)
                  }}
                >
                  展开更多
                </span>
              </div>
            )}
            {commentTotal > 8 && !item.enableShowMore && (
              <div style={{ textAlign: 'right' }}>
                <Pagination
                  total={commentTotal}
                  pageSize={size}
                  current={page + 1}
                  // showQuickJumper
                  onChange={(page) => {
                    this.handlePageChange(item, page)
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  renderCommentList = (item, index) => {
    return (
      <div
        key={`${item.text}-${index}`}
        className={styles.commentItem}
        title={item.text}
      >
        <span style={{ color: '#999' }}>{`${item.name}：`}</span>
        <Highlighter
          highlightStyle={{
            color: 'red',
            padding: 0,
            backgroundColor: '#F8F8FA',
          }}
          searchWords={[
            R.pathOr('', ['props', 'currentSubscribe', 'words'], this),
            ...R.pathOr([], ['props', 'data', 'segments'], this),
          ]}
          textToHighlight={`${item.text}` || ''}
          autoEscape={true}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.sentimentListWrapper}>
        <div className="position-relative">
          <div className={styles.content}>{this.renderContent()}</div>
        </div>
      </div>
    )
  }
}
