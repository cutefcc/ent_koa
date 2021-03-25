import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import Personal from 'componentsV2/Asset/Personal'
import PersonalCoupon from 'componentsV2/Asset/PersonalCoupon'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class PersonalIndex extends React.PureComponent {
  render() {
    const equitySysType = R.propOr(1, 'equity_sys_type', this.props.currentUser)
    return <div>{equitySysType === 1 ? <Personal /> : <PersonalCoupon />}</div>
  }
}
