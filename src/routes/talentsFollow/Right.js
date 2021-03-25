import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'
import md5 from 'md5'

import Header from 'components/TalentsFollow/Right/Header'
import List from 'components/TalentsFollow/Right/List'

import { rightTypeMap } from 'constants/right'

import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'

import styles from './right.less'

@connect()
export default class UsedRight extends React.Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const typeParam = R.trim(R.pathOr('', ['query', 'type'], urlObj))
    const type = Object.keys(rightTypeMap).includes(typeParam)
      ? typeParam
      : 'addFr'
    this.state = {
      type,
      filter: {
        jid: undefined,
        right_state: rightTypeMap[type].state[0].key,
        sort_field: 'update_time',
        sort_order: 'descend',
      },
      sid: 0,
      trackParam: {
        type: 'recruit-follow-right',
      },
    }

    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    this.fetchJobs()
    const { type, filter } = this.state
    const rightState = filter.right_state
    const sid = md5(`${type}${rightState}`)
    this.updateSid(sid)
  }

  updateSid = (sid) => {
    this.setState({ sid })
  }

  fetchJobs = () => {
    this.props.dispatch({ type: 'global/fetchJobs' })
    // this.props.dispatch({type: 'global/fetchJobs'}).then(({jobs}) => {
    //   const jid = R.pathOr(0, [0, 'jid'], jobs)
    //   if (!jid) {
    //     return
    //   }
    //   if (!this.state.filter.jid) {
    //     this.setState({
    //       filter: {
    //         ...this.state.filter,
    //         jid,
    //       },
    //     })
    //   }
    // })
  }

  handleTypeChange = (type) => {
    const rightState = rightTypeMap[type].state[0].key
    const sid = md5(`${type}${rightState}`)
    this.updateSid(sid)
    this.setState({
      type,
      filter: {
        ...this.state.filter,
        right_state: rightState,
      },
    })
  }

  handleFilterChange = (filter) => {
    const { type } = this.state
    const rightState = filter.right_state
    const sid = md5(`${type}${rightState}`)
    this.updateSid(sid)
    this.setState({
      filter,
    })
  }

  render() {
    const { type, filter, sid, trackParam } = this.state
    const param = {
      ...trackParam,
      fr: 'recruit_follow_right_free',
      sid,
    }
    return (
      <LogEvent eventList={this.eventList} className={styles.main}>
        <div className={styles.header}>
          <Header
            type={type}
            filter={filter}
            onTypeChange={this.handleTypeChange}
            onFilterChange={this.handleFilterChange}
            trackParam={param}
          />
        </div>
        <div className={styles.list}>
          <List
            type={type}
            filter={filter}
            onFilterChange={this.handleFilterChange}
            trackParam={param}
          />
        </div>
      </LogEvent>
    )
  }
}
