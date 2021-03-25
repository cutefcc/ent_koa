import { withRouter } from 'react-router-dom'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'

const AuthorizedRoute = withRouter((props) => {
  const {
    currentUser: { limit },
    component: Component,
    path,
    location: { pathname },
  } = props
  if (!limit) return null
  const { subscribe_current_count, subscribe_max_count } = limit

  return (
    <Route
      key={path}
      path={path}
      render={() => {
        return pathname !== '/ent/v3/index' &&
          subscribe_current_count > subscribe_max_count ? (
          <Link to="/ent/v3/index" {...props} />
        ) : (
          <Component {...props} />
        )
      }}
    />
  )
})

export default connect((state) => ({
  currentUser: state.global.currentUser,
}))(AuthorizedRoute)
