import React from 'react'
import { Popover, Popconfirm } from 'antd'
import PropTypes from 'prop-types'
import Text from './../Text'
// import Button from './../Button'
import styles from './index.less'

/**
 * popover 的参数参考 antd 中 popover 的参数传递
 * popover.confirm 的参数参考 popconfirm 的参数传递
 * */
class MMPopover extends React.PureComponent {
  static propTypes = {
    // content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    pagination: PropTypes.object, // 如果有该参数，会展示分页的按钮
  }

  static defaultProps = {
    // content: '',
    // {
    //   hasNextPage: false, // 是否还有下一页数据
    //   hasPrevPage: false, // 是否有上一页数据
    //   onPrevPageClick: () => {}, // 上一页
    //   onNextPageClick: () => {}, // 下一页
    // }
    pagination: undefined,
  }

  isEmptyTitle = () => {
    const { pagination, title = '' } = this.props
    return !pagination && !title
  }

  handleToPrevPage = () => {
    if (this.props.pagination.onPrevPageClick) {
      this.props.pagination.onPrevPageClick()
    }
  }

  handleToNextPage = () => {
    if (this.props.pagination.onNextPageClick) {
      this.props.pagination.onNextPageClick()
    }
  }

  renderPagination = () => {
    const { hasNextPage, hasPrevPage } = this.props.pagination
    const preClassName = `${styles.prev} ${
      hasPrevPage ? styles.available : styles.unAvailable
    }`
    const nextClassName = `${styles.next} ${
      hasNextPage ? styles.available : styles.unAvailable
    }`
    return (
      <div className={styles.prevAndNext}>
        <span
          className={preClassName}
          onClick={hasPrevPage ? this.handleToPrevPage : null}
        >
          上一页
        </span>
        <span
          className={nextClassName}
          onClick={hasNextPage ? this.handleToNextPage : null}
        >
          下一页
        </span>
      </div>
    )
  }

  renderContent = () => {
    const { content } = this.props
    const isTitleEmpty = this.isEmptyTitle()
    return (
      <div
        className={`${styles.content} ${
          isTitleEmpty ? styles.contentWithoutTitle : ''
        }`}
        key="content"
        style={
          this.props.width
            ? {
                width: this.props.width,
              }
            : {}
        }
      >
        {content}
      </div>
    )
  }

  renderTitle = () => {
    const { pagination, title = '' } = this.props
    if (!pagination && !title) {
      return null
    }

    return (
      <div className={styles.title} key="title">
        <Text type="title" size={16}>
          {title}
        </Text>
        {!!pagination && this.renderPagination()}
      </div>
    )
  }
  render() {
    return (
      <Popover
        {...this.props}
        overlayClassName={`${styles.popover} ${this.props.overlayClassName} ${
          styles[`popover_${this.props.type}`]
        }`}
        title={this.isEmptyTitle() ? '' : this.renderTitle()}
        content={this.renderContent()}
      >
        {this.props.children}
      </Popover>
    )
  }
}

MMPopover.Confirm = (props) => {
  const { showIcon = false } = props
  return (
    <Popconfirm
      {...props}
      width={props.width || 300}
      cancelText={props.cancelText || '取消'}
      okText={props.okText || '确定'}
      title={props.title}
      overlayClassName={`${styles.confirm} ${
        showIcon ? '' : styles.confirmHideIcon
      } ${props.overlayClassName || ''}`}
    >
      {props.children}
    </Popconfirm>
  )
}

export default MMPopover
