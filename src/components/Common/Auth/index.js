import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'

export default function (WrapperComponent) {
  @withRouter
  @connect((state) => ({
    auth: state.global.auth,
  }))
  class Auth extends React.PureComponent {
    componentDidMount() {
      if (R.path(['auth', 'isEnterpriseRecruiter'], this.props)) {
        this.redirectToNewVersion()
      }
    }

    componentWillReceiveProps(newProps) {
      if (
        this.props.auth !== newProps.auth &&
        newProps.auth.isEnterpriseRecruiter
      ) {
        this.redirectToNewVersion()
      }
    }

    redirectToNewVersion = () => {
      this.props.history.push('/ent/v2')
    }

    render() {
      return <WrapperComponent {...this.props} />
    }
  }

  return Auth
}
