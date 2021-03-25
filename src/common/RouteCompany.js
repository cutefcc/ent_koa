import React from 'react'
// import { Route, Switch } from 'dva/router'
import { Route, Switch } from 'react-router-dom'
import CompanyLayout from 'componentsV2/Layout/Company'
import CompanyHome from 'routesV2/company'
import CompanyAnalysis from 'routesV2/company/analysis'
import EmployerSpread from 'routesV2/company/employerSpread'
import QuestionAnswer from 'routesV2/company/questionAnswer'
import EmployerPush from 'routesV2/company/employerPush'
import Info from 'routesV2/company/info'
import Position from 'routesV2/company/position'
import Album from 'routesV2/company/album'
import Identify from 'routesV2/company/identify'
import TaskCenter from 'routesV2/company/taskCenter'

const withCompanyMenu = (Component) => (props) => {
  return (
    <CompanyLayout>
      <Component {...props} />
    </CompanyLayout>
  )
}

function RouterConfig() {
  return (
    <Switch>
      <Route
        path="/ent/v2/company/data"
        component={withCompanyMenu(CompanyAnalysis)}
      />
      <Route
        path="/ent/v2/company/ope/questionAnswer"
        component={withCompanyMenu(QuestionAnswer)}
      />
      <Route
        path="/ent/v2/company/ope/employerSpread"
        component={withCompanyMenu(EmployerSpread)}
      />
      <Route
        path="/ent/v2/company/ope/employerPush"
        component={withCompanyMenu(EmployerPush)}
      />
      <Route
        path="/ent/v2/company/admin/info"
        component={withCompanyMenu(Info)}
      />
      <Route
        path="/ent/v2/company/admin/position"
        component={withCompanyMenu(Position)}
      />
      <Route
        path="/ent/v2/company/admin/album"
        component={withCompanyMenu(Album)}
      />
      <Route
        path="/ent/v2/company/admin/identify"
        component={withCompanyMenu(Identify)}
      />
      <Route
        path="/ent/v2/company/taskCenter"
        component={withCompanyMenu(TaskCenter)}
      />
      <Route path="/ent/v2/company" render={withCompanyMenu(CompanyHome)} />
    </Switch>
  )
}

export default RouterConfig
