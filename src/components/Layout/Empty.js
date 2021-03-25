import React from 'react'
import { Layout } from 'antd'
// import { Route, Switch, Redirect } from 'dva/router'
import { Route, Switch, Redirect } from 'react-router-dom'

import Profile from 'routes/profile'
import MicroResume from 'routes/profile/MicroResume'

import styles from './index.less'

const { Content } = Layout

export default class MyLayout extends React.Component {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'global/fetchCurrentUser',
    // })
    // this.props.dispatch({
    //   type: 'global/fetchDictionary',
    //   payload: {},
    // })
  }

  render() {
    return (
      <Layout className={styles.layout}>
        <Content className={styles.contentWithoutHeader}>
          <Switch>
            <Route path="/ent/profile/:uid" exact component={Profile} />
            <Route
              path="/ent/micro_resume/:uid"
              exact
              component={MicroResume}
            />
            <Redirect from="/ent" to="/ent/talents/discover/search" />
          </Switch>
        </Content>
      </Layout>
    )
  }
}
