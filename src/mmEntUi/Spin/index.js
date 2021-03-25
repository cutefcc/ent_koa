import React from 'react'
import PropTypes from 'prop-types'
import Loading from './../Loading'
import styles from './index.less'

class MMSpin extends React.PureComponent {
  static propTypes = {
    desc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: PropTypes.string,
  }

  static defaultProps = {
    desc: '加载中',
    type: 'unempty-list',
  }

  renderUnemptyListLoading = () => (
    <p className={styles.unemptyListLoading}>
      <Loading />
      <span>{this.props.desc}</span>
    </p>
  )

  renderEmptyListLoading = () => (
    <p className={styles.emptyListLoading}>
      <Loading />
      <span>{this.props.desc}</span>
    </p>
  )

  render() {
    const renderMap = {
      'unempty-list': this.renderUnemptyListLoading,
      'empty-list': this.renderEmptyListLoading,
    }
    const renderFuc = renderMap[this.props.type]
    if (!renderFuc) {
      return this.renderUnemptyListLoading()
    }
    return renderFuc()
  }
}

export default MMSpin
