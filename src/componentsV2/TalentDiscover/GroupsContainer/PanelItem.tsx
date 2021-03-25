// import React from 'react'
import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Tooltip } from 'antd'

import * as styles from './panelItem.less'

export interface Props {
  currentGroup: object
  data: object
  changeCurrentGroup: Function
  handleShowEidt: Function
  style: object
}

@connect((state) => ({
  currentGroup: state.talentDiscover.currentGroup,
}))
export default class List extends React.Component<Props> {
  renderContent = (title, total, isActive) => {
    return (
      <div>
        <div
          className={classnames({
            [styles.active]: isActive,
            [styles.count]: true,
          })}
        >
          {total}
        </div>
        <div
          className={classnames({
            [styles.active]: isActive,
            [styles.title]: true,
          })}
        >
          {title}
        </div>
      </div>
    )
  }
  render() {
    const { data, currentGroup } = this.props
    const { key, title, formatTotal, options } = data
    const isActive =
      R.equals(title, currentGroup.title) ||
      R.any(R.equals(currentGroup))(options)
    const tip = currentGroup.title
      ? `当前选中的分组为'${currentGroup.title}'`
      : ''
    const content = this.renderContent(title, formatTotal, isActive)
    return (
      <React.Fragment>
        <div
          key={key || title}
          className={`flex flex-column flex-align-center flex-justify-center ${
            styles.panelItemWrapper
          } ${isActive ? styles.active : ''}`}
        >
          {isActive ? (
            <Tooltip title={tip} placement="left">
              {content}
            </Tooltip>
          ) : (
            <div>{content}</div>
          )}
        </div>
        <div className={styles.gap}></div>
      </React.Fragment>
    )
  }
}
