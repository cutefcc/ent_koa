import React from 'react'
import { Breadcrumb } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import SearchInput from 'components/TalentsDiscover/Search/SearchInput'
import { computeTimeRemain } from 'utils/date'
import styles from './breadCrumb.less'

const firstLevelMap = {
  // '/ent/talents/discover': '发现人才',
  // '/ent/asset': '资产',
  // '/ent/stat/company': '企业报表',
  '/ent/talents/pool': '人才库首页',
}

const secondLevelMap = {
  '/ent/talents/discover/search': '搜索人才',
  '/ent/talents/discover/search_v2': '搜索人才',
  '/ent/talents/discover/recommend': '推荐人才',
  '/ent/talents/discover/channel': '人才专题',
  '/ent/talents/discover/invite': '人才邀约',
  '/ent/talents/recruit/job_man': '岗位管理',
  '/ent/talents/recruit/positions': '职位管理',
  '/ent/talents/recruit/resumes': '简历管理',
  '/ent/talents/recruit/follow/right': '人才追踪',
  '/ent/talents/pool/enterprise_v2': '企业人才银行',
  '/ent/talents/pool/enterprise_v3': '企业人才分组',
  '/ent/talents/pool/enterprise': '企业人才银行',
  '/ent/talents/pool/old': '企业人才银行',
  '/ent/talents/pool/group': '我的人才分组',
  '/ent/asset/enterprise': '企业资产',
  '/ent/asset/personal': '我的资产',
}

const thirdLevelMap = {
  '/ent/talents/discover/channel/:id': '频道名称',
  '/ent/talents/recruit/positions/add/:ejid?': '发布职位',
  '/ent/talents/recruit/positions/modify/:ejid': '编辑职位',
}

const hideSearchUris = [
  '/ent/talents/discover/search',
  '/ent/talents/discover',
  '/ent/talents/discover/search_v2',
]

