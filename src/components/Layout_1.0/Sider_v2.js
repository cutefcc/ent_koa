import React from 'react'
import { Menu } from 'antd'
import { Icon } from 'mm-ent-ui'
import logo from 'images/logo2x.png'
import { withRouter, Link } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { HIDE_MENU } from 'constants'
import Subscribe from './Subscribe'

import styles from './sider_v2.less'

const { SubMenu } = Menu

@connect((state) => ({
  currentUser: state.global.currentUser,
  conditionStat: state.subscribe.conditionStat,
  conditionList: state.subscribe.conditionList,
  runtime: state.global.runtime,
  talentPoolStat: state.talentPool.stat,
}))
@withRouter
export default class MyHeader extends React.PureComponent {
  constructor(props) {
    super(props)
    const { pathname } = props.history.location
    const selectedKeys = [pathname, `${pathname}/`]
    const menu = this.getMenus(selectedKeys, props)
    this.state = {
      menu,
      openKeys: menu
        .filter((item) => String.prototype.includes.call(pathname, item.key))
        .map(R.prop('key')),
      selectedKeys,
    }
  }

  componentDidMount() {
    this.fetchSubscribeStat()
  }

  componentWillReceiveProps(newProps) {
    const { pathname } = newProps.history.location
    const selectedKeys = [pathname, `${pathname}/`]
    this.setState({
      selectedKeys,
      openKeys: this.state.menu
        .filter((item) => String.prototype.includes.call(pathname, item.key))
        .map(R.prop('key')),
    })

    if (this.props.currentUser !== newProps.currentUser) {
      this.setState({
        menu: this.getMenus(selectedKeys, newProps),
      })
    }
  }

  getMenus = (selectedKeys, props) => {
    const { currentUser } = props
    const hideMenu = R.propOr([], currentUser.identity, HIDE_MENU)
    const bankVersion = R.pathOr(1, ['talent_lib', 'version'], currentUser)
    const isNewBank = bankVersion > 1
    return [
      {
        key: `${currentUser.searchUrl}/`,
        item: (
          <Link to="/ent/talents/discover/search_v2/">
            <Icon type="talent_search" className="font-size-16" />
            搜索人才
          </Link>
        ),
        show: true,
      },
      {
        key: '/ent/talents/discover/recommend/',
        item: (
          <Link to="/ent/talents/discover/recommend/">
            <Icon type="recommend" />
            推荐人才
          </Link>
        ),
        show: true,
      },
      {
        key: '/ent/talents/discover/channel/',
        item: (
          <Link to="/ent/talents/discover/channel/">
            <Icon type="channel" />
            人才专题
          </Link>
        ),
        show: !hideMenu.includes('channel'),
      },
      {
        key: '/ent/talents/discover/invite/',
        item: (
          <Link to="/ent/talents/discover/invite/">
            <Icon type="invite" />
            人才邀约
          </Link>
        ),
        show:
          !hideMenu.includes('invite') &&
          R.path(['license', 'is_talent_invite'], currentUser) === 1,
      },
      {
        key: '/ent/talents/recruit/',
        item: (
          <span>
            <Icon type="recruit2" />
            招聘管理
          </span>
        ),
        children: [
          {
            key: '/ent/talents/recruit/positions/',
            item: <Link to="/ent/talents/recruit/positions/">职位管理</Link>,
            show: true,
          },
          {
            key: '/ent/talents/recruit/resumes/',
            item: <Link to="/ent/talents/recruit/resumes/">简历管理</Link>,
            show: true,
          },
          {
            key: '/ent/talents/recruit/follow/right/',
            item: <Link to="/ent/talents/recruit/follow/right/">人才追踪</Link>,
            show: true,
          },
        ],
        show: true,
      },
      {
        key: '/ent/talents/pool/',
        item: isNewBank ? (
          <Link
            to="/ent/talents/pool/"
            className="position-relative width-p100 display-inline-block"
          >
            <Icon type="talentpool" />
            人才银行
            {this.isShowReddot(0) && <span className={styles.reddot} />}
          </Link>
        ) : (
          <span>
            <Icon type="talentpool" />
            人才银行
          </span>
        ),
        children: [
          {
            key: `${currentUser.talentPoolUrl || ''}/`,
            item: (
              <Link
                to={`${currentUser.talentPoolUrl || ''}/`}
                className="position-relative"
              >
                企业人才分组
                {this.isShowReddot(1) && <span className={styles.reddot} />}
              </Link>
            ),
            show: true,
          },
          {
            key: '/ent/talents/pool/group/',
            item: <Link to="/ent/talents/pool/group/">我的人才分组</Link>,
            show: true,
          },
        ],
        show: !hideMenu.includes('pool'),
        selected: selectedKeys.includes('/ent/talents/pool/'),
      },
      {
        key: '/ent/asset/personal/',
        item: (
          <Link to="/ent/asset/personal/">
            <Icon type="asset2" />
            我的资产
          </Link>
        ),
        show:
          !R.path(['ucard', 'is_adm'], currentUser) &&
          !hideMenu.includes('asset'),
      },
      {
        key: '/ent/asset/',
        item: (
          <span>
            <Icon type="asset2" />
            资产
          </span>
        ),
        children: [
          {
            key: '/ent/asset/enterprise/',
            item: <Link to="/ent/asset/enterprise/">企业资产</Link>,
            show: true,
          },
          {
            key: '/ent/asset/personal/',
            item: <Link to="/ent/asset/personal/">我的资产</Link>,
            show: true,
          },
        ],
        show:
          R.path(['ucard', 'is_adm'], currentUser) === 1 &&
          !hideMenu.includes('asset'),
      },
      {
        key: '/ent/stat/company/',
        item: (
          <Link to="/ent/stat/company/">
            <Icon type="data2" />
            企业报表
          </Link>
        ),
        show:
          R.path(['ucard', 'is_adm'], currentUser) === 1 &&
          !hideMenu.includes('data'),
      },
      {
        key: '/ent/company/admin/',
        item: (
          <Link to="/ent/v2/company/home">
            <Icon type="icon_company" />
            企业号管理
          </Link>
        ),
        show:
          R.path(
            ['is_company_vip'],
            this.props.currentUser.bprofileCompanyUser
          ) === 1,
      },
    ]
  }

