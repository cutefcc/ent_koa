import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Tab, Message } from 'mm-ent-ui'
import { withRouter } from 'react-router-dom'
import { getModuleName } from 'utils'
import urlParse from 'url'
import { CURRENT_TAB } from 'constants/talentDiscover'
import * as styles from './index.less'

@connect((state) => ({
  realPathname: state.global.realPathname,
  groupsCurrentGroup: state.groups.currentGroup,
  currentUser: state.global.currentUser,
}))
@withRouter
export default class Tabs extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeKeys: [1],
    }
  }

  componentDidMount() {
    const { history } = this.props
    const urlObj = this.getUrlObj()
    const type = R.pathOr('', ['query', 'currentTab'], urlObj)

    if (type === 'dynamic') {
      this.handleTabChange(this.handleGetTabsConfig()[1], true)
      Message.config({
        top: 284,
      })

      if (history && history.location && history.location.state) {
        const { cnt } = history.location.state
        cnt && Message.success(`已更新${cnt}条新动态`)
      }
    } else if (type === 'realName') {
      this.handleTabChange(this.handleGetTabsConfig()[2], true)
    } else {
      this.handleTabChange(this.handleGetTabsConfig()[0], true)
    }

    this.setCategory()
  }

  setCategory() {
    const urlObj = this.getUrlObj()
    const category = R.pathOr('', ['query', 'filter'], urlObj)
    const categoryMap = {
      is_fans: '4',
      is_has_dynamic: '1,2,11,3',
      is_delivery: '15',
    }

    if (categoryMap[category]) {
      const payload = categoryMap[category]

      this.props.dispatch({
        type: 'subscribe/setCurrentDynamicCategory',
        payload,
      })
    }
  }

  componentWillReceiveProps(newProps) {
    const leftGroup = R.pathOr('', ['groupsCurrentGroup', 'key'], newProps)
    if (leftGroup === 'inappropriate') {
      this.setState({
        activeKeys: [1],
      })
      this.props.onTabChange(this.handleGetTabsConfig()[0], false)
    }
  }

  getUrlObj = () => {
    return urlParse.parse(window.location.search, true)
  }

  handleGetTabsConfig = () => {
    const { realPathname, currentUser } = this.props
    const tlv = R.pathOr(2, ['talent_lib_version'], currentUser)
    const config =
      tlv === 2 && window.location.href.indexOf('/ent/v3/discover') !== -1
        ? [
            {
              title: '人才列表',
              key: 1,
              tabName: CURRENT_TAB.talent,
            },
            {
              title: '实名动态',
              key: 3,
              tabName: CURRENT_TAB.realName,
            },
          ]
        : [
            {
              title: '人才列表',
              key: 1,
              tabName: CURRENT_TAB.talent,
            },
            {
              title: '人才动态',
              key: 2,
              tabName: CURRENT_TAB.dynamic,
            },
            {
              title: '实名动态',
              key: 3,
              tabName: CURRENT_TAB.realName,
            },
          ]
    // 人才储备 二级页面 不合适分组只展示 人才列表
    // if (
    //   getModuleName(realPathname) === 'groups' &&
    //   this.props.groupsCurrentGroup.key === 'inappropriate'
    // ) {
    //   config[0].title = '不合适'
    //   config.length = 1
    // }
    if (
      getModuleName(window.location.pathname) === 'groups' &&
      this.props.groupsCurrentGroup.key === 'inappropriate'
    ) {
      config[0].title = '不合适'
      config.length = 1
    }
    return config
  }

  handleTabChange = (obj, refresh = false) => {
    this.setState({
      activeKeys: [obj.key],
    })
    this.props.onTabChange(obj, refresh)
  }

  render() {
    const { allNum } = this.props
    return (
      <div className={`${styles.mainContainer} flex`}>
        <div className={styles.tab}>
          <Tab
            tabs={this.handleGetTabsConfig()}
            activeKeys={this.state.activeKeys}
            onChange={this.handleTabChange}
            type="small"
            style={{ height: '56px' }}
          />
        </div>
        {/* {this.state.activeKeys[0] === 1 && allNum > 0 ? (
          <div className={styles.allPeople}>
            共匹配到{' '}
            <span style={{fontSize: '16px', fontWeight: '500', color: '#333'}}>
              {allNum}
            </span>{' '}
            位人才
          </div>
        ) : null} */}
      </div>
    )
  }
}
