import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as R from 'ramda'

import Positions from 'routes/position'
import PublishJob from 'routesV2/job/position/publishJob'
import Resumes from 'routes/resume'

import TalentsDiscoverSearchV2 from 'routes/talentsDiscover/Search_v2'
import Discover from 'routes/talentsDiscover'
import TalentsDiscoverRecommend from 'routes/talentsDiscover/Recommend'
import Chennel from 'routes/talentsDiscover/Channel'
import ChannelIndex from 'routes/talentsDiscover/ChannelIndex'
import Invite from 'routes/talentsDiscover/Invite'

import Loading from 'routes/Loading'

import Right from 'routes/talentsFollow/Right'

import EnterpriseTalentPoolNew from 'routes/talentPool/index_new'
import TalentPoolOld from 'routes/talentPool/index_old'
import EnterpriseTalentPool from 'routes/talentPool/index_v2'
import EnterpriseTalentPoolV3 from 'routes/talentPool/index_v3'
import Group from 'routes/talentPool/Group'

import CompanyAsset from 'routes/account/CompanyAsset'
import PersonalAsset from 'routes/account/PersonalAsset'
import CompanyStat from 'routes/account/Stat/Company'

import MemberApply from 'routes/memberApply'
import JobMan from 'routes/jobMan'

import CommonLayout from 'components/Layout_1.0'

const withCommonLayout = (Component) => (props) => {
  return (
    <CommonLayout>
      <Component {...props} />
    </CommonLayout>
  )
}

const commonLayoutMap = {
  // 兜底页面
  '/ent/index': Loading,

  // 发现人才
  '/ent/talents/discover': Discover,
  // '/ent/talents/discover/search': TalentsDiscoverSearch,
  '/ent/talents/discover/search_v2': TalentsDiscoverSearchV2,
  '/ent/talents/discover/recommend': TalentsDiscoverRecommend,
  '/ent/talents/discover/channel': ChannelIndex,
  '/ent/talents/discover/channel/:id': Chennel,
  '/ent/talents/discover/invite': Invite,

  // 招聘管理
  '/ent/talents/recruit/job_man': JobMan, // 岗位管理
  '/ent/talents/recruit/positions/add/:ejid?': PublishJob,
  // '/ent/talents/recruit/positions/modify/:ejid': ModifyPosition,
  '/ent/talents/recruit/positions': Positions,
  '/ent/talents/recruit/resumes': Resumes,
  '/ent/talents/recruit/follow/right': Right, // 人才跟追踪

  // 人才库
  // '/ent/talents/pool/group': TalentsGroup,
  // '/ent/talents/pool': TalentPool,
  '/ent/talents/pool/group': Group,
  '/ent/talents/pool/enterprise_v2': EnterpriseTalentPool,
  '/ent/talents/pool/enterprise_v3': EnterpriseTalentPoolV3,
  '/ent/talents/pool/enterprise': EnterpriseTalentPoolNew,
  '/ent/talents/pool/old': TalentPoolOld,

  // 资产
  '/ent/asset/enterprise': CompanyAsset,
  '/ent/asset/personal': PersonalAsset,
  '/ent/asset': PersonalAsset,

  // 企业报表
  '/ent/stat/company': CompanyStat,
}

const emptyLayoutMap = {
  '/ent/member/apply': MemberApply,
}

const myRoute = () => {
  return (
    <Switch>
      {R.values(
        R.mapObjIndexed(
          (component, path) => (
            <Route
              path={path}
              exact
              component={
                path === '/ent/index' ? component : withCommonLayout(component)
              }
              key={path}
            />
          ),
          commonLayoutMap
        )
      )}
      {R.values(
        R.mapObjIndexed(
          (component, path) => (
            <Route key={path} path={path} exact component={component} />
          ),
          emptyLayoutMap
        )
      )}
      <Redirect from="/ent" to="/ent/index/" />
      <Redirect from="/" to="/ent/index/" />
    </Switch>
  )
}

export default myRoute
