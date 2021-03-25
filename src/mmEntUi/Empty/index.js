import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

class MMEmpty extends React.PureComponent {
  static propTypes = {
    image: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    description: '暂无数据',
    image: '',
  }

  render() {
    const { image, description, className = '' } = this.props
    return (
      <div className={`${styles.main} ${className}`}>
        {!!image && <img src={image} alt="empty" />}
        {!!description && <p className={styles.desc}>{description}</p>}
      </div>
    )
  }
}

export default MMEmpty