  isShowReddot = (type) => {
    const { runtime = [], talentPoolStat = {} } = this.props
    const ret =
      !R.propOr(1, 'is_read', runtime.find(R.propEq('reddot_type', type))) &&
      R.pathOr(0, ['willingness', 'new'], talentPoolStat) > 0
    return ret
  }

  fetchSubscribeStat = () => {
    this.props.dispatch({
      type: 'subscribe/fetchStat',
    })
  }

  handleOpenChange = (openKeys) => {
    this.setState({ openKeys })
  }

  renderSubMenu = (menu) => {
    return !menu.show ? null : (
      <SubMenu
        key={menu.key}
        title={menu.item}
        className={menu.selected ? 'ant-submenu-title-selected' : ''}
      >
        {R.propOr([], 'children', menu).map(this.renderMenuItem)}
      </SubMenu>
    )
  }

  renderMenuItem = (menu) => {
    return !menu.show ? null : <Menu.Item key={menu.key}>{menu.item}</Menu.Item>
  }

  renderMenuItems = () => {
    const { menu } = this.state
    return menu.map((item) =>
      item.children ? this.renderSubMenu(item) : this.renderMenuItem(item)
    )
  }

  renderLogo = () => {
    const {
      currentUser: { role = '' },
    } = this.props
    return (
      <div className={styles.logo}>
        {/* <Icon type="logo2" className={styles.commonLogo} width={107} /> */}
        <img src={logo} width={107} className={styles.commonLogo} alt="logo" />
        {role === 'enterpriseRecruiter' ? (
          <span className={styles.entLogo}>企业版</span>
        ) : null}
      </div>
    )
  }

  render() {
    return (
      <Menu
        mode="inline"
        onOpenChange={this.handleOpenChange}
        selectedKeys={this.state.selectedKeys}
        openKeys={this.state.openKeys}
        className={styles.menu}
      >
        {this.renderLogo()}
        {this.renderMenuItems()}
        {this.state.selectedKeys.includes(
          '/ent/talents/discover/search_v2/'
        ) && <Subscribe />}
      </Menu>
    )
  }
}
