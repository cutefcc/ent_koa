// 人才预览
import React from 'react'
import { Popover } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'

import styles from './index.less'
// import commonStyles from './commonButton.less'

@connect((state) => ({
  profileUids: state.profile.uids,
}))
export default class PreviewButton extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    trackParam: PropTypes.object,
    showDetail: PropTypes.bool,
    clearHistory: PropTypes.bool, // 是否清空历史 profile 浏览记录
  }

  static defaultProps = {
    trackParam: {},
    showDetail: false,
    clearHistory: true,
  }

  handleShowDetail = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { trackParam, profileUids = [], clearHistory, fr } = this.props
    const uid = R.pathOr(0, ['data', 'uid'], this.props)
    const u2 = R.pathOr(uid, ['data', 'id'], this.props)
    if (window.voyager) {
      const key = 'jobs_pc_talent_profile_click'
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...trackParam,
        u2,
      }
      window.voyager.trackEvent(key, key, param)
      window.voyager.trackEvent('profile_exposure', 'profile_exposure', {
        ...param,
        exposure_channel: trackParam.fr || 'jobs_pc_talent',
      })
    }

    if (!u2) {
      return
    }

    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        visible: true, // 是否展示 profile
        uids: [...(clearHistory ? [] : profileUids), u2], // profile队列中所有 uid，每次关闭 profile 的时候会清空
        currentIndex: profileUids.length,
        currentUid: u2,
        trackParam,
        fr,
      },
    })
  }

  renderSingleExp = (data) => {
    return (
      <p className="color-common">
        {R.propOr('', 'company', data)}·{R.propOr('', 'position', data)}·
        {R.propOr('', 'worktime', data)}
      </p>
    )
  }

  renderSingleEdu = (data) => {
    return (
      <p className="color-common">
        {R.propOr('', 'school', data)}·{R.propOr('', 'sdegree', data)}
      </p>
    )
  }

  renderDetail = () => {
    const { data } = this.props
    return (
      <div className={styles.popContent}>
        {R.pathOr(0, ['exp', 'length'], data) > 0 && (
          <p className={styles.item}>
            <span className={styles.label}>现任</span>
            {this.renderSingleExp(R.pathOr({}, ['exp', 0], data))}
          </p>
        )}
        {R.pathOr(0, ['exp', 'length'], data) > 1 && (
          <p className={styles.item}>
            <span className={styles.label}>曾任</span>
            <p>{data.exp.slice(1).map(this.renderSingleExp)}</p>
          </p>
        )}
        {R.pathOr(0, ['edu', 'length'], data) > 0 && (
          <p className={styles.item}>
            <span className={styles.label}>学历</span>
            <p>{data.edu.map(this.renderSingleEdu)}</p>
          </p>
        )}
        {!R.isNil(data.tags) && !R.isEmpty(data.tags) && (
          <p className={styles.item}>
            <span className={styles.label}>技能</span>
            <p className="color-common">{data.tags.split(',').join('·')}</p>
          </p>
        )}
        {R.pathOr(0, ['highlights', 'length'], data) > 0 && (
          <p className={styles.item}>
            <span className={styles.label}>亮点</span>
            <span className="color-orange">
              {data.highlights.map(R.prop('name')).join('·')}
            </span>
          </p>
        )}
      </div>
    )
  }

  render() {
    const button = (
      <span
        onClick={this.props.onClick || this.handleShowDetail}
        className={this.props.className}
      >
        {this.props.children || this.props.buttonText}
      </span>
    )
    return this.props.showDetail ? (
      <Popover content={this.renderDetail()} className={this.props.className}>
        {button}
      </Popover>
    ) : (
      button
    )
  }
}
