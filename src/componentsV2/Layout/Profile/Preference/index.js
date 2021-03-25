import React from 'react'
import { Text } from 'mm-ent-ui'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import * as model from './../model'
import styles from './index.less'

export default class Preference extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  jobPreferenceLabelMap = [
    {
      label: '求职状态',
      key: ['hunt_state', 'value'],
    },
    {
      label: '期望城市',
      key: ['province_cities'],
    },
    {
      label: '期望职位',
      key: ['positions'],
    },
    {
      label: '期望行业',
      key: ['profession_majors'],
      render: (v) => (R.is(String, v) ? v.replace(/\|/g, '\n') : v),
      // render: v => (R.is(String, v) ? R.v.split('|') :
    },
    {
      label: '期望薪资',
      key: ['salary'],
    },
  ]

  renderPreferenceItem = (key, value) => {
    if (!value) {
      return null
    }
    return (
      <dt key={key} className="margin-top-8 flex">
        <Text type="text_primary" size={14} className="word-keep-all">
          {key}：
        </Text>
        <Text type="text_primary" size={14} className="white-space-preline">
          {value}
        </Text>
      </dt>
    )
  }

  renderJobPreference = () => {
    const {
      data: { job_preference: jobPreference = {} },
    } = this.props
    if (model.isJobPreferenceEmpty(jobPreference)) {
      return null
    }

    return (
      <div className={styles.facet}>
        <Text type="title" size={16}>
          求职偏好
        </Text>
        <dl className="width-p100 margin-top-12">
          {this.jobPreferenceLabelMap.map((conf) => {
            const key = conf.label
            const value = R.pathOr('', conf.key, jobPreference)
            const v = conf.render ? conf.render(value) : value
            return this.renderPreferenceItem(key, v)
          })}
        </dl>
      </div>
    )
  }

  renderResumeItem = (item) => {
    return (
      <dt className="flex flex-justify-space-between margin-top-8">
        <Text
          type="text_primary"
          size={14}
          maxLine={1}
          className="flex-1 overflow-hidden ellipsis margin-right-8"
        >
          {item.position}
        </Text>
        <Text type="text_secondary" size={14} className="">
          {item.uptime}
        </Text>
      </dt>
    )
  }

  renderResumeBadges = () => {
    const {
      data: { resume_badges: resumeBadges = [] },
    } = this.props

    if (model.isResumeBadgeEmpty(resumeBadges)) {
      return null
    }

    return (
      <div className={styles.facet}>
        <Text type="title" size={16}>
          近期偏好{resumeBadges.length}条
        </Text>
        <dl className="width-p100 margin-top-12 margin-bottom-0">
          {resumeBadges.map(this.renderResumeItem)}
        </dl>
      </div>
    )
  }

  render() {
    return (
      <div id={this.props.id}>
        {this.renderJobPreference()}
        {this.renderResumeBadges()}
      </div>
    )
  }
}
