import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as styles from './index.less'

export interface Props {
  urlPrefix?: string
  dispatch?: (obj: object) => any
}

export interface State {}

@connect((state: any) => ({
  urlPrefix: state.global.urlPrefix,
}))
export default class Banner extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.banner}>
        <a
          href="https://a2.digoo.cn/2019/h5/07/ph1?fr=maimai_ent"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bannerLink}
        >
          <img
            src={`${this.props.urlPrefix}/images/banner.png`}
            alt="雇主品牌评选入围榜单"
            className={styles.bannerImg}
          />
        </a>
      </div>
    )
  }
}
