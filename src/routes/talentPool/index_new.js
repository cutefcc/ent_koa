import React from 'react'
import { connect } from 'react-redux'
import { Affix } from 'antd'
import * as R from 'ramda'

import Search from 'components/TalentPool/List/Search'
import List from 'components/TalentPool/List/List'
import Filter from 'components/TalentPool/List/Filter'
import Static from 'components/TalentPool/List/Static'
import Growth from 'components/TalentPool/List/Growth'
import Rank from 'components/TalentPool/List/Rank'
import BatchSelection from 'components/TalentPool/List/BatchSelection'
import MyAffix from 'components/TalentPool/List/MyAffix'

import styles from './index_new.less'

@connect((state) => ({
  loadingList: false,
  currentUser: state.global.currentUser,
}))
export default class TalentPool extends React.Component {
  state = {
    search: {
      pfmj: undefined,
      loc: undefined,
      onlyWithPhone: false,
    },
    filter: -2,
    showAffixed: false,
    selectedItems: [],
    invitedItems: [],
    isSelectAll: false,
  }

  componentDidMount() {
    this.fetchJobs()
    // this.fetchProfession()
  }

  fetchJobs = () => this.props.dispatch({ type: 'global/fetchJobs' })

  fetchProfession = () =>
    this.props.dispatch({ type: 'global/fetchProfession' })

  handleSearchChange = (key, value) => {
    this.setState({
      search: {
        ...this.state.search,
        [key]: value,
      },
    })
  }

  handleFilterChange = (filter) => {
    this.setState({
      filter,
    })
  }

  handleAffixChange = (showAffixed) => {
    this.setState({
      showAffixed,
    })
  }

  handleSelectChange = (isSelectAll, selectedItems) => {
    this.setState({
      isSelectAll,
      selectedItems,
    })
  }

  handleSelectAll = (isSelectAll) => {
    this.setState({
      isSelectAll,
    })
  }

  handleInviteFinish = (invitedItems) => {
    this.setState({
      invitedItems: [this.state.invitedItems, ...invitedItems],
    })
  }

  render() {
    if (R.prop('talent_version', this.props.currentUser) === 2) {
      window.location.href = '/ent/talents/pool/enterprise_v2'
    }
    return (
      <div className={styles.main}>
        <div
          className={styles.affix}
          style={{
            display: this.state.showAffixed ? 'block' : 'none',
          }}
        >
          <MyAffix
            selectedItems={this.state.selectedItems}
            isSelectAll={this.state.isSelectAll}
            search={this.state.search}
            filter={this.state.filter}
            onSearchChange={this.handleSearchChange}
            onFilterChange={this.handleFilterChange}
            onSelectAll={this.handleSelectAll}
            onInviteFinish={this.handleInviteFinish}
          />
        </div>
        <div className={styles.left}>
          <div className={styles.search}>
            <Search
              onSearchChange={this.handleSearchChange}
              search={this.state.search}
            />
          </div>
          <div className={styles.batchSelection}>
            <BatchSelection
              onSelectAll={this.handleSelectAll}
              selectedItems={this.state.selectedItems}
              isSelectAll={this.state.isSelectAll}
              onInviteFinish={this.handleInviteFinish}
            />
          </div>
          <div className={styles.list}>
            <List
              filter={this.state.filter}
              onSelectChange={this.handleSelectChange}
              isSelectAll={this.state.isSelectAll}
              invitedItems={this.state.invitedItems}
              onInviteFinish={this.handleInviteFinish}
              search={this.state.search}
              onlyWithPhone={this.state.search.onlyWithPhone}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.filter}>
            <Filter
              value={this.state.filter}
              onChange={this.handleFilterChange}
            />
            <Affix offsetTop={64} onChange={this.handleAffixChange} />
          </div>
          <div className={styles.static}>
            <div className={styles.item}>
              <Static />
            </div>
            <div className={styles.item}>
              <Growth />
            </div>
            <div className={styles.item}>
              <Rank />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
