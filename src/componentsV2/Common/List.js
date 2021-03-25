import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import defaultImgUrl from 'images/default.png'

import ScrollObserver from 'componentsV2/Common/ScrollObserver'

import styles from './list.less'

class List extends React.Component {
  static propTypes = {
    renderList: PropTypes.func.isRequired,
    renderDefaultTip: PropTypes.func,
    loadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    // renderSearch: PropTypes.func,
    renderBatchOperation: PropTypes.func,
    dataLength: PropTypes.number.isRequired,
    remain: PropTypes.number.isRequired,
    search: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }

  static defaultProps = {
    renderBatchOperation: () => null,
    // renderSearch: () => null,
    renderDefaultTip: () => {
      return (
        <div className={`${styles.centerTip} ${styles.defaultTip}`}>
          <img src={defaultImgUrl} alt="defaultImg" />
          请输入查询关键词!
        </div>
      )
    },
  }

  renderEmpty = () => {
    return (
      <div className={styles.centerTip}>
        {this.props.emptyTip || '没有搜索结果'}
      </div>
    )
  }

  renderLoading = () => {
    return (
      <div className={styles.centerTip}>
        <LoadingOutlined /> 正在努力加载数据！
      </div>
    )
  }

  renderMore = () => (
    <div
      className={`${styles.centerTip} ${styles.more}`}
      ref={(dom) => {
        this.container = dom
      }}
    >
      {this.props.remain ? (
        <span onClick={this.props.loadMore} className={styles.loadMore}>
          {!this.props.errorCode ? '点击加载更多...' : '出错了，请点击重试'}
        </span>
      ) : (
        '没有更多数据'
      )}
    </div>
  )

  render() {
    const {
      loading,
      // renderSearch,
      renderList,
      renderBatchOperation,
      dataLength,
      search,
      loadMore,
      remain,
    } = this.props
    const target = document.getElementById('content')
    return (
      <ScrollObserver
        onScrollToBottom={remain && !this.props.errorCode ? loadMore : () => {}}
        target={target}
        setScrollDom={this.props.setScrollDom}
        scrollDom={this.props.scrollDom}
      >
        <div className={`${styles.content} commonList`}>
          {
            // renderSearch ? renderSearch() : null
          }
          {dataLength > 0 && renderBatchOperation
            ? renderBatchOperation()
            : null}
          {dataLength > 0 ? renderList() : null}
          {loading ? this.renderLoading() : null}
          {!loading && search !== '' && dataLength > 0
            ? this.renderMore()
            : null}
          {!loading && dataLength === 0 && search !== ''
            ? this.renderEmpty()
            : null}
          {!loading && search === '' && !dataLength
            ? this.props.renderDefaultTip()
            : null}
        </div>
      </ScrollObserver>
    )
  }
}

export default List
