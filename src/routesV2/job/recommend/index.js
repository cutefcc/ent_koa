import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'
import Header from 'componentsV2/Position/Recommend/Header'
import List from 'componentsV2/Position/Recommend/List'
import LogEvent from 'componentsV2/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'

import styles from './index.less'

@connect((state) => ({
  loading: state.loading.effects['recommends/fetch'],
  jobs: state.global.jobs,
}))
export default class Recommends extends React.Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const currentJid = R.trim(R.pathOr('', ['query', 'jid'], urlObj))
    const currentTab = R.trim(R.pathOr('', ['query', 'tab'], urlObj))
    this.state = {
      currentTab: currentTab || 'recommend',
      currentJid: currentJid ? parseInt(currentJid, 10) : undefined,
      filter: {
        filter_unmatch: 0,
      },
    }

    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    this.fetchJobs()
    this.handleUrlParam()
    hotPicPing()
  }

  componentWillUnmount() {
    removeHotPicPing()
  }

  handleUrlParam = () => {
    const tab = R.pathOr(
      '',
      ['query', 'tab'],
      urlParse.parse(window.location.href, true)
    )
    if (tab) {
      this.setState({ currentTab: tab })
    }
  }

  handleJidChange = (currentJid) => {
    this.setState({
      currentJid,
    })
  }

  handleTabChange = (currentTab) => {
    this.setState({ currentTab })
  }

  handleFilterChange = (filter) => {
    this.setState({
      filter,
    })
  }

  fetchJobs = () => {
    return this.props
      .dispatch({
        type: 'global/fetchJobs',
      })
      .then(({ jobs }) => {
        const currentJid = R.pathOr('', [0, 'jid'], jobs)
        if (!currentJid) {
          return
        }
        if (!this.state.currentJid) {
          this.setState({
            currentJid,
          })
        }
      })
  }

  render() {
    return (
      <LogEvent eventList={this.eventList} className={styles.main}>
        <div className={styles.header}>
          <Header
            currentTab={this.state.currentTab}
            onTabChange={this.handleTabChange}
            currentJid={this.state.currentJid}
            onJidChange={this.handleJidChange}
            onFilterChange={this.handleFilterChange}
            filter={this.state.filter}
            loading={this.props.loading}
          />
        </div>
        <div className={styles.list}>
          <List
            currentTab={this.state.currentTab}
            jid={this.state.currentJid}
            filter={this.state.filter}
          />
        </div>
      </LogEvent>
    )
  }
}
