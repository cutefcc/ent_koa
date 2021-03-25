import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Affix } from 'antd'
import SentimentContainer from 'componentsV2/TalentDiscover/SentimentContainer'
import SentimentList from 'componentsV2/TalentDiscover/SentimentContainer/List'
import TabContainer from 'componentsV2/TalentDiscover/SentimentContainer/TabContainer'
import PaginationContainer from 'componentsV2/TalentDiscover/SentimentContainer/Pagination'

import styles from './index.less'

@connect((state) => ({
  bprofileUser: state.global.bprofileUser,
  currentSubscribe: state.sentiment.currentSubscribe,
  data: state.sentiment.sentimentData,
}))
export default class Sentiment extends React.Component {
  componentDidMount() {
    this.fetchData(this.props.bprofileUser)
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.bprofileUser, this.props.bprofileUser)) {
      this.fetchData(newProps.bprofileUser)
    }
  }

  fetchData = (user) => {
    const webcid = R.path(['company', 'webcid'], user)
    if (!webcid) return
    this.props
      .dispatch({
        type: 'sentiment/fetchSentimentList',
      })
      .then(this.fetchSentimentData)
  }

  fetchSentimentData = () => {
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }

  render() {
    const { data = {} } = this.props
    const { list = [] } = data
    const isEmpty = R.isEmpty(this.props.currentSubscribe)
    const isEmptyList = list.length === 0
    return (
      <div className={styles.mainWrap}>
        <div className={styles.content}>
          <SentimentContainer className={styles.left} />
          <div
            className={styles.right}
            ref={(node) => {
              this.refRight = node
            }}
          >
            {!isEmpty && (
              <Affix target={() => this.refRight} offsetTop={0}>
                <TabContainer className={styles.tabContainer} />
              </Affix>
            )}
            <SentimentList />
            {!isEmptyList && <PaginationContainer />}
          </div>
        </div>
      </div>
    )
  }
}
