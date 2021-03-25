import React from 'react'
import PropTypes from 'prop-types'
import Button from './../Button'
import styles from './index.less'

class MMListFooter extends React.PureComponent {
  static propTypes = {
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func,
  }

  static defaultProps = {
    hasMore: false,
    onLoadMore: () => {},
  }

  render() {
    return (
      <p className={styles.main}>
        {this.props.hasMore ? (
          <Button type="likeLink" onClick={this.props.onLoadMore}>
            点击加载更多
          </Button>
        ) : (
          <span className={styles.noMore}>没有更多数据</span>
        )}
      </p>
    )
  }
}

export default MMListFooter