@connect((state) => ({
  currentMenu: state.global.currentMenu,
  currentChannel: state.channels.currentChannel,
  channelList: state.channels.list,
  currentUser: state.global.currentUser,
  talentPoolStat: state.talentPool.stat,
}))
@withRouter
export default class MyBreadCrumb extends React.PureComponent {
  state = {
    channelsTimeRemain: '计算中...',
    currentChannelTimeRemian: '计算中...',
    searchKey: '',
    // talentsIndexCount: 0,
  }
  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }

    if (this.timer2) {
      window.clearInterval(this.timer2)
    }
  }

  setChannelsRemain = () => {
    const endTime = R.path([0, 'end_time'], this.props.channelList)
    const channelsTimeRemain = computeTimeRemain(endTime)
    this.setState({
      channelsTimeRemain,
    })

    if (!channelsTimeRemain && this.timer2 && this.props.channelList.length) {
      window.clearInterval(this.timer2)
    }
  }

  setCurrentChannelRemain = () => {
    const endTime = R.propOr(0, 'end_time', this.props.currentChannel)
    const currentChannelTimeRemian = computeTimeRemain(endTime)
    this.setState({
      currentChannelTimeRemian,
    })

    if (
      !currentChannelTimeRemian &&
      this.timer &&
      !R.isEmpty(this.props.currentChannel)
    ) {
      window.clearInterval(this.timer)
    }
  }

  getSecondLevelPath = (pathname) =>
    Object.keys(secondLevelMap).find(R.contains(R.__, pathname)) //eslint-disable-line

  getThirdLevelItem = (pathname) => {
    const { currentChannel } = this.props
    // 频道需要显示当前频道名称
    if (pathname === '/ent/talents/discover/channel/:id') {
      if (currentChannel && !R.isEmpty(currentChannel)) {
        const { currentChannelTimeRemian } = this.state
        if (!this.timer) {
          this.timer = window.setInterval(this.setCurrentChannelRemain, 1000)
          if (this.timer2) {
            window.clearInterval(this.timer2)
          }
        }

        return (
          <span>
            {currentChannel.name}
            {!currentChannelTimeRemian ? (
              <span className="color-orange font-size-16 margin-left-8 font-weight-common">
                本场活动已结束[每周二上午 10:00 开始]
              </span>
            ) : (
              <span className="color-dilution font-size-16 margin-left-8 font-weight-common">
                距离本场结束剩{currentChannelTimeRemian}
              </span>
            )}
          </span>
        )
      }
      return '我的频道'
    }
    return thirdLevelMap[pathname]
  }

  getFirstLevelItem = (path) => {
    if (path === '/ent/talents/pool') {
      return this.renderTalentsIndexCrumb()
    }
    return firstLevelMap[path]
  }

  getSecondLevelItem = (path) => {
    if (path === '/ent/talents/discover/channel') {
      return this.renderChannelCrumb()
    }
    if (path === '/ent/talents/discover/search_v2') {
      return this.renderSearchV2Crumb()
    }
    return secondLevelMap[path]
  }

  getTalentIndexData = () => {
    const { total = 0 } = this.props.talentPoolStat
    return total.toLocaleString()
  }

  handleSearch = (searchKey) => {
    this.handleSetSearch(searchKey)
    this.props.history.push(
      `${this.props.currentUser.searchUrl}?search=${searchKey}`
    )
  }

  handleSetSearch = (searchKey) => {
    this.props.dispatch({
      type: 'global/setSearchKey',
      payload: {
        searchKey,
      },
    })

    // this.setState({
    //   searchKey,
    // })

    this.setState({
      searchKey: '',
    })

    this.forceUpdate()
  }

  handleSearchKeyChange = (searchKey) => {
    this.setState({ searchKey })
  }

  renderChannelCrumb = () => {
    const { channelsTimeRemain } = this.state
    if (!this.timer2) {
      this.timer2 = window.setInterval(this.setChannelsRemain, 1000)
      if (this.timer) {
        window.clearInterval(this.timer)
      }
    }

    return (
      <span>
        人才专题
        {!channelsTimeRemain ? (
          <span className="color-orange font-size-16 margin-left-8 font-weight-common">
            本场活动已结束[每周二上午 10:00 开始]
          </span>
        ) : (
          <span className="color-dilution font-size-16 margin-left-8 font-weight-common">
            距离本场结束剩{channelsTimeRemain}
          </span>
        )}
      </span>
    )
  }

  renderSearchV2Crumb = () => {
    return (
      <div className={styles.searchCrumb}>
        <span className={styles.crumbTitle}>搜索人才</span>
        <SearchInput
          onSearch={this.handleSetSearch}
          placeholder="搜索人才关键词..."
          value={this.state.searchKey}
          onChange={this.handleSearchKeyChange}
        />
      </div>
    )
  }
  // 人才库一级页面包屑
  renderTalentsIndexCrumb = () => {
    return (
      <Link to="/ent/talents/pool/enterprise_v3">
        <span className={styles.talentsCount}>
          当前企业人才储备{this.getTalentIndexData()}人
        </span>
      </Link>
    )
  }

  render() {
    const { path } = this.props.match
    const isFirstLevel = Object.keys(firstLevelMap).includes(path)
    const isSecondLevel = Object.keys(secondLevelMap).includes(path)
    const isThirdLevel = Object.keys(thirdLevelMap).includes(path)
    const secondLevelPath = this.getSecondLevelPath(path)
    const showSearch = !hideSearchUris.includes(path)

    return (
      <div className={styles.breadcrumb}>
        <Breadcrumb>
          {isFirstLevel && (
            <Breadcrumb.Item>{this.getFirstLevelItem(path)}</Breadcrumb.Item>
          )}
          {isSecondLevel && (
            <Breadcrumb.Item>{this.getSecondLevelItem(path)}</Breadcrumb.Item>
          )}
          {isThirdLevel && !!secondLevelPath && (
            <Breadcrumb.Item>
              <Link to={secondLevelPath}>
                {secondLevelMap[secondLevelPath]}
              </Link>
            </Breadcrumb.Item>
          )}
          {isThirdLevel && (
            <Breadcrumb.Item>{this.getThirdLevelItem(path)}</Breadcrumb.Item>
          )}
        </Breadcrumb>
        {showSearch && (
          <div className={styles.searchInput}>
            <SearchInput
              onSearch={this.handleSearch}
              placeholder="搜索人才关键词..."
              value={this.state.searchKey}
              onChange={this.handleSearchKeyChange}
            />
          </div>
        )}
      </div>
    )
  }
}
