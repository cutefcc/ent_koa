import * as React from 'react'
import { connect } from 'react-redux'
import { checkIsTrial } from 'utils'

import * as styles from './upgradeMemberTip.less'

export interface Props {
  currentUser: object
  urlPrefix: string
  className: string
  hasAngle: boolean
}

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class UpgradeMemberTip extends React.Component<Props> {
  handleShowUpgradeMember = () => {
    if (checkIsTrial()) {
      this.props.dispatch({
        type: 'global/setMemberOpenTip',
        payload: {
          show: true,
          msg: '开通招聘企业版 解锁更多功能',
          cancelTxt: '放弃开通',
          confirmTxt: '立即开通',
        },
      })
    } else {
      this.props.dispatch({
        type: 'global/setMemberUpgradeTip',
        payload: {
          show: true,
        },
      })
    }
  }

  render() {
    const { hasAngle = true, version } = this.props
    let imgName = hasAngle ? 'banner_2.png' : 'recharge_senior.png'
    if (version === '3.0') {
      imgName = 'banner1.png'
    }
    return (
      <div
        onClick={this.handleShowUpgradeMember}
        className={`${styles.tip} ${this.props.className}`}
      >
        <img
          src={`${this.props.urlPrefix}/images/memberBg/${imgName}`}
          alt="当前人才银行版本不具有查看该功能的权限"
          style={{
            left: version === '3.0' ? '-16px' : '0px',
            width: version === '3.0' ? 'calc(100% + 16px)' : '100%',
          }}
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
