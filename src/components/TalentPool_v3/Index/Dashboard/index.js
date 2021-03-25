/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { DASHBOARD_TABS } from 'constants/talentPool'
import $ from 'jquery'
import { Modal, Spin, ListFooter, Empty, Icon } from 'mm-ent-ui'
import textToImage from 'utils/textToImage'
import { compact, GUID } from 'utils'
import Filter from 'components/TalentPool_v3/Index/Filter'
import { showMosaic } from 'utils/account'
import urlParse from 'url'
import UpgradeMemberTip from './UpgradeMemberTip'
import DynamicDetailModal from './DynamicDetailModal'
import Title from './../Title'
import Card from './Card'
import styles from './index.less'

const backgroundImageStyle = {
  marginX: 45,
  marginY: 90,
  line2Coordinate: '73px 73px',
  line3Coordinate: '146px 146px',
}
let max = 0
@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchDashboard'],
  data: state.talentPool.dashboard,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  dynamicDetailTip: state.talentPool.dynamicDetailTip,
}))
export default class Dashboard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const activeTab = R.trim(R.pathOr('', ['query', 'tab'], urlObj))

    this.state = {
      activeTab: activeTab || '0',
      spread: {},
      backgroundUrl: '',
      showFilter: false,
      filter: {},
      searchValues: {},
      sid: 0,
      userInfo: null,
      showDetailModal: false,
    }
  }

  componentDidMount() {
    console.log('this.props.urlPrefix+++: ', this.props.urlPrefix)
    const { track } = this.props
    const sid = GUID()
    // 初始化的时候给人才动态栏打点
    const params = {
      eventName: 'jobs_pc_talent_bank_dynamic_switch',
      trackParam: {
        tab_name: 'all',
        sid,
        ...this.props.trackParam,
      },
    }
    if (track && typeof track === 'function') {
      track(params)
    }
    this.updateSid(sid)
    this.fetchData()
    this.setBackgroundUrl(this.props)

    this.click1 = (e) => {
      if (e.ctrlKey && e.keyCode === 67) {
        return false
      }
      return true
    }
    $(document).unbind('keydown').bind('keydown', this.click1)
    this.click2 = (e) => {
      e.preventDefault()
      return false
    }
    $(document).unbind('copy').bind('copy', this.click2)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.setBackgroundUrl(newProps)
    }
  }

  componentWillUnmount() {
    if (this.click1) {
      $(document).unbind('keydown', this.click1)
    }
    if (this.click2) {
      $(document).unbind('copy', this.click2)
    }
  }

  setBackgroundUrl = (props) => {
    const { currentUser } = props
    const name = R.pathOr('', ['ucard', 'name'], currentUser)
    const mobile = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
    this.setState({
      backgroundUrl: textToImage(`${name} ${mobile}`, {
        textColor: '#EDEFF5',
        fontSize: 13,
        rotate: -30,
        fontFamily: 'PingFangSC-Thin',
        ...backgroundImageStyle,
      }),
    })
  }

  getTalentButtons = (talent) => {
    const {
      currentUser: { isV3 },
    } = this.props
    return [
      talent.right_type !== 2 && talent.direct_contact_st !== 1 && !isV3
        ? 'directIm'
        : '',
      talent.right_type === 2 &&
      talent.direct_invite_status !== 3 &&
      talent.direct_contact_st !== 1
        ? 'directInvite'
        : '',
      // talent.right_type === 2 && talent.direct_invite_status === 3
      //   ? 'chat'
      //   : '',
      talent.direct_contact_st === 1 || isV3 ? 'directContact' : '',
    ]
  }

  getTalentFooterButtons = (talent) => {
    const {
      currentUser: { isV3 },
    } = this.props
    return isV3
      ? [
          'addRemark',
          'editGroup',
          talent.friend_state === 2 ? 'communicate' : '', // addFriend 去掉加好友
          // 'askForPhone',
        ]
      : [
          'addRemark',
          'editGroup',
          talent.friend_state === 2 ? 'communicate' : 'addFriend',
          // 'askForPhone',
        ]
  }

  handleUserInfoChange(data) {
    this.setState({
      userInfo: data,
    })
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'talentPool/fetchDashboard',
      payload: {
        event_types: this.state.activeTab,
        page: 0,
        ...this.state.searchValues,
      },
    })
  }

  handleTabChange = (activeTab, e) => {
    const sid = GUID()
    e.data = {
      sid,
    }
    const active = this.state.activeTab
    if (active === activeTab || this.props.loading) {
      e.stopPropagation()
      return
    }
    max = 0
    this.setState(
      {
        activeTab,
        sid,
        spread: {},
      },
      this.fetchData
    )
  }

  handleSpreadChange = (data) => {
    const { id, talent } = data
    if (!this.state.spread[id]) {
      if (window.voyager) {
        const key = 'jobs_pc_talent_dynamic_profile_view_abbreviation'
        const param = {
          datetime: new Date().getTime(),
          u2: talent.id,
          uid: window.uid,
          sid: this.state.sid,
          ...this.props.trackParam,
        }
        window.voyager.trackEvent(key, key, param)
      }
    }
    this.setState({
      spread: {
        ...this.state.spread,
        [id]: !this.state.spread[id],
      },
    })
  }

  handleLoadMore = () => {
    const param = R.pathOr({}, ['data', 'param'], this.props)
    this.props.dispatch({
      type: 'talentPool/fetchDashboard',
      payload: {
        ...param,
        page: R.propOr(0, 'page', param) + 1,
        start_time: R.propOr('', 'last_time', this.props.data),
      },
    })
  }

  handleStateValueChange = (key, v) => () => {
    if (v) {
      if (window.voyager) {
        const param = {
          datetime: new Date().getTime(),
          ...this.props.trackParam,
          uid: window.uid,
        }
        const eventName = 'jobs_pc_talent_filter_click'
        window.voyager.trackEvent(eventName, eventName, param)
      }
    }
    this.setState({ [key]: v })
  }

  handleFilterChange = (values, needFetch = true) => {
    const formatValue = this.formatFilterValue(values)
    const isSame = R.equals(formatValue, this.state.searchValues)
    this.setState(
      {
        filter: values,
        searchValues: formatValue,
        showFilter: false,
      },
      () => {
        if (!isSame && needFetch) {
          this.fetchData()
        }
      }
    )
  }

  updateSid = (sid) => {
    this.setState({ sid })
  }

  formatFilterValue = (values) => {
    const { degree, positions, city } = values
    const province = city && city.length > 0 ? city[0] : ''
    const cities = city && city.length > 0 ? city[1] : ''
    const workTimes = (values.work_times && values.work_times.join()) || ''
    return {
      ...values,
      degree: (degree && degree.join()) || '',
      positions: (positions && positions.join()) || '',
      work_times: workTimes,
      province,
      city: cities,
    }
  }

  handleShowDetailModal = () => {
    this.setState({ showDetailModal: true })
  }

  handleHiddenDetailModal = () => {
    this.setState({ showDetailModal: false })
  }

  renderFilterSelection = () => {
    const { positions, city, degree } = this.state.filter
    const workTimes = this.state.filter.work_times
    const topSelectedCount = R.reject(
      R.isEmpty,
      compact([positions, city, workTimes, degree])
    ).length
    const filterNum =
      topSelectedCount + (this.state.filter.talent_sources || []).length
    return (
      <span
        onClick={this.handleStateValueChange('showFilter', true)}
        className={styles.filter}
      >
        <Icon
          type="myFilter"
          className={filterNum > 0 ? 'color-blue' : 'color-dilution'}
        />
        <span
          className={`${
            filterNum > 0 ? 'color-blue' : 'color-common'
          } margin-left-4`}
        >
          筛选({filterNum})
        </span>
      </span>
    )
  }

  renderDefault = () => {
    const { list = [] } = this.props.data
    const isEmpty = list.length === 0
    const isLoading = this.props.loading
    return [
      !isLoading && isEmpty && <Empty description="暂无动态" key="empty" />,
      isLoading && (
        <Spin type={isEmpty ? 'empty-list' : 'unempty-list'} key="loading" />
      ),
      !isLoading && (
        <ListFooter
          hasMore={this.props.data.remain === 1}
          onLoadMore={this.handleLoadMore}
          key="footer"
        />
      ),
    ]
  }

  renderCard = (talent, mosaic = false) => {
    const param = {
      sid: this.state.sid,
      u2: talent.talent.id,
      ...this.props.trackParam,
    }
    return (
      <Card
        data={talent}
        onSpreadChange={this.handleSpreadChange}
        spread={this.state.spread[talent.id]}
        key={`${talent.id} card`}
        trackParam={param}
        mosaic={mosaic}
        onShowDetailModal={this.handleShowDetailModal}
        onUserInfoChange={(data) => {
          this.handleUserInfoChange(data)
        }}
        scrollDom={this.props.scrollDom}
      />
    )
  }

  renderDetailModal = () => {
    const { userInfo } = this.state
    const { trackParam } = this.props
    return (
      <DynamicDetailModal
        params={userInfo}
        onHiddenDetailModal={this.handleHiddenDetailModal}
        trackParam={trackParam}
      />
    )
  }

  render() {
    const { data, currentUser } = this.props
    const { list = [], pos = 0, maxShow, begin } = data
    if (max === 0) {
      max = pos
    }
    const background = this.state.backgroundUrl
    const bgStyle = {
      backgroundImage: `url(${background}), url(${background}), url(${background})`,
      backgroundRepeat: 'repeat, repeat, repeat',
      backgroundPosition: `0 0, ${backgroundImageStyle.line2Coordinate}, ${backgroundImageStyle.line3Coordinate}`,
    }
    const justShowFifty = showMosaic(currentUser)
    if (begin) {
      max = R.min(pos, maxShow)
    }
    const firstList = justShowFifty ? list.slice(0, max) : list
    const lastList = justShowFifty ? list.slice(max) : []
    const showMemberTip =
      justShowFifty && firstList.length > 0 && firstList.length >= max
    return (
      <div className={this.props.className}>
        <Title
          title="人才动态"
          tabs={DASHBOARD_TABS}
          onTabChange={this.handleTabChange}
          activeTab={this.state.activeTab}
          disabled={this.props.loading}
          extraComp={this.renderFilterSelection()}
        />
        <div className="padding-left-16 padding-right-16 position-relative">
          <div className={styles.background} style={bgStyle} />
          <div className={styles.content}>
            {firstList.map((talent) => this.renderCard(talent))}
            {showMemberTip && <UpgradeMemberTip />}
            {lastList.map((talent) => this.renderCard(talent, true))}
            {this.renderDefault()}
          </div>
        </div>
        {this.state.showDetailModal && this.renderDetailModal()}
        <Modal
          visible={this.state.showFilter}
          onCancel={this.handleStateValueChange('showFilter', false)}
          title="筛选"
          footer={false}
          width={934}
          maskClosable={false}
        >
          <Filter
            onChange={this.handleFilterChange}
            value={this.state.filter}
            show={this.state.showFilter}
          />
        </Modal>
      </div>
    )
  }
}
