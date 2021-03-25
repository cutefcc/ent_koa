// 人才预览
import React from 'react'
import { Popover, Button } from 'antd'
import { Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './previewButton.less'
// import commonStyles from './commonButton.less'

export default class InviteButton extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    buttonText: PropTypes.string,
    iconType: PropTypes.string,
    trackParam: PropTypes.object,
    showDetail: PropTypes.bool,
  }

  static defaultProps = {
    buttonText: '',
    iconType: '',
    trackParam: {},
    showDetail: true,
  }

  handleShowDetail = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { trackParam } = this.props
    if (window.voyager) {
      const key = 'jobs_pc_talent_profile_click'
      const param = {
        datetime: new Date().getTime(),
        u2: this.props.data.id,
        uid: window.uid,
        ...trackParam,
      }
      window.voyager.trackEvent(key, key, param)
      window.voyager.trackEvent('profile_exposure', 'profile_exposure', {
        ...param,
        exposure_channel: trackParam.fr || 'jobs_pc_talent',
      })
    }

    const defaultProfile = `/ent/micro_resume/${this.props.data.id}?source=${this.props.source}`
    const detailUrl = R.propOr(defaultProfile, 'detail_url', this.props.data)
    const result = await this.props.onGetUserLimit([this.props.data])
    if (result) {
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
    const button = this.props.children ? (
      <span onClick={this.handleShowDetail}>{this.props.children}</span>
    ) : (
      <Button onClick={this.handleShowDetail} className={this.props.className}>
        {this.props.iconType ? (
          <Icon
            type={this.props.iconType}
            className={styles.icon}
            theme="outlined"
          />
        ) : null}
        {this.props.buttonText}
      </Button>
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
