import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Select } from 'antd'

import JobSelect from 'components/Common/JobSelect'
import { rightTypeMap } from 'constants/right'
import classnames from 'classnames'

import styles from './header.less'

@connect((state) => ({
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
}))
export default class Header extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string,
    onTypeChange: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    type: 'recommend',
  }

  handleTypeChange = (val, types) => {
    const find = R.findIndex(R.propEq('type', val))(types)
    const label = find > -1 ? R.propOr('', 'label', types[find]) : ''
    const value = find > -1 ? R.propOr('', 'value', types[find]) : ''
    this.trackEvent('jobs_pc_talent_recruit_follow_type_filter', {
      value,
      label,
    })
    this.props.onTypeChange(val)
  }

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  hanldeRightStateChange = (item) => () => {
    const { key, label } = item
    this.trackEvent('jobs_pc_talent_recruit_follow_state_filter', {
      value: key,
      label,
    })
    this.props.onFilterChange({
      ...this.props.filter,
      right_state: key,
    })
  }

  handleJidChange = (jid) => {
    const { jobs } = this.props
    const find = R.findIndex(R.propEq('jid', jid))(jobs)
    const position =
      find > -1 ? R.propOr('', 'position', jobs[find]) : '全部职位'
    const trackJid = find > -1 ? R.propOr('', 'jid', jobs[find]) : 0
    this.trackEvent('jobs_pc_talent_follow_position_filter', {
      position,
      jid: trackJid,
    })
    this.props.onFilterChange({
      ...this.props.filter,
      jid,
    })
  }

  renderStateSelection = () => {
    return (
      <div className={styles.stateSelection}>
        {R.pathOr([], [this.props.type, 'state'], rightTypeMap).map((item) => (
          <span
            onClick={this.hanldeRightStateChange(item)}
            className={classnames({
              [styles.item]: true,
              [styles.activeItem]: this.props.filter.right_state === item.key,
            })}
            key={item.key}
          >
            {item.label}
          </span>
        ))}
      </div>
    )
  }

  renderType = () => {
    const types = Object.values(rightTypeMap).filter((item) =>
      item.identity.includes(this.props.currentUser.identity)
    )
    return (
      <Select
        value={this.props.type}
        className={styles.type}
        onChange={(val) => this.handleTypeChange(val, types)}
        style={{ width: '100px' }}
      >
        {types.map((item) => (
          <Select.Option value={item.type} key={item.type}>
            {item.label === '立即邀约' ? '立即沟通' : item.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          {this.renderType()}
          {this.renderStateSelection()}
        </div>
        {R.pathOr([], [this.props.type, 'filterFields'], rightTypeMap).includes(
          'jid'
        ) && (
          <div className={styles.right}>
            <JobSelect
              data={this.props.jobs}
              onChange={this.handleJidChange}
              value={this.props.filter.jid}
            />
          </div>
        )}
      </div>
    )
  }
}
