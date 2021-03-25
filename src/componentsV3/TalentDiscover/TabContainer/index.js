import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Tabs from './Tab'
import * as styles from './index.less'

@connect(() => ({}))
export default class TabContainer extends React.PureComponent {
  render() {
    const { currentTab, onTabChange, allNum } = this.props

    return (
      <div className={R.propOr('', 'className', this.props)}>
        <div className={`${styles.tabCon} flex-align-center`}>
          <Tabs
            currentTab={currentTab}
            onTabChange={onTabChange}
            allNum={allNum}
          />
        </div>
      </div>
    )
  }
}
