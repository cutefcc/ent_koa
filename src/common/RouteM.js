import React from 'react'
// import { Route, Switch } from 'dva/router'
import { Route, Switch } from 'react-router-dom'

import PositionPreview from 'routes/position/Preview'

const myRoute = () => {
  return (
    <Switch>
      <Route key="/ent/m" path="/ent/m" exact component={PositionPreview} />
      <Route
        key="/ent/m/position/preview"
        path="/ent/m/position/preview"
        exact
        component={PositionPreview}
      />
    </Switch>
  )
}

export default myRoute
