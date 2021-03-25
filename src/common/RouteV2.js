import React from 'react'
// import { Route, Switch, Redirect } from 'dva/router'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as R from 'ramda'

// 发现人才
import Discover from 'routesV2/discover'

// 试用
import Trial from 'routesV2/trial'

// 本地登录
import LocalLogin from 'routesV2/localLogin'

// 职位与简历
import Positions from 'routesV2/job/position'
import PublishJob from 'routesV2/job/position/publishJob'
import Recommend from 'routesV2/job/recommend'
import Resumes from 'routesV2/job/resume'

// 人才专题
import Channel from 'routesV2/channel/detail'
import ChannelIndex from 'routesV2/channel'

// 舆情监控
import Sentiment from 'routesV2/sentiment'

// import Right from 'routesV2/talentsFollow/Right'

import EnterpriseAsset from 'routesV2/asset/enterprise'
import PersonalAsset from 'routesV2/asset/personal'

import EnterpriseData from 'routesV2/data/enterprise'
import TalentReport from 'routesV2/data/talentReport'

import Layout from 'componentsV2/Layout'

// 企业号
import RouteCompany from './RouteCompany'

const withLayout = (Component) => (props) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

const routes = {
  // 试用
  '/ent/v2/discover/trial': Trial,
  // 本地登录
  '/ent/v2/discover/login': LocalLogin,

  // 发现人才
  '/ent/v2/discover': Discover,

  // 职位
  '/ent/v2/job/positions/publish/:ejid?': PublishJob,
  '/ent/v2/job/positions': Positions,
  '/ent/v2/job/resumes': Resumes,
  '/ent/v2/job/recommend': Recommend,

  // 人才专题
  '/ent/v2/channels/:id': Channel,
  '/ent/v2/channels': ChannelIndex,

  // 舆情监控
  '/ent/v2/sentiment': Sentiment,

  // '/ent/v2/recruit/follow/right': Right, // 人才跟追踪

  // 数据
  '/ent/v2/data/enterprise': EnterpriseData,
  '/ent/v2/data/talentreport': TalentReport,

  // 资产
  '/ent/v2/asset/enterprise': EnterpriseAsset,
  '/ent/v2/asset/personal': PersonalAsset,
  '/ent/v2/asset': PersonalAsset,
}

const myRoute = () => {
  return (
    <Switch>
      {R.values(
        R.mapObjIndexed(
          (component, path) => (
            <Route path={path} component={withLayout(component)} key={path} />
          ),
          routes
        )
      )}
      <Route path="/ent/v2/company">{withLayout(RouteCompany)}</Route>
      <Redirect from="/ent/v2" to="/ent/v2/discover" />
      <Redirect from="/ent/" to="/ent/v2/discover" />
      <Redirect from="/" to="/ent/v2/discover" />
    </Switch>
  )
}

export default myRoute
