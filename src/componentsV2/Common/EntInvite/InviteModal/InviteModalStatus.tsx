import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'

import * as styles from './inviteModalStatus.less'

const tipsIcons = {
  0: ['active', 'active'],
  1: ['normal', 'active'],
  2: ['active', 'normal'],
  3: ['active', 'normal'],
  100: ['active', 'active'],
}

const statusImageMap = {
  '0': '/images/entInvite/invite_status_0.png',
  '1': '/images/entInvite/invite_status_2.png',
  '2': '/images/entInvite/invite_status_3.png',
  '3': '/images/entInvite/invite_status_3.png',
  '100': '/images/entInvite/invite_status_1.png',
}

export interface Props {
  status: number
  handleIconClick: Function
}

@connect((state) => ({
  urlPrefix: state.global.urlPrefix,
}))
export default class InviteModalStatus extends React.PureComponent<Props> {
  renderIcons = () => {
    const { status } = this.props
    return tipsIcons[status].map((v, k) => (
      <img
        className={`${styles.tipsIcon} tipsIcon-${k}`}
        src={`${this.props.urlPrefix}/images/entInvite/tips_${v}.png`}
        alt="tips"
        onClick={() => this.props.handleIconClick(k)}
      />
    ))
  }

  render() {
    const { status = 0, urlPrefix } = this.props
    const suffix = R.pathOr('', [status], statusImageMap)
    const img = suffix ? `${urlPrefix}${suffix}` : ''
    return (
      <div className={styles.statusImageWrapper}>
        <img className={styles.statusImage} src={img} alt="statusImage" />
        {this.renderIcons()}
      </div>
    )
  }
}
