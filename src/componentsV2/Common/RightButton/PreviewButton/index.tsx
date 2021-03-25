// 人才预览
import * as React from 'react'
import { Popover } from 'antd'
import * as R from 'ramda'

import * as styles from './index.less'
// import commonStyles from './commonButton.less'

export interface Props {
  data: object,
  showDetail: boolean,
  trackParam: object,
}

export default class InviteButton extends React.PureComponent<Props> {
  handleShowDetail = e => {
    e.preventDefault()
    e.stopPropagation()
    const { trackParam } = this.props
    if (window.voyager) {
      const key = 'jobs_pc_talent_profile_click'
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...trackParam,
        u2: R.pathOr(0, ['data', 'id'], this.props),
      }
      window.voyager.trackEvent(key, key, param)
      window.voyager.trackEvent('profile_exposure', 'profile_exposure', { ...param, exposure_channel: trackParam.fr || 'jobs_pc_talent' })
    }

    // const defaultProfile = `/ent/micro_resume/${this.props.data.id}?source=${
    //   this.props.source
    // }`
    const detailUrl = R.propOr('', 'detail_url', this.props.data)
    if (!detailUrl) {
      return
    }

    window.open(
      `${detailUrl}?biz=zhaopin&sid=${R.propOr(
        '',
        'sid',
        trackParam
      )}&type=${R.propOr('', 'type', trackParam)}`
    )
  }

  renderSingleExp = data => {
    return (
      <p className="color-common">
        {R.propOr('', 'company', data)}
        ·
        {R.propOr('', 'position', data)}
        ·
        {R.propOr('', 'worktime', data)}
      </p>
    )
  }

  renderSingleEdu = data => {
    return (
      <p className="color-common">
        {R.propOr('', 'school', data)}
        ·
        {R.propOr('', 'sdegree', data)}
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
        {!R.isNil(data.tags) &&
          !R.isEmpty(data.tags) && (
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
      <span onClick={this.handleShowDetail} className={this.props.className}>
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
