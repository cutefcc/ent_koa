import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import styles from './tab.less'

export default class Tab extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    activeKey: PropTypes.string.isRequired,
  }

  handleClick = (key) => () => {
    this.props.onClick(key)
  }

  render() {
    const tabs = [
      {
        key: 'addFr',
        label: '加好友追踪',
      },
      {
        key: 'directIm',
        label: '极速联系追踪',
      },
      // {
      //   key: 'suitable',
      //   label: '通过筛选',
      // },
      // {
      //   key: 'unsuitable',
      //   label: '不合适',
      // },
    ]
    return (
      <ul className={styles.tabs}>
        {tabs.map((item) => (
          <li
            key={item.key}
            className={classnames({
              [styles.active]: this.props.activeKey === item.key,
              [styles.item]: true,
            })}
          >
            <span onClick={this.handleClick(item.key)}>{item.label}</span>
          </li>
        ))}
      </ul>
    )
  }
}
