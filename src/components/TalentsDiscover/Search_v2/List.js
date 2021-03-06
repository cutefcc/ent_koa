/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import TalentCard from 'components/Common/TalentCard/CommonCardWithTrack'
import List from 'components/Common/List'
import { GUID } from 'utils'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import moment from 'moment'
import { MUNICIPALITY } from 'constants'
import styles from './list.less'
import BuyVipModalV2 from 'componentsV2/Position/PublishJob/BuyVipModalV2'

@connect((state) => ({
  loadingList: state.loading.effects['talents/searchV2'],
  jobs: state.global.jobs,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class MyList extends React.Component {
  static propTypes = {
    onSelectChange: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    search: PropTypes.string.isRequired,
    hasInvitedIds: PropTypes.array,
    hasDirectInviteIds: PropTypes.array,
    hasAddFriendIds: PropTypes.array,
    hasAddGroups: PropTypes.object,
    onOpFinish: PropTypes.func,
    onSearchChange: PropTypes.func,
    type: PropTypes.string,
  }

  static defaultProps = {
    hasInvitedIds: [],
    hasDirectInviteIds: [],
    hasAddFriendIds: [],
    onOpFinish: () => {},
    onSearchChange: () => {},
    hasAddGroups: {},
    // type: 'interest',
    type: 'search',
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 0,
      remain: 0,
      errorCode: 0,
      search: props.search,
      sessionid: undefined,
      deletesessionid: undefined,
      tests: [],
      showBanner: true,
      payContactLimit: false,
      payBannersData: {},
    }
    this.timer = {}
  }

  componentDidMount() {
    this.refreshData()
    this.getPayBannersData()
  }
  componentWillReceiveProps(newProps) {
    if (newProps.search !== this.props.search) {
      this.setState(
        {
          search: newProps.search,
        },
        this.refreshData
      )
    }
  }
  setScrollDom = (dom) => {
    this.scrollDom = dom
  }
  getSearchParam = () => {
    const { search } = this.state
    // ?????? cities ??????
    const { cities = '' } = search
    const cityList = R.without([''], cities.split(','))
    const formatCity = (v) => {
      const temp = v.split('-')
      return R.propOr(temp[0], 1, temp)
    }
    const cityParam =
      cityList.length === 0
        ? {}
        : {
            cities: cityList.map(formatCity).join(','),
          }
    // ?????? companys ??????
    const { companys = '' } = search
    const isBat = search.companys && search.companys.includes('BAT')
    const isTmdj = search.companys && search.companys.includes('TMDJ')
    const companysParam =
      isBat || isTmdj
        ? {
            companys: companys
              .replace(/BAT/g, '??????,??????,??????')
              .replace(/TMDJ/g, '????????????,??????,??????,??????,????????????'),
          }
        : {}

    return {
      ...search,
      ...companysParam,
      ...cityParam,
    }
  }
  getFormatItem = (item) => {
    const { id } = item
    return {
      ...item,
      is_direct_im: R.contains(id, this.props.hasInvitedIds)
        ? 1
        : item.is_direct_im,
      friend_state: R.contains(id, this.props.hasAddFriendIds)
        ? 1
        : item.friend_state,
      direct_invite_status: R.contains(id, this.props.hasDirectInviteIds)
        ? 1
        : item.direct_invite_status,
      groups: R.has(id, this.props.hasAddGroups)
        ? R.uniq(
            R.concat(
              R.propOr([], 'groups', item),
              this.props.hasAddGroups[id].split(',')
            )
          )
        : item.groups,
    }
  }

  isValidSearch = () => {
    const { search } = this.state
    // ????????????????????????????????????????????????????????????
    return !(!search.positions && !search.query && !search.companys)
  }

  getPayBannersData = (state, vipState) => {
    this.props
      .dispatch({
        type: 'positions/getPayBanners',
        payload: {
          ejid: this.state.ejid ? this.state.ejid : this.state.ejidFinished,
          auth_status: state,
          fr: 'recruiter_advanced_search_limit_pc_v2',
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          this.setState({
            payBannersData: res,
          })
        }
      })
  }

  refreshData = () => {
    // ??????????????????
    if (this.scrollDom) {
      this.scrollDom.scrollTop = 0
    }
    const sid = GUID()
    window.pc_search_sid = sid
    this.setState(
      {
        data: [],
        page: 0,
        remain: 0,
        sessionid: sid,
        deletesessionid: this.state.sessionid,
      },
      this.loadData
    )
  }

  loadData = () => {
    if (this.props.type === 'default') {
      return
    }
    const fetchData = this.fetchSearchList()
    fetchData.then(({ data = {} }) => {
      const { error_code: errorCode, remain, tests } = data
      const list = R.propOr([], 'list', data)
      const allData =
        this.state.page === 0
          ? list
          : R.uniqBy(R.prop('id'), [...this.state.data, ...list])
      this.setState({
        data: allData,
        remain,
        errorCode,
        tests,
        page:
          errorCode && this.state.page > 0
            ? this.state.page - 1
            : this.state.page,
      })
      this.props.onDataChange(allData)
    })
  }

  loadMore = () =>
    this.setState(
      {
        page: this.state.page + 1,
        deletesessionid: undefined,
      },
      this.loadData
    )

  fetchSearchList = () => {
    const searchParam = this.getSearchParam()
    if (window.voyager) {
      const key = 'jobs_pc_talent_list'
      const param = {
        sid: this.state.sessionid,
        condition: encodeURI(JSON.stringify(searchParam)),
        type: this.props.type,
        uid: window.uid,
        ...this.props.trackParam,
      }
      window.voyager.trackEvent(key, key, param)
    }
    const param = {
      page: this.state.page,
      size: 20,
      sessionid: this.state.sessionid,
      deletesessionid: this.state.deletesessionid,
      ...searchParam,
    }
    return this.props.dispatch({
      type: 'talents/searchV2',
      payload: param,
    })
  }

  handleSelect = (id) => (selected) => {
    const { data } = this.state
    const { selectedItems } = this.props
    const selectedIds = selectedItems.map(R.prop('id'))
    const ids = selected ? [...selectedIds, id] : R.without([id], selectedIds)

    this.props.onSelectChange(
      ids.length === data.length,
      data.filter((item) => R.contains(item.id, ids))
    )
  }

  handleOk = () => {
    this.setState({
      payContactLimit: false,
    })
  }

  handleCancel = () => {
    this.setState({
      payContactLimit: false,
    })
  }

  handleOpFinish = (type, item, groupName) =>
    this.props.onOpFinish(type, [item.id], groupName)

  handleHideBanner = () => {
    this.setState({
      showBanner: false,
    })
  }

  handleGetUserLimit = () => (dataList) => {
    const ids = dataList.map(R.prop('id'))
    return new Promise((resolve, reject) => {
      this.props
        .dispatch({
          type: 'talents/fetchListUserLimit',
          payload: {
            uid: R.pathOr('', ['props', 'currentUser', 'ucard', 'id'], this),
            to_uid: ids.join(','),
          },
        })
        .then((data) => {
          if (R.pathOr(-1, ['code'], data) === 0) {
            const isLimit = R.pathOr(0, ['is_limit'], data)
            if (isLimit === 1) {
              this.setState(
                {
                  payContactLimit: true,
                },
                () => {
                  // let num = 0
                  // // eslint-disable-next-line no-use-before-define
                  // const intervalID = setInterval(getIframeDom, 500)
                  // function getIframeDom() {
                  //   num += 1
                  //   if (num >= 10) {
                  //     clearInterval(intervalID)
                  //   }
                  //   const pcContactLimitModal = document.getElementById(
                  //     'pcContactLimitModal'
                  //   )
                  //   let scCvbbAY
                  //   let dpHOWP
                  //   if (
                  //     window.frames &&
                  //     window.frames[0] &&
                  //     window.frames[0].body
                  //   ) {
                  //     ;([
                  //       scCvbbAY,
                  //     ] = window.frames[0].body.getElementsByClassName(
                  //       'sc-cvbbAY'
                  //     ))(
                  //       ([
                  //         dpHOWP,
                  //       ] = window.frames[0].body.getElementsByClassName(
                  //         'dpHOWP'
                  //       ))
                  //     )
                  //   }
                  //   if (pcContactLimitModal && scCvbbAY && dpHOWP) {
                  //     scCvbbAY.style.display = 'none'
                  //     dpHOWP.style.background = '#fff'
                  //     clearInterval(intervalID)
                  //   }
                  // }
                }
              )
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
        .catch(() => {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false)
        })
    })
  }

  handleJobClick = (item) => () => {
    const { province = '', city = '' } = item
    this.props.onSearchChange({
      positions: R.propOr('', 'position', item),
      professions: R.propOr('', 'profession', item),
      provinces: MUNICIPALITY.includes(province) ? province : '',
      cities: MUNICIPALITY.includes(province) ? '' : city,
      degrees: `${R.propOr('', 'degree', item)}`,
      worktimes: `${item.worktime}`,
    })
  }

  renderTalentItem = (item, index) => {
    const selectedIds = this.props.selectedItems.map(R.prop('id'))
    const formatItem = this.getFormatItem(item)
    const trackParam = {
      sid: this.state.sessionid,
      type: this.props.type,
      page_no: this.state.page,
      page_position: index,
      tests: this.state.tests,
      fr: 'talentDiscover_discover_list_pc_free',
      ...this.props.trackParam,
    }
    return (
      <TalentCard
        item={formatItem}
        onOpFinish={this.handleOpFinish}
        onSelect={this.handleSelect(formatItem.id)}
        checked={selectedIds.includes(formatItem.id)}
        trackParam={trackParam}
        showCheckbox
        scrollDom={this.scrollDom}
        key={item.id}
        fr="discoverListForPc"
        onGetUserLimit={this.handleGetUserLimit()}
      />
    )
  }

  renderBanner = () => {
    const currentTime = moment().unix()
    const expiryTime = moment(new Date('2020/1/1 23:59:59')).unix()
    if (currentTime < expiryTime) {
      return (
        <div className={styles.banner}>
          <a
            href="https://mp.weixin.qq.com/s/HVqIb_1wIJKVvy8xjaT7sQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={`${this.props.urlPrefix}/images/banner.png`}
              alt="2019????????????????????????"
            />
          </a>
          <span className={styles.close} onClick={this.handleHideBanner}>
            <CloseOutlined />
          </span>
        </div>
      )
    }
    return <div className={styles.banner} />
  }

  renderList = () => (
    <div>
      {this.props.type === 'interest' && (
        <div>
          {this.state.showBanner && this.renderBanner()}
          <h5 className="font-size-18 color-stress width-100% text-center margin-bottom-0 padding-top-16">
            ????????????
          </h5>
          <p className="font-size-14 color-dilution width-100% text-center">
            ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
          </p>
        </div>
      )}
      {this.state.data.map(this.renderTalentItem)}
    </div>
  )

  renderJobsSelection = () => (
    <div>
      <p className={styles.jobSelectionTitle}>??????????????????????????????</p>
      <p>
        {this.props.jobs.slice(0, 3).map((item) => (
          <span
            className={styles.jobTag}
            key={item.id}
            onClick={this.handleJobClick(item)}
          >
            {item.position}
          </span>
        ))}
      </p>
    </div>
  )

  renderEmptyImg = () => (
    <img src={`${this.props.urlPrefix}/images/empty.png`} alt="emptyImage" />
  )

  renderDefaultTip = () => (
    <div className={styles.defaultTip}>
      {this.state.showBanner && this.renderBanner()}
      <div>
        <p>{this.renderEmptyImg()}</p>
        <p className="color-dilution font-size-14 margin-top-16">
          ?????????&quot;?????????&quot;???&quot;????????????&quot;???&quot;??????&quot;????????????
        </p>
      </div>
      {!this.state.errorCode && this.renderJobsSelection()}
    </div>
  )

  renderEmptyTip = () => {
    return (
      <div className={`${styles.defaultTip} ${styles.emptyTip}`}>
        <div>
          <p>{this.renderEmptyImg()}</p>
          {!this.state.errorCode && (
            <p className={styles.resultTip}>
              ???????????? ???????????????????????????????????????
            </p>
          )}
          {!!this.state.errorCode && (
            <div>
              <p className={styles.resultTip}>???????????????????????????????????????</p>
              <p>
                <Button className={styles.retryButton} onClick={this.loadData}>
                  ??????
                </Button>
              </p>
            </div>
          )}
        </div>
        {!this.state.errorCode && this.renderJobsSelection()}
      </div>
    )
  }

  render() {
    const { loadingList, interestLoading } = this.props
    const {
      remain,
      data: { length: dataLngth = 0 },
      payBannersData = {},
    } = this.state

    return (
      <div>
        <List
          renderList={this.renderList}
          loadMore={this.loadMore}
          loading={this.props.type === 'search' ? loadingList : interestLoading}
          dataLength={dataLngth}
          remain={remain}
          key="list"
          search={this.props.type === 'search' ? 'default' : ''}
          renderDefaultTip={this.renderDefaultTip}
          emptyTip={this.renderEmptyTip()}
          errorCode={this.state.errorCode}
          setScrollDom={this.setScrollDom}
        />
        {this.state.payContactLimit ? (
          <BuyVipModalV2
            onCancel={this.handleCancel}
            payBannersData={payBannersData}
            fr="recruiter_advanced_search_limit_pc_v2"
          />
        ) : null}
      </div>
    )
  }
}
