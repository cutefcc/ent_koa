/* eslint-disable max-lines */
import React from 'react'
import * as R from 'ramda'
import {connect} from 'react-redux'
import {message, Modal} from 'antd'
import {Button} from 'mm-ent-ui'
// import QRCode from 'qrcode-react'
// import logoImgUrl from 'images/logo.png'
import {formatArea} from 'utils'
import List from 'componentsV2/Common/List'
import LogEvent from 'componentsV2/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import { hotPicPing,removeHotPicPing } from 'utils/HotPicPing'
import styles from './index.less'
@connect(state => ({
  loading: false, // state.loading.models.positions,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
export default class PositionList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      remain: 0,
      page: 0,
      state: 'valid',
      trackParam: {
        type: 'recruit-positions',
      },
    }

    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentWillMount() {
    this.refreshData()
    hotPicPing()
  }

  componentWillUnmount() {
    removeHotPicPing()
  }

  refreshData = () =>
    this.setState(
      {
        page: 0,
      },
      () => {
        this.loadData().then(({data = {}} = {}) => {
          this.setState({
            data: R.propOr([], 'list', data),
            remain: data.remain,
          })
        })
      }
    )

  appendData = () => {
    this.loadData().then(({data = {}} = {}) => {
      this.setState({
        data: R.uniqBy(R.prop('ejid'), [
          ...this.state.data,
          ...R.propOr([], 'list', data),
        ]),
        remain: data.remain,
      })
    })
  }

  loadData = () =>
    this.props.dispatch({
      type: 'positions/fetch',
      payload: {
        page: this.state.page,
        state: this.state.state,
      },
    })

  updateJobList = () => {
    this.props.dispatch({
      type: 'global/fetchJobs',
      payload: {},
    })
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  fetchExposureStatus = webjid =>
    this.props.dispatch({
      type: 'positions/fetchExposureStatus',
      payload: {
        webjid,
      },
    })

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.state.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  handleRedirectCreate = () => {
    this.trackEvent('jobs_pc_talent_position_publish_click')
    this.props.history.push('/ent/v2/job/positions/publish')
  }

  handleRedirectEdit = data => () => {
    const {jid, ejid} = data
    this.trackEvent('jobs_pc_talent_position_edit_click', {
      jid,
    })
    this.props.history.push(`/ent/v2/job/positions/publish/${ejid}`)
  }

  handleRedirectDetail = data => () => {
    const {jid, ejid} = data
    this.trackEvent('jobs_pc_talent_position_detail_click', {
      jid,
    })
    window.open(`http://maimai.cn/job?ejid=${ejid}`)
  }

  handleRedirectResume = data => () => {
    const {jid, ejid} = data
    this.trackEvent('jobs_pc_talent_resume_received_click', {
      jid,
    })
    // this.props.history.push('/ent/talents/recruit/resumes')
    this.props.history.push(`/ent/v2/job/resumes?ejid=${ejid}`)
  }

  handleRedirectVisitor = jid => () => {
    this.trackEvent('jobs_pc_talent_position_viewed_click', {
      jid,
    })
    this.props.history.push(`/ent/v2/job/recommend?tab=visitor&jid=${jid}`)
    // this.props.history.push(
    //   `/ent/talents/discover/recommend?tab=visitor&jid=${jid}`
    // )
  }

  handleOpen = data => () => {
    const {ejid, jid, position} = data
    this.trackEvent('jobs_pc_talent_recover_position_click', {
      jid,
    })
    Modal.confirm({
      content: (
        <div>
          <p className="font-size-14 color-common">
            ????????????{position}?????????????????????
          </p>
        </div>
      ),
      onOk: () => {
        this.props
          .dispatch({
            type: 'positions/open',
            payload: {
              ejid,
            },
          })
          .then(() => {
            message.success('???????????????????????????')
            this.updateJobList()
            this.trackEvent('jobs_pc_talent_recover_position_success', {
              jid,
            })
            this.refreshData()
          })
      },
      okText: '??????',
      cancelText: '??????',
      className: styles.confirmModal,
    })
  }

  handleClose = data => () => {
    const {ejid, jid, position} = data
    this.trackEvent('jobs_pc_talent_close_position_click', {
      jid,
    })
    Modal.confirm({
      content: (
        <div>
          <p className="font-size-14 color-common">
            ????????????{position}?????????????????????
          </p>
          <p className="font-size-14 color-common">??????????????????????????????</p>
        </div>
      ),
      onOk: () => {
        this.props
          .dispatch({
            type: 'positions/close',
            payload: {
              ejid,
            },
          })
          .then(() => {
            message.success('?????????????????????')
            this.updateJobList()
            this.trackEvent('jobs_pc_talent_close_position_success', {
              jid,
            })
            this.refreshData()
          })
      },
      okText: '??????',
      cancelText: '??????',
      className: styles.confirmModal,
    })
  }

  handleStateChange = state => () => {
    const key =
      state === 'valid'
        ? 'jobs_pc_talent_position_opened_click'
        : 'jobs_pc_talent_position_closed_click'
    this.trackEvent(key)
    this.setState(
      {
        state,
      },
      this.refreshData
    )
  }

  renderTitle = () => {
    const {state} = this.state
    return (
      <div className={styles.title}>
        <div>
          <span
            onClick={this.handleStateChange('valid')}
            className={state === 'valid' ? styles.active : ''}
          >
            ????????????
          </span>
          <span
            onClick={this.handleStateChange('close')}
            className={`${
              state === 'close' ? styles.active : ''
            } margin-left-16`}
          >
            ???????????????
          </span>
        </div>
        <Button onClick={this.handleRedirectCreate} type="primary">
          ????????????
        </Button>
      </div>
    )
  }

  renderCard = data => {
    const area = formatArea({
      province: data.province,
      city: data.city,
    })
    const infoField = ['area', 'worktime', 'sdegree', 'salary']
    let infoArr = Object.values(
      R.pickAll(infoField, {
        ...data,
        area,
      })
    )
    infoArr.unshift(data.is_public ? data.company : '?????????')
    const info = infoArr.join(` / `)
    const judgeMap = {
      pending: <span className={styles.pendingState}>?????????</span>,
      pass: '',
      reject: <span className={styles.rejectState}>?????????</span>,
    }
    const notCertified =
      data.src_judge === 5 ? (
        <span className={styles.rejectState}>???????????????</span>
      ) : null
    const exposureState =
      data.exposure_state === 1 ? (
        <span className={styles.exposureState}>?????????</span>
      ) : null
    const closeState =
      data.state === 'close' ? (
        <span className={styles.closeState}>?????????</span>
      ) : null
    const disableState =
      data.state !== 'valid' || data.judge !== 'pass' || data.src_judge === 5
    // ?????????????????????????????????????????????????????????????????????????????????
    const disableEditState = data.src_judge === 5
    // const memExposureLeft = R.pathOr(
    //   0,
    //   ['mem', 'exposure'],
    //   this.props.currentUser
    // )
    return (
      <div className={`${styles.card} flex`} key={data.webjid}>
        <div clasName="flex-1">
          <p className="color-stress font-weight-bold font-size-16">
            <span
              className="like-link-button"
              onClick={this.handleRedirectDetail(data)}
              title={data.position}
            >
              {data.position}
            </span>
            <span className={styles.judge}>
              {data.state === 'valid' &&
                data.src_judge !== 5 &&
                R.propOr('', data.judge, judgeMap)}
              {data.src_state === 1 && notCertified}
              {exposureState}
              {closeState}
            </span>
          </p>
          <p className="color-common">{info}</p>
          <p className="color-dilution">{data.crtime}??????</p>
          {data.judge_reason && (
            <div className={styles.judge_reason}>
              ?????????????????????{data.judge_reason}
            </div>
          )}
        </div>

        <div className="flex flex-align-center">
          <Button
            className="flex-column margin-left-80 flex-align-center"
            type="likeLink"
            onClick={this.handleRedirectResume(data)}
            disabled={disableState}
          >
            <span className="font-size-16 font-weight-bold">
              {data.resume_cnt}
            </span>
            <span>???????????????</span>
          </Button>
          <Button
            className="flex-column margin-left-80 flex-align-center"
            type="likeLink"
            onClick={this.handleRedirectVisitor(data.jid)}
            disabled={disableState}
          >
            <span className="font-size-16 font-weight-bold">
              {data.viewed_cnt}
            </span>
            <span>????????????</span>
          </Button>
          <Button
            className="margin-left-80"
            onClick={this.handleRedirectEdit(data)}
            disabled={disableEditState}
            type="likeLink"
          >
            ??????
          </Button>
          {/* {data.state === 'valid' &&
            memExposureLeft > 0 && (
              <Button
                onClick={this.handleShowExposureModal(data)}
                className="margin-left-32"
                disabled={
                  data.state === 'close' ||
                  ['pending', 'reject'].includes(data.judge)
                }
                type="likeLink"
              >
                ????????????
              </Button>
            )} */}
          {data.state === 'valid' && (
            <Button
              className="margin-left-32"
              onClick={this.handleClose(data)}
              type="likeLink"
            >
              ??????
            </Button>
          )}
          {data.state === 'close' && (
            <Button
              className="margin-left-32"
              onClick={this.handleOpen(data)}
              type="likeLink"
            >
              ????????????
            </Button>
          )}
        </div>
      </div>
    )
  }

  renderCards = () => {
    return this.state.data.map(this.renderCard)
  }

  renderButton = () =>
    this.state.data.length > 0 && (
      <div className={styles.header} key="button">
        <Button
          className={styles.activeButton}
          onClick={this.handleRedirectCreate}
          type="primary"
        >
          ????????????
        </Button>
      </div>
    )

  renderEmptyTip = () => {
    return (
      <div className={styles.emptyTip}>
        <img
          src={`${this.props.urlPrefix}/images/empty_position.png`}
          alt="emptyImage"
        />
        <p className="font-size-16">
          ????????????
          <Button
            className="margin-left-8 font-size-16 color-blue"
            onClick={this.handleRedirectCreate}
            type="likeLink"
          >
            ?????????
          </Button>
        </p>
      </div>
    )
  }

  render() {
    const {loading} = this.props
    const {data, remain} = this.state
    return (
      <LogEvent eventList={this.eventList} className={styles.main}>
        <React.Fragment>
          {this.renderTitle()}
          <List
            renderList={this.renderCards}
            loadMore={this.loadMore}
            loading={loading}
            dataLength={data.length}
            remain={remain}
            key="list"
            search="all"
            emptyTip={this.renderEmptyTip()}
            trackParam={this.state.trackParam}
          />
        </React.Fragment>
      </LogEvent>
    )
  }
}
