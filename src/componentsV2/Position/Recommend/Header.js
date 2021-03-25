import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Checkbox } from 'antd'
// import {Icon} from 'mm-ent-ui'
import classnames from 'classnames'
import JobSelect from './JobSelect'

import styles from './header.less'

@connect((state) => ({
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
}))
export default class Header extends React.PureComponent {
  static propTypes = {
    currentTab: PropTypes.string,
    onTabChange: PropTypes.func.isRequired,
    currentJid: PropTypes.number,
    onJidChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
  }

  static defaultProps = {
    currentTab: 'recommend',
    currentJid: undefined,
  }

  state = {
    // data: {},
  }

  componentDidMount() {
    if (this.props.currentJid) {
      this.fetchStat()
    }
  }

  componentWillReceiveProps() {
    // if (!R.eqProps('currentJid', newProps, this.props)) {
    //   if (newProps.currentJid) {
    //     this.fetchStat(newProps)
    //   }
    // }
  }

  fetchStat = (newProps) => {
    const props = newProps || this.props
    this.props
      .dispatch({
        type: 'recommends/fetchStat',
        payload: {
          jid: props.currentJid,
        },
      })
      .then(() => {
        // this.setState({
        //   data,
        // })
      })
  }

  handleTabChange = (tab) => () => {
    this.props.onTabChange(tab)
  }

  hanldeFilterChange = (key) => () => {
    this.props.onFilterChange({
      ...this.props.filter,
      [key]: !this.props.filter[key] ? 1 : 0,
    })
  }

  handleDirectChatSelectionChange = (e) => {
    this.hanldeFilterChange('is_direct_chat')(e.target.checked)
  }

  handleJidChange = (jid) => {
    this.props.onJidChange(jid)
  }

  renderTab = () => {
    return (
      <div className={styles.tab}>
        <span
          onClick={this.handleTabChange('recommend')}
          className={classnames({
            [styles.tabItem]: true,
            [styles.activeTab]: this.props.currentTab === 'recommend',
          })}
        >
          今日推荐
        </span>
        <span
          onClick={this.handleTabChange('visitor')}
          className={classnames({
            [styles.tabItem]: true,
            [styles.activeTab]: this.props.currentTab === 'visitor',
          })}
        >
          职位访客
        </span>
        <span
          onClick={this.handleTabChange('canchat')}
          className={classnames({
            [styles.tabItem]: true,
            [styles.activeTab]: this.props.currentTab === 'canchat',
          })}
        >
          可以聊
        </span>
      </div>
    )
  }

  // renderFilter = () => {
  //   return (
  //     <div
  //       className={styles.filter}
  //       onClick={this.hanldeFilterChange('filter_unmatch')}
  //     >
  //       <span
  //         className={
  //           R.propEq('filter_unmatch', 1, this.props.filter)
  //             ? styles.active
  //             : ''
  //         }
  //       >
  //         <Icon type="myFilter" />
  //         <span className="margin-left-8">过滤低匹配度访客</span>
  //       </span>
  //     </div>
  //   )
  // }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          {this.renderTab()}
          <span className="flex">
            {/* {this.props.currentTab === 'visitor' && this.renderFilter()} */}
            {this.props.currentTab !== 'visitor' &&
              R.pathOr(0, ['props', 'currentUser', 'identity'], this) !== 6 && (
                <Checkbox
                  onChange={this.handleDirectChatSelectionChange}
                  className="margin-right-16 margin-left-16"
                  disabled={this.props.loading}
                >
                  可立即沟通
                </Checkbox>
              )}
          </span>
        </div>
        <div className={styles.right}>
          <JobSelect
            data={this.props.jobs}
            onChange={this.handleJidChange}
            value={this.props.currentJid}
            allowClear={false}
          />
        </div>
      </div>
    )
  }
}
