import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Badge } from 'antd'
import * as R from 'ramda'
import { getCookie } from 'tiny-cookie'
import moment from 'moment'
import { Icon, Text, Avatar, Message } from 'mm-ent-ui'
import { Link, withRouter } from 'react-router-dom'

import styles from './index.less'

const { SubMenu } = Menu
const { Sider, Content } = Layout
@connect((state) => ({
  currentUser: state.global.currentUser,
  auth: state.global.auth,
}))
@withRouter
export default class CompanyLayout extends React.PureComponent {
  constructor(props) {
    super(props)
    const {
      location: { pathname = '/' },
    } = this.props
    const activeMenues = this.getMenuesConfig()
      .reduce(
        (res, item) =>
          item.children ? [...item.children, ...res] : [...res, item],
        []
      )
      .map(R.prop('key'))
      .filter((key) => pathname.indexOf(key) > -1)

    this.state = {
      activeMenues,
      tabs: [],
      business_type: 2,
    }
  }
  componentDidMount() {
    const { currentUser } = this.props
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      currentUser
    )

    const cid = R.pathOr('', ['bprofileCompanyUser', 'cid'], currentUser)

    if (webcid) {
      this.getAuthorityList(webcid, cid)
    } else {
      this.props
        .dispatch({
          type: 'global/fetchCurrentUser',
        })
        .then((res) => {
          const { data } = res || {}
          const { company } = data || {}
          this.getAuthorityList(company.webcid, data.cid)
        })
    }
  }
  getAuthorityList = (webcid, cid) => {
    const {
      location: { pathname = '/' },
    } = this.props

    cid &&
      this.props
        .dispatch({
          type: 'company/fetchAuthorityList',
          payload: {
            cid,
            webcid,
          },
        })
        .then((res) => {
          if (res.tabs && res.tabs.length > 0) {
            const activeMenues = this.getMenuesConfig(res.tabs)
              .reduce(
                (res, item) =>
                  item.children ? [...item.children, ...res] : [...res, item],
                []
              )
              .map(R.prop('key'))
              .filter((key) => pathname.indexOf(key) > -1)
            this.setState({
              activeMenues,
              tabs: res.tabs,
            })
          }
        })
  }

  getMenuesAdsConfig = (tabs) => {
    const {
      auth: { validUrls = [] },
    } = this.props

    // ??????????????????
    const getMenu = (payload) => {
      const { link, title, visible } = payload
      if (!visible) {
        return (
          <span className={styles.noAuthItem} onClick={this.prevent}>
            {title}
          </span>
        )
      }
      if (link) {
        return <Link to={link}>{title}</Link>
      }
      return title
    }

    const getMenuConfig = (payload) => {
      const { link } = payload
      return {
        key: link,
        item: getMenu(payload),
        show: validUrls.includes(link),
      }
    }

    const getLinkConfig = (payload) => {
      const { link, name, visible } = payload
      return {
        key: name,
        item: (
          <a
            key={name}
            rel="noopener noreferrer"
            onClick={(e) => {
              visible ? window.open(link) : this.prevent(e)
            }}
          >
            {name}
          </a>
        ),
        show: true,
      }
    }

    let spreadTabs = []
    if (tabs && tabs.length > 0) {
      spreadTabs = tabs.map((item) => {
        const children = item.sub_tabs.map((subItem) => {
          return subItem.link.includes('http')
            ? getLinkConfig(subItem)
            : getMenuConfig({
                title: <span>{subItem.name}</span>,
                ...subItem,
              })
        })
        return {
          key: item.key,
          item: (
            <span>
              <Icon type="admin" />
              {item.tabName}
            </span>
          ),
          show: validUrls.includes(item.key),
          children,
        }
      })
    }
    // new????????????30???
    const showTaskNew = moment().isBefore('2020-11-30')
    return [
      getMenuConfig({
        link: '/ent/v2/company/home',
        title: (
          <span>
            <Icon type="home" />
            ??????
          </span>
        ),
        name: '??????',
        visible: true,
      }),
      getMenuConfig({
        link: '/ent/v2/company/data',
        title: (
          <span>
            <Icon type="company_data" />
            ????????????
          </span>
        ),
        name: '????????????',
        visible: true,
      }),
      getMenuConfig({
        link: '/ent/v2/company/taskCenter',
        title: (
          <span className={styles.taskNewWrap}>
            <Icon type="task-center" />
            ????????????
            {showTaskNew && (
              <Badge
                count={
                  <img
                    alt="new"
                    src="https://i9.taou.com/maimai/p/25947/5921_53_42shFljzpneMJrh9"
                  />
                }
              />
            )}
          </span>
        ),
        name: '????????????',
        visible: true,
      }),
      ...spreadTabs,
    ]
  }

  getMenuesConfig = () => {
    const {
      auth: { validUrls = [] },
      currentUser,
    } = this.props
    const { bprofileCompanyUser = {} } = currentUser
    const { company_asking_unread_cnt, company = {} } = bprofileCompanyUser
    const { auths = {} } = company
    const { auth_asking = 0 } = auths
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      currentUser
    )
    const getMenu = (uri, title, checkAuth) => {
      // ??????????????????
      if (checkAuth === 'normal' && !this.props.auth.isCompanyPayUser) {
        return (
          <span className={styles.noAuthItem} onClick={this.prevent}>
            {title}
          </span>
        )
      }
      // ??????????????????
      if (
        checkAuth &&
        checkAuth !== 'normal' &&
        this.props.auth.isCompanyExtraPay &&
        !this.props.auth.isCompanyExtraPay(currentUser, checkAuth)
      ) {
        return (
          <span className={styles.noAuthItem} onClick={this.preventExtra}>
            {title}
          </span>
        )
      }
      if (uri) {
        return <Link to={uri}>{title}</Link>
      }
      return title
    }

    const getMenuConfig = (uri, title, checkAuth) => {
      return {
        key: uri,
        item: getMenu(uri, title, checkAuth),
        show: validUrls.includes(uri),
      }
    }

    const getLinkConfig = (uri, title) => {
      return {
        key: title,
        item: (
          <a
            href={uri}
            target="_blank"
            key={title}
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </a>
        ),
        show: true,
        // show: validUrls.includes(uri),
      }
    }
    // new????????????30???
    const showTaskNew = moment().isBefore('2020-11-30')
    return [
      getMenuConfig(
        '/ent/v2/company/home',
        <span>
          <Icon type="home" />
          ??????
        </span>
      ),
      getMenuConfig(
        '/ent/v2/company/data',
        <span>
          <Icon type="company_data" />
          ????????????
        </span>
      ),
      getMenuConfig(
        '/ent/v2/company/taskCenter',
        <span className={styles.taskNewWrap}>
          <Icon type="task-center" />
          ????????????
          {showTaskNew && (
            <Badge
              count={
                <img
                  alt="new"
                  src="https://i9.taou.com/maimai/p/25947/5921_53_42shFljzpneMJrh9"
                />
              }
            />
          )}
        </span>
      ),
      {
        key: `/ent/v2/company/ope`,
        item: (
          <span>
            <Icon type="nav-wrench" />
            ????????????
          </span>
        ),
        show: validUrls.includes('/ent/v2/company/ope'),
        children: [
          auth_asking &&
            getMenuConfig(
              `/ent/v2/company/ope/questionAnswer`,
              <span>
                ????????????{' '}
                <Badge
                  style={{ marginLeft: 10 }}
                  size="small"
                  llll
                  count={company_asking_unread_cnt}
                />
              </span>
            ),
          getMenuConfig(
            `/ent/v2/company/ope/employerSpread`,
            <span>????????????</span>
          ),
          getMenuConfig(
            `/ent/v2/company/ope/employerPush`,
            <span>?????????????????????</span>,
            'normal'
          ),
        ],
      },
      {
        key: `/ent/v2/company/admin`,
        item: (
          <span>
            <Icon type="admin" />
            ???????????????
          </span>
        ),
        show: validUrls.includes('/ent/v2/company/admin'),
        children: [
          getMenuConfig(`/ent/v2/company/admin/info`, <span>????????????</span>),
          getMenuConfig(
            `/ent/v2/company/admin/position`,
            <span>????????????</span>
          ),
          getMenuConfig(`/ent/v2/company/admin/album`, <span>????????????</span>),
          getLinkConfig(
            `https://maimai.cn/company?webcid=${webcid}`,
            '????????????'
          ),
          getMenuConfig(
            `/ent/v2/company/admin/identify`,
            <span>??????????????????</span>,
            'auth_employee_authentication'
          ),
        ],
      },
    ]
  }

  prevent = (e) => {
    e.stopPropagation()
    Message.warn('??????????????????????????????????????????????????????????????????????????????')
  }

  preventExtra = (e) => {
    e.stopPropagation()
    Message.warn('??????????????????????????????????????????????????????')
  }

  renderSubmenuItem = (menu) => {
    return !menu.show ? null : (
      <Menu.Item key={menu.key} className={styles.subMenuItem}>
        {menu.item}
      </Menu.Item>
    )
  }

  renderSubMenu = (menu) => {
    return !menu.show ? null : (
      <SubMenu
        key={menu.key}
        title={menu.item}
        popupClassName={styles.subMenuPopup}
      >
        {R.propOr([], 'children', menu).map(this.renderSubmenuItem)}
      </SubMenu>
    )
  }

  renderMenuItem = (menu) => {
    return !menu.show ? null : <Menu.Item key={menu.key}>{menu.item}</Menu.Item>
  }

  renderMenuItems = () => {
    const { business_type, tabs } = this.state
    const nemus =
      business_type === 1
        ? this.getMenuesAdsConfig(tabs)
        : this.getMenuesConfig()
    return nemus.map((item) =>
      item.children ? this.renderSubMenu(item) : this.renderMenuItem(item)
    )
  }

  renderSiderTitle = () => {
    const { bprofileCompanyUser: { company: { clogo, stdname } = {} } = {} } =
      this.props.currentUser || {}
    return (
      <div className={styles.siderTitle}>
        <Avatar shape="square" size={48} src={clogo} name={stdname} />
        <div className={styles.info}>
          <Text type="title" size={16} className="ellipsis">
            {stdname}
          </Text>
          <Text type="text_secondary" size={12}>
            ???????????????
          </Text>
        </div>
      </div>
    )
  }

  render() {
    const { activeMenues } = this.state
    return (
      <Layout className={styles.companyLayout}>
        <Sider width={254}>
          {this.renderSiderTitle()}
          <Menu
            defaultSelectedKeys={activeMenues}
            theme="light"
            mode="inline"
            openKeys={['/ent/v2/company/admin', '/ent/v2/company/ope']}
          >
            {this.renderMenuItems()}
          </Menu>
        </Sider>
        <Content>{this.props.children}</Content>
      </Layout>
    )
  }
}
