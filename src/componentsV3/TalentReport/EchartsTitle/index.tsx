import * as React from 'react'
import { Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import * as styles from './index.less'

export interface Props {
  title: String
  tips?: String
}

export interface State {}
export default class EchartsTitle extends React.PureComponent<Props, State> {
  render() {
    const { title, tips } = this.props
    return (
      <div className={styles.main}>
        <div className={styles.leftIcon} />
        <span className={styles.rightWord}>{title}</span>
        {tips && (
          <Popover
            autoAdjustOverflow={false}
            placement="top"
            content={tips}
            trigger={['hover', 'click']}
          >
            <QuestionCircleOutlined
              className={styles.rightWordTips}
              style={{ color: '#b1b6c1' }}
            />
          </Popover>
        )}
      </div>
    )
  }
}
