import React from 'react'
// import * as R from 'ramda'
import Avatar from './../Avatar'
import Text from './../Text'

import styles from './index.less'

const defualtIconUrl =
  'https://maimai.cn/static/images/pc_feed_card_default.png'

export default class ArticleCard extends React.PureComponent {
  render() {
    const { card = {} } = this.props

    return (
      <a
        className={styles.main}
        href={card.target}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.left}>
          <Avatar
            src={card.avatar || defualtIconUrl}
            size={40}
            shape="square"
          />
        </div>
        <div className={styles.right}>
          <div>
            {!!card.isOriginal && <span className={styles.original} />}
            <Text type="text_primary" size={14}>
              {card.line1}
            </Text>
          </div>
          {card.line2 && (
            <Text type="text-secondary" className={styles.line2} size={13}>
              {card.line2}
            </Text>
          )}
        </div>
      </a>
    )
  }
}
