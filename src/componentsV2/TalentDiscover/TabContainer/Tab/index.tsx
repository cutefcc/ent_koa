import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Icon } from 'mm-ent-ui'
import { CURRENT_TAB } from 'constants/talentDiscover'
import * as styles from './index.less'
import { asyncExtraData } from 'utils'

export interface Props {
  currentTab: string
  paginationParam: object
  dispatch?: (obj: object) => any
}

export interface State {}

@connect((state: any) => ({
  paginationParam: state.talentDiscover.paginationParam,
}))
export default class Tab extends React.PureComponent<Props, State> {
  handleTabChange = (type: string) => () => {
    const { currentTab, dispatch } = this.props
    if (currentTab === type) {
      return
    }
    // 清空总数
    dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    dispatch({
      type: 'talentDiscover/setCurrentTab',
      payload: type,
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {},
    }).then((data) => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  render() {
    const { currentTab } = this.props

    return (
      <div className={styles.tab}>
        <div
          className={`${styles.tabs} ${styles.talentList} ${
            currentTab === CURRENT_TAB.talent ? styles.active : ''
          }`}
          onClick={this.handleTabChange(CURRENT_TAB.talent)}
        >
          <Icon
            type="icon_solution"
            className={`${styles.icon} icon_dynamic`}
          />
          <span>人才列表</span>
          <div className={styles.triangle} />
        </div>
        <div
          className={`${styles.tabs} ${styles.viewDynamic} ${
            currentTab === CURRENT_TAB.dynamic ? styles.active : ''
          }`}
          onClick={this.handleTabChange(CURRENT_TAB.dynamic)}
        >
          <Icon type="icon_dynamic" className={`${styles.icon} icon_dynamic`} />
          <span>人才动态</span>
          <div className={styles.triangle} />
        </div>
      </div>
    )
  }
}
