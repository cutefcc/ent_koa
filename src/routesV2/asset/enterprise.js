import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import Enterprise from 'componentsV2/Asset/Enterprise'
import EnterpriseCoupon from 'componentsV2/Asset/EnterpriseCoupon'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class EnterpriseIndex extends React.PureComponent {
  render() {
    const equitySysType = R.propOr(1, 'equity_sys_type', this.props.currentUser)
    return (
      <div>{equitySysType === 1 ? <Enterprise /> : <EnterpriseCoupon />}</div>
    )
  }
}
