import React from 'react'
import { Layout } from 'antd'
import Route from 'common/Route'

import MyHeader from './Header'
import styles from './index.less'

const { Header, Content } = Layout

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
        <Header className={styles.header}>
          <MyHeader />
        </Header>
        <Content className={styles.content}>
          <Route />
        </Content>
      </Layout>
    )
  }
}
