/* 
  @file: 内容部分，菜单 - 内容 - 侧边栏 布局
*/
import React from 'react'
import { connect } from 'react-redux'
// import {Layout} from 'antd'
import * as R from 'ramda'

import styles from './menuContentSider.less'

// const {Content, Sider} = Layout

@connect((state) => {
  return {
    currentUser: state.global.currentUser,
  }
})
export default class MyContent extends React.Component {
  componentDidMount() {
    /* this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

    this.props.dispatch({
      type: 'global/fetchDictionary',
      payload: {},
    }) */
  }

  getContent = () => {
    // const {currentUser: {company = {}}} = this.props
    // const {clogo = '', stdname = '', company_url: url = ''} = company
    return (
      <div className={styles.main}>
        {this.props.children.find(R.propEq('key', 'content')) || null}
        {/* <Sider key="menu" className={styles.menu} width={150}>
          <div className={styles.menuHeader}>
            {clogo ? (
              <a href={url}>
                <img
                  src={clogo}
                  className={styles.menuHeaderLogo}
                  alt="公司logo"
                />
              </a>
            ) : (
              <span
                className={`${styles.menuHeaderLogo} ${
                  styles.menuHeaderDefaultLogo
                }`}
              >
                脉脉招聘
              </span>
            )}
            <span className={styles.menuHeaderName}>{stdname}</span>
          </div>
          {this.props.children.find(R.propEq('key', 'menu')) || null}
        </Sider>
        <Content key="content" className={styles.content}>
          {this.props.children.find(R.propEq('key', 'content')) || null}
        </Content>
        <Sider key="sider" className={styles.sider} width={300}>
          {this.props.children.find(R.propEq('key', 'sider')) || null}
        </Sider> */}
      </div>
    )
  }

  render() {
    return R.is(Array, this.props.children)
      ? this.getContent()
      : this.props.children
  }
}
