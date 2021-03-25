import * as React from 'react'
import * as styles from './index.less'

export interface Props {
  style?: object
}

export interface State {}
export default class DefaultReport extends React.PureComponent<Props, State> {
  render() {
    const { style } = this.props
    return (
      <div
        style={{ ...style, position: 'relative' }}
        className={styles.content}
      >
        <img className={styles.img} src={`/images/default_talent_report.png`} />
        <div className={styles.showTips}>暂无权限查看</div>
      </div>
    )
  }
}
