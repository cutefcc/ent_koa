import React from 'react'
import { connect } from 'react-redux'
// import * as R from 'ramda'
// import ErrorBoundary from 'components/Common/ErrorBoundary'
// import List from 'components/TalentsDiscover/Search/List'
// import BatchSelection from 'components/TalentsDiscover/Search/BatchSelection'

// import AdvancedSearch from 'components/TalentsDiscover/Search/AdvancedSearch'

// import urlParse from 'url'
import { withRouter } from 'react-router-dom'
// import styles from './search.less'

@connect((state) => ({
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
}))
@withRouter
export default class Talents extends React.Component {
  // constructor(props) {
  //   super(props)
  //   const urlObj = urlParse.parse(props.location.search, true)
  //   const keyword = R.trim(R.pathOr('', ['query', 'search'], urlObj))
  //   const loc = R.trim(R.pathOr('', ['query', 'loc'], urlObj))
  //   const locArr = /([\u4e00-\u9fa5]+)(-([\u4e00-\u9fa5]*))?/.exec(loc)
  //   this.state = {
  //     search: {
  //       keyword,
  //       province:
  //         !locArr || locArr === null ? '全部' : R.prop(1, locArr) || '全部',
  //       city: !locArr || locArr === null ? '' : R.prop(3, locArr) || '',
  //       loc,
  //       work_time: undefined,
  //       degree: undefined,
  //       company_level: -1,
  //       is_211_985: 0,
  //       profession: undefined,
  //       major: undefined,
  //       pf: undefined,
  //     },
  //     selectedItems: [],
  //     isAllSelect: false,
  //     hasInvitedIds: [],
  //     hasAddFriendIds: [],
  //     hasAddGroups: {},
  //     data: [],
  //   }
  // }

  // componentDidMount() {
  //   this.fetchJobs()
  // }

  // fetchJobs = () =>
  //   this.props.dispatch({
  //     type: 'global/fetchJobs',
  //   })

  // refreshCurrentUser = () =>
  //   this.props.dispatch({
  //     type: 'global/fetchCurrentUser',
  //   })

  // handleSearchChange = search => {
  //   this.setState({
  //     search,
  //   })
  // }

  // handleSelectChange = (isAllSelect, selectedItems) => {
  //   this.setState({
  //     isAllSelect,
  //     selectedItems,
  //   })
  // }

  // handleOpFinish = (type, ids, groupName) => {
  //   switch (type) {
  //     case 'directIm':
  //       this.setState({
  //         hasInvitedIds: [...this.state.hasInvitedIds, ...ids],
  //       })
  //       break
  //     case 'addFriend':
  //       this.setState({
  //         hasAddFriendIds: [...this.state.hasAddFriendIds, ...ids],
  //       })
  //       break
  //     case 'group':
  //       this.setState({
  //         hasAddGroups: R.mergeDeepWith(
  //           (a, b) => `${a},${b}`,
  //           this.state.hasAddGroups,
  //           R.fromPairs(ids.map(id => [id, groupName]))
  //         ),
  //       })
  //       break
  //     default:
  //       return ''
  //   }
  //   return ''
  // }

  // handleAllSelect = isAllSelect => {
  //   this.setState({
  //     isAllSelect,
  //     selectedItems: isAllSelect ? this.state.data : [],
  //   })
  // }

  // handleDataChange = data => {
  //   this.setState({data})
  // }

  render() {
    // if (this.props.currentUser.search_version === 2) {
    //   this.props.history.push(this.props.currentUser.searchUrl)
    // }
    try {
      this.props.history.push('/ent/talents/discover/search_v2/')
    } catch (e) {
      window.location.href = '/ent/talents/discover/search_v2/'
    }
    return null
    // return (
    //   <div className={styles.main}>
    //     <div className={styles.left}>
    //       <AdvancedSearch
    //         onChange={this.handleSearchChange}
    //         value={this.state.search}
    //       />
    //     </div>
    //     <div className={styles.right}>
    //       <div className={styles.batchSelection}>
    //         <BatchSelection
    //           isAllSelect={this.state.isAllSelect}
    //           selectedItems={this.state.selectedItems}
    //           onSelect={this.handleAllSelect}
    //           onOpFinish={this.handleOpFinish}
    //           hasInvitedIds={this.state.hasInvitedIds}
    //           hasAddFriendIds={this.state.hasAddFriendIds}
    //         />
    //       </div>
    //       <div className={styles.list}>
    //         <ErrorBoundary>
    //           <List
    //             onSelectChange={this.handleSelectChange}
    //             isAllSelect={this.state.isAllSelect}
    //             selectedItems={this.state.selectedItems}
    //             search={this.state.search}
    //             hasInvitedIds={this.state.hasInvitedIds}
    //             hasAddFriendIds={this.state.hasAddFriendIds}
    //             hasAddGroups={this.state.hasAddGroups}
    //             onOpFinish={this.handleOpFinish}
    //             onSearchChange={this.handleSearchChange}
    //             data={this.state.data}
    //             onDataChange={this.handleDataChange}
    //           />
    //         </ErrorBoundary>
    //       </div>
    //     </div>
    //   </div>
    // )
  }
}
