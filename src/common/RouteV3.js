import React from 'react'
// import {Route, Switch, Redirect} from 'dva/router'
import { Link, Switch } from 'react-router-dom'
import * as R from 'ramda'

// 首页
import Index from 'routesV3/index.js'
// 推荐人才
import Recommend from 'routesV3/recommend'
import Subscribe from 'routesV3/recommend/subscribe'
import Group from 'routesV3/recommend/groups'
// // 发现人才
import Discover from 'routesV3/discover'

import Layout from 'componentsV2/Layout'
import AuthorizedRoute from './AuthorizedRoute'

const withLayout = (Component) => (props) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

const routes = {
  // 试用
  '/ent/v3/index/subscribe': Subscribe,
  '/ent/v3/index/groups': Group,
  '/ent/v3/index': Index,
  '/ent/v3/recommend': Recommend,
  '/ent/v3/discover': Discover,
}

const RouteV3 = () => {
  return (
    <Switch>
      {R.values(
        R.mapObjIndexed(
          (component, path) => (
            <AuthorizedRoute
              path={path}
              component={withLayout(component)}
              key={path}
            />
          ),
          routes
        )
      )}
      <Link from="/ent/" to="/ent/v3/index" />
      <Link from="/" to="/ent/v3/index" />
    </Switch>
  )
}

export default RouteV3
