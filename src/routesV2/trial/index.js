import React from 'react'
import { connect } from 'react-redux'
import { checkIsTrial } from 'utils'
import GroupsContainer from 'componentsV2/TalentDiscover/GroupsContainer'
import AdvancedSearchContainer from 'componentsV2/TalentDiscover/AdvancedSearchContainer'
import TalentsContainer from 'componentsV2/TalentDiscover/TalentsContainer'
import DynamicContainer from 'componentsV2/TalentDiscover/DynamicContainer'
import TabContainer from 'componentsV2/TalentDiscover/TabContainer'
import BannerContainer from 'componentsV2/TalentDiscover/BannerContainer'
import PaginationContainer from 'componentsV2/TalentDiscover/PaginationContainer'
import WaterMark from 'componentsV2/Common/WaterMark'

import urlParse from 'url'
import * as R from 'ramda'

import styles from './index.less'

@connect((state) => ({
  currentTab: state.talentDiscover.currentTab,
  currentDynamicCategory: state.talentDiscover.currentDynamicCategory,
  currentUser: state.global.currentUser,
  subscriptionList: state.talentDiscover.subscriptionList,
}))
export default class Discover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refRight: null,
    }
  }

  componentDidMount() {
    this.setWaterMark(this.props)
    const { currentTab, location, currentDynamicCategory } = this.props
    const urlObj = urlParse.parse(location.search, true)
    const primaryTab = R.trim(R.pathOr('', ['query', 'primarytab'], urlObj))
    const navigatorTab = R.trim(R.pathOr('', ['query', 'tab'], urlObj))

    if (primaryTab && primaryTab !== currentTab) {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentTab',
        payload: primaryTab,
      })
    }

    if (navigatorTab && navigatorTab !== currentDynamicCategory) {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentDynamicCategory',
        payload: navigatorTab,
      })
    }
    // 解决父组件的ref在第一次渲染 传递不到子组件
    if (this.refRight) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        refRight: this.refRight,
      })
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.setWaterMark(newProps)
    }
  }

  setWaterMark(props) {
    const { currentUser } = props
    if (R.isEmpty(currentUser)) {
      return
    }
    const name = R.pathOr('', ['ucard', 'name'], currentUser)
    const phone = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
    if (!name && !phone) {
      return
    }
    WaterMark({
      text: name + phone,
      container: this.refRight,
    })
  }

  render() {
    const showTalentList = this.props.currentTab === 'talent'
    const { refRight } = this.state
    const { subscriptionList } = this.props
    const isTrial = checkIsTrial()
    return (
      <div className={styles.mainWrap}>
        <div className={styles.content}>
          <AdvancedSearchContainer
            className={`${styles.left} ${
              subscriptionList.length === 0 ? styles.noSubscription : ''
            }`}
          />
          <div
            className={styles.right}
            ref={(node) => {
              this.refRight = node
            }}
          >
            <BannerContainer />
            <TabContainer className={styles.tabContainer} />
            {showTalentList && <TalentsContainer refRight={refRight} />}
            {!showTalentList && (
              <DynamicContainer
                className={styles.dynamicContainer}
                refRight={refRight}
              />
            )}
            <PaginationContainer />
          </div>
        </div>
        {!isTrial && <GroupsContainer />}
      </div>
    )
  }
}
