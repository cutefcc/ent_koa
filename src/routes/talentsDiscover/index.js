import React from 'react'

import Channels from 'components/TalentsDiscover/Index/Channels'
import PositionRecommend from 'components/TalentsDiscover/Index/PositionRecommend'
// import SearchInput from 'components/TalentsDiscover/Search/SearchInput'
// import CityInput from 'components/TalentsDiscover/Search/CityInput'
import { connect } from 'react-redux'
import * as R from 'ramda'

import styles from './index.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class Talents extends React.Component {
  state = {
    loc: undefined,
    // searchKey: '',
  }

  componentDidMount() {
    // this.handleIsShowBanner()
  }

  handleSearch = (search) => {
    const { loc } = this.state
    const locParam = loc ? `&loc=${R.propOr(loc[0], 1, loc)}` : ''
    this.props.history.push(
      `${this.props.currentUser.searchUrl}?search=${search}${locParam}`
    )
  }

  handleLocChange = (loc) => {
    this.setState({
      loc,
    })
  }

  // handleSearchChange = v => {
  //   this.setState({
  //     searchKey: v,
  //   })
  // }

  render() {
    return (
      <div className={styles.main}>
        {/* <div className={styles.search}>
          <span className={styles.city}>
            <CityInput
              className={styles.cityInput}
              onChange={this.handleLocChange}
              value={this.state.loc}
            />
          </span>
          <span className={styles.keyword}>
            <SearchInput
              onSearch={this.handleSearch}
              className={styles.searchInput}
              onChange={this.handleSearchChange}
              value={this.state.searchKey}
            />
          </span>
        </div> */}
        <div className={styles.banner}>
          <a
            href="http://www.huodongxing.com/event/8513999458100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${this.props.urlPrefix}/images/banner.jpg`}
              alt="企业与人才管理论坛"
            />
          </a>
        </div>
        <div className={styles.content}>
          <div className={styles.channels}>
            <Channels className={styles.channels} />
          </div>
          <div className={styles.recommend}>
            <PositionRecommend />
          </div>
        </div>
        {/* <Campaign className={styles.campaogn} /> */}
      </div>
    )
  }
}
