import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import styles from './PaginationWrapPopover.less'

/*
 *带分页 的 popover 内容容器
 */
@connect(() => ({}))
export default class PaginationWrapPopover extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: 0, // 初始值 设置为0 是为了判断是否是第一次加载
      isShowPagination: false,
      isPreviousAvailable: false,
      isNextAvailable: false,
      page: 0,
      size: 20,
      total: 0,
      data: [],
    }
  }

  componentDidMount() {
    this.handleChangePage(0)
  }

  componentWillReceiveProps(nextProps) {
    const { bigTitle } = nextProps
    const { bigTitle: oldBigTitle } = this.props
    if (bigTitle !== oldBigTitle) {
      this.refreshData()
    }
  }

  refreshData = () => {
    this.setState(
      {
        isLoading: 0,
        isShowPagination: false,
        isPreviousAvailable: false,
        isNextAvailable: false,
        page: 0,
        size: 20,
        total: 0,
        data: [],
      },
      () => {
        this.handleChangePage(0)
      }
    )
  }

  fetchdata = () => {
    const { page } = this.state
    const { dispatchQuery, total } = this.props
    const size = R.propOr(this.state.size, 'size', dispatchQuery.payload)
    dispatchQuery.payload = Object.assign({}, dispatchQuery.payload, {
      page,
      size,
    })
    this.props.dispatch(dispatchQuery).then(({ data }) => {
      let totalNum = 0
      if (data && data[total]) {
        totalNum = data[total]
      }
      this.setState({
        isLoading: false,
        size,
        data,
        total: totalNum,
        isNextAvailable: totalNum > (page + 1) * size,
        isPreviousAvailable: page >= 1,
        isShowPagination: totalNum > size,
      })
    })
  }

  handlePrevPage = () => {
    const { page } = this.state
    if (page <= 0) return
    this.handleChangePage(page - 1)
  }

  handleNextPage = () => {
    const { page, total, size } = this.state
    if (total <= (page + 1) * size) return
    this.handleChangePage(page + 1)
  }

  handleChangePage = (page) => {
    const { isLoading } = this.state
    if (isLoading === 0 || !isLoading) {
      this.setState(
        {
          page,
          isLoading: true,
        },
        () => {
          this.fetchdata()
        }
      )
    }
  }

  renderPagination = () => {
    const { isNextAvailable, isPreviousAvailable } = this.state
    const preClassName = `${styles.prev} ${
      isPreviousAvailable ? styles.available : styles.unAvailable
    }`
    const nextClassName = `${styles.next} ${
      isNextAvailable ? styles.available : styles.unAvailable
    }`
    return (
      <div className={styles.prevAndNext}>
        <span className={preClassName} onClick={this.handlePrevPage}>
          上一页
        </span>
        <span className={nextClassName} onClick={this.handleNextPage}>
          下一页
        </span>
      </div>
    )
  }

  renderLoading = () => {
    return (
      <p className="text-center margin-top-32">
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }

  render() {
    const { ChildComponent, bigTitle, onAvatarClick = () => {} } = this.props
    const [leftText, rightText] = Array.isArray(bigTitle) ? bigTitle : []
    const { data, total, isShowPagination, isLoading } = this.state
    return (
      <div className={styles.paginationWrapPopover}>
        {isLoading === 0 || isLoading ? (
          this.renderLoading()
        ) : (
          <div>
            <div className={styles.top}>
              {Array.isArray(bigTitle) && (
                <div className={styles.bigTitle}>
                  {leftText}
                  {total}
                  {rightText}
                </div>
              )}
              {typeof bigTitle === 'string' && (
                <div className={styles.bigTitle}>{bigTitle}</div>
              )}
              {isShowPagination && this.renderPagination()}
            </div>
            <div className={styles.content}>
              <ChildComponent data={data} onAvatarClick={onAvatarClick} />
            </div>
            <div className={styles.bottom}>
              {isShowPagination && this.renderPagination()}
            </div>
          </div>
        )}
      </div>
    )
  }
}
