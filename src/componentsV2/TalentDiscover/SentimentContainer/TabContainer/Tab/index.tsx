import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Icon } from 'mm-ent-ui'
import { CURRENT_TAB } from 'constants/sentiment'
import * as styles from './index.less'

export interface Props {
  currentTab: string
  dispatch?: (obj: object) => any
}

export interface State {}

@connect((state: any) => ({
  currentTab: state.sentiment.currentTab,
}))
export default class Tab extends React.PureComponent<Props, State> {
  handleTabChange = (type: string) => () => {
    const { currentTab } = this.props
    if (currentTab === type) {
      return
    }
    this.props.dispatch({
      type: 'sentiment/setCurrentTab',
      payload: type,
    })
    this.fetchSentimentData()
  }

  fetchSentimentData = () => {
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }

  render() {
    const { currentTab } = this.props

    return (
      <div className={styles.tab}>
        <div
          className={`${styles.tabs} ${styles.talentList} ${
            currentTab === CURRENT_TAB.gossip ? styles.active : ''
          }`}
          onClick={this.handleTabChange(CURRENT_TAB.gossip)}
        >
          {/* <Icon type="icon_solution" className={`${styles.icon} icon_dynamic`} /> */}
          <span>订阅职言</span>
          <div className={styles.triangle} />
        </div>
        <div
          className={`${styles.tabs} ${styles.viewDynamic} ${
            currentTab === CURRENT_TAB.feed ? styles.active : ''
          }`}
          onClick={this.handleTabChange(CURRENT_TAB.feed)}
        >
          {/* <Icon type="icon_dynamic" className={`${styles.icon} icon_dynamic`} /> */}
          <span>订阅动态</span>
          <div className={styles.triangle} />
        </div>
      </div>
    )
  }
}
