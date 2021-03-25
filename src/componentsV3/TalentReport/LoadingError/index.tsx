import * as React from 'react'
import { MUIButton } from 'mm-ent-ui'
import * as styles from './index.less'
import EchartsTitle from 'componentsV3/TalentReport/EchartsTitle'

export interface Props {
  tips: string | any
  click: Function
  urlPrefix: string
}

export interface State {}
export default class LoadingError extends React.PureComponent<Props, State> {
  render() {
    const { tips, click, urlPrefix } = this.props
    return (
      <div className={styles.main}>
        <EchartsTitle title={`加载失败怎么办？`} />
        <div className={styles.subContent}>
          <img
            alt="empty_position"
            className={styles.errorImg}
            src={`${urlPrefix}/images/empty_position.png`}
          />
          <div className={styles.errorTips}>{tips}</div>
          <MUIButton
            type="mbutton_m_exact_blue450_l1"
            style={{
              height: '32px',
              width: '88px',
            }}
            onClick={() => click()}
          >
            点击重试
          </MUIButton>
        </div>
      </div>
    )
  }
}
