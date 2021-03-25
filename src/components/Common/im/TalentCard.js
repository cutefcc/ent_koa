import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import className from 'classnames'
import Avatar from 'components/Common/Avatar'
import ExtendButton from 'components/Common/ExtendButton'

import styles from './talentCard.less'

export default class TalentCard extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    onStateChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    onStateChange: () => {},
  }

  handleClick = () => {
    this.props.onClick(this.props.data)
  }

  handleModifyState = (state) => (e) => {
    e.stopPropagation()
    this.props.onStateChange(this.props.data.recruit_id, state)
  }

  handleStopPropagation = (e) => {
    e.stopPropagation()
  }

  handleShowProfile = (e) => {
    window.open(`/ent/profile/${this.props.data.id}?source=im`)
    e.stopPropagation()
  }

  renderExp = (exp = []) => {
    const renderItem = (item) => (
      <span className={styles.expItem}>
        {`${item.company} - ${item.position} - ${item.v} - ${item.worktime}`}
      </span>
    )

    return (
      <Popover
        className={styles.expPop}
        content={
          <span className={styles.expPopContent}>{exp.map(renderItem)}</span>
        }
        placement="bottom"
      >
        {exp.slice(0, 1).map(renderItem)}
      </Popover>
    )
  }

  renderEdu = (edu = []) => {
    const renderItem = (item) => (
      <span className={styles.eduItem}>
        {`${item.school} - ${item.sdegree} - ${item.v}`}
      </span>
    )
    return edu.map(renderItem)
  }

  render() {
    const { data, checked } = this.props
    const briefInfoData = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v)),
        R.pickAll([
          'city',
          'gender_str',
          'age',
          'sdegree',
          'worktime',
          'mobile',
        ])
      )(data)
    )

    return (
      <div
        className={className({
          [styles.card]: true,
          [styles.checkedCard]: checked,
        })}
        onClick={this.handleClick}
      >
        <div className={styles.basicInfo}>
          <div className={styles.avatarPanel} onClick={this.handleShowProfile}>
            <Avatar
              avatar={data.avatar}
              name={data.name}
              style={{
                width: '45px',
                height: '45px',
                fontSize: '30px',
                lineHeight: '45px',
              }}
            />
            {data.badge !== 0 && (
              <span className={styles.unreadTip}>{data.badge}</span>
            )}
          </div>
          <span className={styles.basicInfoBrief}>
            <span className={styles.basicInfoBriefTitle}>
              <h4>{data.name}</h4>
              <span>{R.propOr('无沟通职位', 'intend_position', data)}</span>
            </span>
            <span className={styles.basicInfoBriefContent}>
              {Object.values(briefInfoData).join(' | ')}
            </span>
          </span>
          <span className={styles.extendButtons}>
            <ExtendButton>
              <span
                key="suitable"
                onClick={
                  !this.props.data.mobile
                    ? this.handleStopPropagation
                    : this.handleModifyState('suitable')
                }
                className={!this.props.data.mobile ? 'disabled' : ''}
                title={
                  !this.props.data.mobile
                    ? '未获取到候选人手机号，不能通过筛选'
                    : '将候选人加到通过筛选列表'
                }
              >
                <CheckOutlined className={styles.myIcon} /> 通过筛选
              </span>
              <span
                key="unsuitable"
                onClick={this.handleModifyState('unsuitable')}
                className={styles.morePopSpan}
              >
                <CloseOutlined className={styles.myIcon} /> 不合适
              </span>
            </ExtendButton>
          </span>
        </div>
        <div className={styles.exp}>{this.renderExp(data.exp)}</div>
        <div className={styles.edu}>{this.renderEdu(data.edu)}</div>
      </div>
    )
  }
}
