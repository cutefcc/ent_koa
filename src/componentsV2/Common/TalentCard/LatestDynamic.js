import React from 'react'
import { Icon } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styles from './LatestDynamic.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class LatestDynamic extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { data, onShowDynamicModal } = this.props
    const { latestDynamic = {} } = data
    const {
      dynamic_cnt: dynamicCnt = 0,
      recent_dynamic: recentDynamic = '',
    } = latestDynamic
    if (dynamicCnt === 0) return null
    return (
      <div className={`${styles.dynamicCon}`} onClick={onShowDynamicModal}>
        {!(
          !R.propOr(0, 'friends_cnt', data) &&
          !R.propOr(0, 'browse_cnt', data) &&
          !R.propOr(0, 'remark_cnt', data) &&
          !R.pathOr(0, ['group_cnt'], data)
        ) && <div className={styles.segmentation} />}
        <span className={styles.dynamicNum}>动态 {dynamicCnt}</span>
        <Icon
          type="arrow-right"
          className={`${styles.dynamicIcon} arrow-right-2`}
        />
        <div
          className={`${styles.firstDynamic} like-link-button`}
          title={recentDynamic}
        >
          {recentDynamic}
        </div>
      </div>
    )
  }
}
