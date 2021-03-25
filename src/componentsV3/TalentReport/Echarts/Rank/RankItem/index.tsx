import * as React from 'react'
import { Popover } from 'antd'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  data: Array<Object>
  name: string
  showLine?: boolean
  insertKey: string
}

export interface State {}
export default class RankItem extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const { data, name, showLine } = this.props
    return (
      <div className={styles.rankItemMain}>
        {showLine && <div className={styles.lineStyle} />}
        <div className={styles.nameStyle}>{name}</div>
        {data &&
          data.map((item, index) => (
            <div key={index} className={styles.singleContentStyle}>
              {index < 3 ? (
                <div className={styles.showNum}>{index + 1}</div>
              ) : (
                <div className={styles.showNumSecond}>{index + 1}</div>
              )}

              <div className={styles.showText}>
                {R.pathOr('', ['name'], item)}
              </div>
            </div>
          ))}
      </div>
    )
  }
}
