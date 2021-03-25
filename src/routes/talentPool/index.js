import React from 'react'
import { connect } from 'react-redux'
import { Affix, BackTop } from 'antd'
import AttentionTalentTemplate from 'components/TalentPool_v3/Index/AttentionTalentTemplate'
import Dashboard from 'components/TalentPool_v3/Index/Dashboard'
import Rank from 'components/TalentPool_v3/Index/Rank'
import SourceDistributionTemplate from 'components/TalentPool_v3/Index/SourceDistributionTemplate'
import GrowthTrendTemplate from 'components/TalentPool_v3/Index/GrowthTrendTemplate'
import * as R from 'ramda'
import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'

import styles from './index.less'

@connect((state) => ({
  dashboardData: state.talentPool.dashboard,
}))
export default class Analysis extends React.Component {
  static propTypes = {
    // data: PropTypes.object.isRequired,
  }
  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      trackParam: {
        type: 'talent_pool_index',
      },
    }
    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    this.setReddot()
    this.fetchJobs()
  }

  setScrollDom = (dom) => {
    this.scrollDom = dom
  }

  setReddot = () => {
    this.props
      .dispatch({
        type: 'global/setReddot',
        payload: {
          reddot_type: 0,
        },
      })
      .then(this.fetchRuntime)
  }

  // isShowReddot = () => {
  //   const {runtime = []} = this.props
  //   return !R.propOr(1, 'is_read', runtime.find(R.propEq('reddot_type', 0)))
  // }

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  fetchRuntime = () => {
    this.props.dispatch({
      type: 'global/fetchRuntime',
      payload: {},
    })
  }

  handleDashboardLoadMore = (state) => {
    if (state || !this.props.dashboardData.remain) {
      return
    }
    const param = R.pathOr({}, ['dashboardData', 'param'], this.props)
    this.props.dispatch({
      type: 'talentPool/fetchDashboard',
      payload: {
        ...param,
        page: R.propOr(0, 'page', param) + 1,
        start_time: R.propOr('', 'last_time', this.props.dashboardData),
      },
    })
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'scroll',
          paddingBottom: '10px',
        }}
        ref={this.setScrollDom}
      >
        <div className={styles.main} key="content">
          <div className={styles.left}>
            <div className={styles.top}>
              <GrowthTrendTemplate className={styles.trend} />
              <SourceDistributionTemplate className={styles.source} />
            </div>
            <div className={styles.bottom}>
              <LogEvent eventList={this.eventList}>
                <Dashboard
                  className={styles.dashboard}
                  scrollDom={this.scrollDom}
                  trackParam={this.state.trackParam}
                  location={this.props.location}
                />
              </LogEvent>
            </div>
          </div>
          <div className={styles.right}>
            <LogEvent eventList={this.eventList}>
              <AttentionTalentTemplate
                className={`${styles.attention} ${styles.top}`}
                trackParam={this.state.trackParam}
              />
              <Rank className={`${styles.rank} ${styles.bottom}`} />
            </LogEvent>
          </div>
        </div>
        <div key="backTop">
          <BackTop target={() => this.scrollDom || window} />
        </div>
        <Affix
          offsetBottom={10}
          onChange={this.handleDashboardLoadMore}
          target={() => this.scrollDom || window}
        />
      </div>
    )
  }
}
