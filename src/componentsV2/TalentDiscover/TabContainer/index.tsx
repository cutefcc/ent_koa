import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Tab from './Tab/index'
import DynamicHookContainer from '../DynamicHookContainer'
import * as styles from './index.less'

export interface Props {
  currentTab: string
}

export interface State {}

@connect((state: any) => ({
  currentTab: state.talentDiscover.currentTab,
}))
export default class TabContainer extends React.PureComponent<Props, State> {
  render() {
    const { currentTab } = this.props

    return (
      <div className={R.propOr('', 'className', this.props)}>
        <div className={`${styles.tabCon} flex-align-center`}>
          <Tab currentTab={currentTab} />
          {currentTab === 'talent' && <DynamicHookContainer />}
        </div>
      </div>
    )
  }
}
