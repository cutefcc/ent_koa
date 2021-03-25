import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'
import * as styles from './index.less'

export interface Props {
  items: object[]
}

export interface State {
  currentindex: number
}

@connect()
@withRouter
export default class BreadCrumbs extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClick = (item, isCurrent) => {
    if (!isCurrent) {
      this.props.history.push(item.toUrl)
    }
  }

  render() {
    const { items } = this.props
    const currentindex = items.length - 1
    return (
      <div className={styles.breadCrumbsCon}>
        {items.map((item, index) => {
          const isCurrent = currentindex === index
          // 最后一个
          if (items.length === index + 1) {
            return (
              <span
                onClick={() => this.handleClick(item, isCurrent)}
                key={`${item.toUrl}${index}`}
                className={`${
                  isCurrent ? styles.currentItem : styles.notCurrentItem
                } font-size-14`}
              >
                {item.text}
              </span>
            )
          }
          return (
            <span key={`${item.toUrl}${index}`}>
              <span
                onClick={() => this.handleClick(item, isCurrent)}
                className={`${
                  isCurrent ? styles.currentItem : styles.notCurrentItem
                } font-size-14`}
              >
                {item.text}
              </span>
              <span className={`${styles.segmentation}`}>&nbsp;&gt;&nbsp;</span>
            </span>
          )
        })}
      </div>
    )
  }
}
