import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import styles from './upgradeMemberTip.less'
// import * as R from 'ramda'

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class UpgradeMemberTip extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    hasAngle: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    hasAngle: true,
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
      },
    })
  }

  render() {
    const { hasAngle = true } = this.props
    const imgName = hasAngle ? 'banner_2.png' : 'recharge_senior.png'
    return (
      <div
        onClick={this.handleShowUpgradeMember}
        className={`${styles.tip} ${this.props.className}`}
      >
        <img
          src={`${this.props.urlPrefix}/images/memberBg/${imgName}`}
          alt="当前人才银行版本不具有查看该功能的权限"
        />
        {/* <div className={styles.title}>
          <img
            className={styles.titleLevel1}
            src={`${
              this.props.urlPrefix
            }/images/memberBg/upgrade_member_title.png`}
            alt=""
          />
          <span className={styles.titleLevel2}>
            使用完整版人才增长走势、人才动态等功能
          </span>
        </div>
        <div className={styles.button}>
          <img
            className={styles.titleLevel1}
            src={`${
              this.props.urlPrefix
            }/images/memberBg/upgrade_member_button.png`}
            alt=""
          />
          </div> */}
      </div>
    )
  }
}
