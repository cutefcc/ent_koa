import React from 'react'
import styles from './campaign.less'

export default class Camapign extends React.PureComponent {
  state = {}

  render() {
    return (
      <div className={styles.content}>
        <img
          // src={campaignImgUrl}
          src="/ent/images/campaign.png"
          alt="promote"
          href="http://a2.digoo.cn/h5/002/"
        />
      </div>
    )
  }
}
