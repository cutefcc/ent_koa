import React from 'react'
// import * as R from 'ramda'
import { connect } from 'react-redux'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import styles from './index.less'

@connect((state) => ({
  currentUid: state.profile.currentUid,
}))
export default class Group extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      data: { personal = [], enterprise = [] },
    } = this.props
    const enterpriseGroupText = enterprise.join('、')
    const personalGroupText = personal.join('、')
    if (personal.length === 0 && enterprise.length === 0) return null
    return (
      <div className={styles.group}>
        <div className={styles.top}>
          <div className={styles.title}>分组</div>
          <div className={styles.opeGroup}>
            <GroupButton
              key="editGroupButton"
              talents={[{ ...this.props.talent, id: this.props.currentUid }]}
              className="like-link-button font-size-13 margin-left-16"
              type="button_m_exact_link_bgray"
            >
              修改分组
            </GroupButton>
          </div>
        </div>
        {enterprise.length !== 0 && (
          <div
            className={styles.enterprise}
            style={personal.length !== 0 ? { marginBottom: '8px' } : {}}
          >
            <div className={styles.enterpriseLeft}>企业分组：</div>
            <div className={styles.enterpriseRight}>{enterpriseGroupText}</div>
          </div>
        )}
        {personal.length !== 0 && (
          <div className={styles.personal}>
            <div className={styles.personalLeft}>我的分组：</div>
            <div className={styles.personalRight}>{personalGroupText}</div>
          </div>
        )}
      </div>
    )
  }
}
