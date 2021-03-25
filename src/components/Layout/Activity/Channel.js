import React from 'react'
import { Layout, Menu, Popover } from 'antd'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import logoUrl from 'images/logo.png'
import Chennel from 'routes/talentsDiscover/Channel'
import urlencode from 'urlencode'

import styles from './channel.less'

const { Header, Content } = Layout

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class MyLayout extends React.PureComponent {
  render() {
    const { currentUser } = this.props
    return (
      <Layout className={styles.layout}>
        <Header className={styles.headerContainer}>
          <header className={styles.header}>
            <Menu theme="dark" mode="horizontal" style={{ lineHeight: '60px' }}>
              <Menu.Item key="/logo" disabled className={styles.logoItem}>
                <img className={styles.logoItemLogo} src={logoUrl} alt="logo" />
              </Menu.Item>
              <div className={styles.title}>
                <span className={styles.mainTitle}>人才频道</span>
                <span className={styles.subTitle}>高效率招聘人才通道</span>
              </div>
              <div className={styles.avatar}>
                <Popover
                  placement="bottomRight"
                  content={
                    <div className={styles.accountPop}>
                      <ul>
                        <li>
                          <a
                            href={`https://acc.maimai.cn/login?to=${urlencode(
                              window.location.href
                            )}`}
                          >
                            退出登录
                          </a>
                        </li>
                      </ul>
                    </div>
                  }
                  trigger="click"
                >
                  <div>
                    <Avatar
                      avatar={R.path(['ucard', 'avatar'], currentUser)}
                      name={R.pathOr('', ['ucard', 'name'], currentUser)}
                      style={{
                        width: '35px',
                        height: '35px',
                        fontSize: '20px',
                        lineHeight: '35px',
                        borderRadius: '20px',
                      }}
                    />
                    <span className={styles.avatarName}>
                      {R.path(['ucard', 'name'], currentUser)}
                    </span>
                  </div>
                </Popover>
              </div>
            </Menu>
          </header>
        </Header>
        <Content className={styles.content}>
          <Chennel />
        </Content>
      </Layout>
    )
  }
}
