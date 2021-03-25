import * as React from 'react'
import * as styles from './index.less'

export interface Props {
  date: string
  comment?: string
  style?: object
  showDefault?: boolean
  loading?: boolean
}

export interface State {}
export default class EchartsBottom extends React.PureComponent<Props, State> {
  render() {
    const { date, comment, style, showDefault, loading } = this.props

    if (showDefault) {
      return null
    }

    return (
      <div style={style}>
        {comment ? (
          <div className={styles.wordStyleTop}>注：{comment}</div>
        ) : null}
        <div className={styles.wordStyle}>
          {loading ? <span>&nbsp;</span> : `统计日期：${date}`}
        </div>
      </div>
    )
  }
}
