import React from 'react'
import { Tab, Loading, Empty, Text } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { checkIsTrial } from 'utils'
import { Affix } from 'antd'
import { connect } from 'react-redux'
import * as R from 'ramda'
import ErrorBoundary from 'componentsV2/Common/ErrorBoundary'
import * as model from './../model'
import BasicInfo from './../BasicInfo'
import RealnameStatus from './../RealnameStatus'
import Comment from './../Comment'
import Preference from './../Preference'

import styles from './index.less'

@connect((state) => ({
  loadingStatus: false, // state.loading.effects,
}))
export default class TabPanes extends React.PureComponent {
  static propTypes = {
    // 数据部分
    basicInfo: PropTypes.object.isRequired,
    tabsData: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    jobPreference: PropTypes.object.isRequired,
    userTag: PropTypes.object.isRequired,

    // 获取顶层滚动元素
    getScrollDom: PropTypes.func.isRequired,

    // 当tab的固定状态变化时
    onTabAffixStatusChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeKeys: ['basicInfo'],
      tabHeight: 45,
    }
  }

  getActiveKeys = (tabs) => {
    const { activeKeys } = this.state
    const tabKeys = tabs.map(R.prop('key'))
    const actualActiveTabs = R.intersection(activeKeys, tabKeys)
    return actualActiveTabs.length > 0 ? actualActiveTabs : tabKeys[0]
  }

  getTabNums = () => ({
    realnameStatus: R.propOr(0, 'realname_status', this.props.tabsData),
    comment: R.pathOr(0, ['evaluation_list', 'length'], this.props.comment),
    basicInfo: this.isBasicEmpty() ? 0 : 1,
    preference: this.isPreferenceEmpty() ? 0 : 1,
  })

  getTabsConfig = () => {
    const nums = this.getTabNums()
    const isTrial = checkIsTrial()
    const basicInfoTab = !nums.basicInfo
      ? []
      : [
          {
            title: '个人信息',
            key: 'basicInfo',
            component: BasicInfo,
            props: {
              data: this.props.basicInfo,
              userTag: this.props.userTag,
              uid: this.props.currentUid,
              getTarget: this.props.getScrollDom,
            },
          },
        ]

    const realnameStatusTab = !nums.realnameStatus
      ? []
      : [
          {
            // title: `实名动态${
            //   nums.realnameStatus ? `·${nums.realnameStatus}` : ''
            // }`,
            title: '实名动态',
            key: 'realnameStatus',
            component: RealnameStatus,
            props: {
              tabsData: this.props.tabsData,
            },
          },
        ]

    const commentTab = !nums.comment
      ? []
      : [
          {
            title: `好友评价${nums.comment ? `·${nums.comment}` : ''}`,
            key: 'comment',
            component: Comment,
            props: {
              data: this.props.comment,
            },
          },
        ]

    const preferenceTab =
      !nums.preference && !isTrial
        ? []
        : [
            {
              title: '求职偏好',
              key: 'preference',
              component: Preference,
              props: {
                data: this.props.jobPreference,
              },
            },
          ]

    return [
      ...basicInfoTab,
      ...realnameStatusTab,
      ...commentTab,
      ...preferenceTab,
    ]
  }

  isBasicEmpty = () =>
    model.isBasicInfoEmpty(this.props.userTag, this.props.basicInfo)

  isRealnameStatusEmpty = () => model.isRealnameStatusEmpty(this.props.tabsData)

  isCommentEmpty = () => model.isCommentEmpty(this.props.comment)

  isPreferenceEmpty = () => model.isPreferenceEmpty(this.props.jobPreference)

  isLoading = () => {
    const loadingTypes = [
      'profile/fetchBasicInfo',
      'profile/fetchTabs',
      'profile/fetchCommentList',
      'profile/fetchUserTag',
      // 'profile/fetchRealnameStatus',
    ]
    const loadingList = R.values(
      R.pickAll(loadingTypes, this.props.loadingStatus)
    )
    return R.any(R.equals(true), loadingList)
  }

  scrollTo = (id) => {
    if (this.props.getScrollDom) {
      const scrollDom = this.props.getScrollDom()
      if (!scrollDom) {
        return
      }

      const offsetTop = $(`#${id}`)[0].offsetTop - this.state.tabHeight || 45

      $(scrollDom).animate(
        {
          scrollTop: `${offsetTop}px`,
        },
        500
      )
    }
  }

  handleTrial = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '开通招聘企业版 解锁更多功能',
        cancelTxt: '放弃开通',
        confirmTxt: '立即开通',
      },
    })
  }

  handleTabChange = (tab) => {
    // 当试用版的时候，提示商机
    const isTrial = checkIsTrial()
    if (tab.key === 'preference' && isTrial) {
      this.handleTrial()
    }

    this.scrollTo(`profile_${tab.key}`)
  }

  handleTabChangeAuto = (key, triggerStatus) => (affix) => {
    if (affix === triggerStatus) {
      this.setState({
        activeKeys: [key],
      })
    }
  }

  renderPane = (conf) => {
    const Component = conf.component
    const containerId = `profile_${conf.key}`
    return (
      <React.Fragment key={conf.key}>
        <ErrorBoundary>
          <Affix
            offsetTop={this.state.tabHeight + 10}
            target={() => this.props.getScrollDom()}
            onChange={this.handleTabChangeAuto(conf.key, true)}
          />
          <Component id={containerId} {...conf.props} />
          <Affix
            offsetTop={this.state.tabHeight + 15}
            target={() => this.props.getScrollDom()}
            onChange={this.handleTabChangeAuto(conf.key, false)}
          />
        </ErrorBoundary>
      </React.Fragment>
    )
  }

  renderPanes = (tabsConfig) => {
    return tabsConfig.map(this.renderPane)
  }

  render() {
    const tabsConfig = this.getTabsConfig()
    const activeKeys = this.getActiveKeys(tabsConfig)
    if (this.isLoading()) {
      return (
        <div className={styles.loading}>
          <Loading />
          <Text type="text_secondary" className="margin-left-6">
            正在加载
          </Text>
        </div>
      )
    }

    if (!tabsConfig.length) {
      return (
        <Empty
          image="https://maimai.cn/ent/images/empty_position.png"
          description="暂无内容"
        />
      )
    }

    return (
      <React.Fragment>
        <Affix
          top={0}
          target={this.props.getScrollDom}
          onChange={this.props.onTabAffixStatusChange}
        >
          <div id="profile_tab" className={styles.tab}>
            <Tab
              tabs={tabsConfig}
              activeKeys={activeKeys}
              onChange={this.handleTabChange}
            />
          </div>
        </Affix>
        {this.renderPanes(tabsConfig)}
      </React.Fragment>
    )
  }
}
