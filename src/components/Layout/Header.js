import React from 'react'
import { Menu, Popover } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import logoUrl from 'images/logo.png'
import { redirectToIm } from 'utils'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import urlencode from 'urlencode'

import styles from './header.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  currentMenu: state.global.currentMenu,
}))
@withRouter
export default class MyHeader extends React.PureComponent {
  render() {
    const { currentUser, currentMenu } = this.props

    const prefix = '/ent'
    return (
      <header className={styles.header}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[currentMenu]}
          selectedKeys={[currentMenu]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/logo" disabled className={styles.logoItem}>
            <img className={styles.logoItemLogo} src={logoUrl} alt="logo" />
            <span className={styles.logoItemFont}>招聘</span>
          </Menu.Item>
          {/* <Menu.Item key="/positions">
            <Link to={`${prefix}/positions`} activeclassname="active">
              职位管理
            </Link>
          </Menu.Item> */}
          <Menu.Item key="/job_man">
            <Link to={`${prefix}/job_man`} activeclassname="active">
              招聘管理
            </Link>
          </Menu.Item>
          <Menu.Item key="/talents/discover" activeclassname="active">
            <Link to={currentUser.searchUrl} activeclassname="active">
              发现人才
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="/talents/follow" activeclassname="active">
            <Link
              to={`${prefix}/talents/follow/applicant`}
              activeclassname="active"
            >
              招聘人才
            </Link>
          </Menu.Item> */}
          <Menu.Item key="/im" activeclassname="active">
            <span onClick={() => redirectToIm()}>网页聊天</span>
          </Menu.Item>
          {/* <Menu.Item key="/talents/pool" activeclassname="active">
            <Link to={`${prefix}/talents/pool`} activeclassname="active">
              企业人脉
            </Link>
          </Menu.Item> */}
          <Menu.Item key="/talents/pool_new" activeclassname="active">
            <Link to={`${prefix}/talents/pool_new`} activeclassname="active">
              人才库
            </Link>
          </Menu.Item>
          <Menu.Item key="/account" activeclassname="active">
            <Link
              to={`${prefix}/account/asset/personal`}
              activeclassname="active"
            >
              账号管理
            </Link>
          </Menu.Item>
          {R.path(['ucard', 'is_adm'], this.props.currentUser) === 1 && (
            <Menu.Item key="/stat" activeclassname="active">
              <Link to={`${prefix}/stat/company`} activeclassname="active">
                企业报表
              </Link>
            </Menu.Item>
          )}
        </Menu>
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
      </header>
    )
  }
}
