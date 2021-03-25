import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

import Header from 'components/TalentPool/Group/Header'
import List from 'components/TalentPool/Group/List'
import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'

import styles from './group.less'

@connect((state) => ({
  loading: false, // state.loading.models.recommends,
  jobs: state.global.jobs,
}))
export default class Recommends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentGroupId: 0,
      trackParam: {
        type: 'talent_pool_my_group',
      },
    }
    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    this.fetchJobs()
    this.fetchGroupList()
  }

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  fetchGroupList = () => {
    this.props
      .dispatch({
        type: 'groups/fetch',
      })
      .then(({ data }) => {
        const currentGroupId = R.pathOr(0, [0, 'id'], data)
        if (currentGroupId && !this.state.currentGroupId) {
          this.setState({
            currentGroupId,
          })
        }
      })
  }

  handleGroupIdChange = (currentGroupId) => {
    this.setState({ currentGroupId })
  }

  render() {
    const trackParam = {
      sid: this.state.currentGroupId,
      ...this.state.trackParam,
    }
    return (
      <LogEvent eventList={this.eventList}>
        <div className={styles.main}>
          <Header
            currentGroupId={this.state.currentGroupId}
            onGroupIdChange={this.handleGroupIdChange}
          />
          <div className={styles.list}>
            <List
              currentGroupId={this.state.currentGroupId}
              trackParam={trackParam}
            />
          </div>
        </div>
      </LogEvent>
    )
  }
}
