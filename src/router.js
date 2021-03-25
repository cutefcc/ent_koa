import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ErrorBoundary from 'components/Common/ErrorBoundary'
import LayoutBeisen from 'components/Layout/Beisen'
import LayoutEmpty from 'components/Layout/Empty'
import SnatchTalent from 'components/SnatchTalent'
import MyRoute from 'common/Route'
import MyRouteV2 from 'common/RouteV2'
import RouteV3 from 'common/RouteV3'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Switch>
          <Route path="/ent/v3">
            <RouteV3 />
          </Route>
          <Route path="/ent/v2">
            <MyRouteV2 />
          </Route>
          <Route path="/ent/profile">
            <LayoutEmpty />
          </Route>
          <Route path="/ent/micro_resume/">
            <LayoutEmpty />
          </Route>
          <Route path="/ent/third/beisen">
            <LayoutBeisen />
          </Route>
          <Route path="/ent/snatch/talent">
            <SnatchTalent />
          </Route>
          <Route path="/">
            <MyRoute />
          </Route>
        </Switch>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default connect((state, dispatch) => ({
  dispatch,
}))(App)
