/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import { Button, message, Modal } from 'antd'
// import QRCode from 'qrcode-react'
// import logoImgUrl from 'images/logo.png'
import List from 'components/Common/List'
import * as R from 'ramda'
import Layout from 'components/Layout/MenuContentSider.js'
import LogEvent from 'components/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import styles from './index.less'

@connect((state) => ({
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
  }
  refreshData = () =>
    this.setState(
      {
        page: 0,
      },
      () => {
        this.loadData().then(({ data = {} }) => {
          this.setState({
            data: R.propOr([], 'list', data),
            remain: data.remain,
          })
        })
      }
    )

  appendData = () => {
    this.loadData().then(({ data }) => {
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

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  fetchExposureStatus = (webjid) =>
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
    this.props.history.push(`/ent/talents/recruit/positions/add`)
  }

  handleRedirectEdit = (data) => () => {
    const { jid, ejid } = data
    this.trackEvent('jobs_pc_talent_position_edit_click', {
      jid,
    })
    this.props.history.push(`/ent/talents/recruit/positions/add/${ejid}`)
  }

  handleRedirectDetail = (data) => () => {
    const { jid, ejid } = data
    this.trackEvent('jobs_pc_talent_position_detail_click', {
      jid,
    })
    window.open(`http://maimai.cn/job?ejid=${ejid}`)
  }

  handleRedirectResume = (data) => {
    const { jid, ejid } = data
    this.trackEvent('jobs_pc_talent_resume_received_click', {
      jid,
    })

    if (data.judge === 'pass') {
      this.props.history.push(`/ent/talents/recruit/resumes?ejid=${ejid}`)
      return
    }
    this.props.history.push(`/ent/talents/recruit/resumes`)
  }

  handleRedirectVisitor = (jid) => () => {
    this.trackEvent('jobs_pc_talent_position_viewed_click', {
      jid,
    })
    this.props.history.push(
      `/ent/talents/discover/recommend?tab=visitor&jid=${jid}`
    )
  }

  handleOpen = (data) => () => {
    const { ejid, jid, position } = data
    this.trackEvent('jobs_pc_talent_recover_position_click', {
      jid,
    })
    Modal.confirm({
      content: (
        <div>
          <p className="font-size-14 color-common">
            确定将「{position}」职位恢复吗？
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
            message.success('职位已经恢复招聘！')
            this.trackEvent('jobs_pc_talent_recover_position_success', {
              jid,
            })
            this.refreshData()
          })
      },
      okText: '确定',
      cancelText: '取消',
      className: styles.confirmModal,
    })
  }

  handleClose = (data) => () => {
    const { ejid, jid, position } = data
    this.trackEvent('jobs_pc_talent_close_position_click', {
      jid,
    })
    Modal.confirm({
      content: (
        <div>
          <p className="font-size-14 color-common">
            确定将「{position}」职位关闭吗？
          </p>
          <p className="font-size-14 color-common">职位关闭后将停止招聘</p>
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
            message.success('职位已经关闭！')
            this.trackEvent('jobs_pc_talent_close_position_success', {
              jid,
            })
            this.refreshData()
          })
      },
      okText: '确定',
      cancelText: '取消',
      className: styles.confirmModal,
    })
  }

  // handleShowExposureModal = data => () => {
  //   const {jid, ejid} = data
  //   this.trackEvent('jobs_pc_talent_position_quick_exposure', {
  //     jid,
  //   })
  //   const qrUrl = `https://maimai.cn/job_exposure?ejid=${ejid}`
  //   Modal.info({
  //     title: '',
  //     className: styles.exposureDialog,
  //     content: (
  //       <div>
  //         <p className="font-size-16 color-stress text-center">
  //           将职位立即曝光给符合条件的活跃高端人才
  //         </p>
  //         <p className="font-size-16 color-stress text-center">
  //           快速获取简历，告别漫长等待。
  //         </p>
  //         <p className="font-size-14 color-stress text-center">
  //           (PC端暂不支持，请使用脉脉App扫描二维码)
  //         </p>
  //         <p id="exposureQrcode" className="display-inline-block text-center">
  //           <QRCode value={qrUrl} logo={logoImgUrl} size={200} />
  //         </p>
  //       </div>
  //     ),
  //     okText: '知道了',
  //   })
  // }

  handleStateChange = (state) => () => {
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
    return (
      <div className={styles.title}>
        <div className="flex flex-item-center">
          <Button
            onClick={this.handleStateChange('valid')}
            className={`like-link-button margin-left-16 ${
              this.state.state === 'valid' ? 'color-blue' : ''
            }`}
          >
            在招职位
          </Button>
          <Button
            onClick={this.handleStateChange('close')}
            className={`like-link-button margin-left-16 ${
              this.state.state === 'close' ? 'color-blue' : ''
            }`}
          >
            已关闭职位
          </Button>
        </div>
        <div>
          <Button
            className="primary-button"
            onClick={this.handleRedirectCreate}
          >
            发布职位
          </Button>
        </div>
      </div>
    )
  }

  renderCard = (data) => {
    const infoField = ['company', 'province', 'worktime', 'sdegree', 'salary']
    const info = Object.values(R.pickAll(infoField, data)).join(` / `)
    // 招聘者身份审核中和审核失败状态中，标签显示：未通过认证
    const disableEditState = data.src_judge === 5
    const judgeMap = {
      pending: <span className={styles.pendingState}>审核中</span>,
      pass: '',
      reject: <span className={styles.rejectState}>未过审</span>,
    }
    const notCertified =
      data.src_judge === 5 ? (
        <span className={styles.rejectState}>未通过认证</span>
      ) : null
    const exposureState =
      data.exposure_state === 1 ? (
        <span className={styles.exposureState}>曝光中</span>
      ) : null
    const closeState =
      data.state === 'close' ? (
        <span className={styles.closeState}>已关闭</span>
      ) : null
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
          <p className="color-dilution">{data.crtime}发布</p>
          {data.judge_reason && (
            <div className={styles.judge_reason}>
              审核失败原因：{data.judge_reason}
            </div>
          )}
        </div>

        <div className="flex flex-align-center">
          <span className={`flex-column ${styles.hoverBlue}`}>
            <span className="font-size-16 font-weight-bold text-center color-stress">
              {data.resume_cnt}
            </span>
            <Button
              className="like-link-button"
              onClick={() => this.handleRedirectResume(data)}
              disabled={
                data.state !== 'valid' ||
                data.judge !== 'pass' ||
                data.src_judge === 5
              }
            >
              收到的简历
            </Button>
          </span>
          <span className={`flex-column margin-left-80 ${styles.hoverBlue}`}>
            <span className="color-stress font-size-16 font-weight-bold text-center">
              {data.viewed_cnt}
            </span>
            <Button
              className="like-link-button"
              disabled={
                data.state !== 'valid' ||
                data.judge !== 'pass' ||
                data.src_judge === 5
              }
              onClick={this.handleRedirectVisitor(data.jid)}
            >
              看过的人
            </Button>
          </span>
          <Button
            className="margin-left-80 like-link-button"
            onClick={this.handleRedirectEdit(data)}
            disabled={disableEditState}
          >
            编辑
          </Button>
          {/* {data.state === 'valid' &&
            memExposureLeft > 0 && (
              <Button
                onClick={this.handleShowExposureModal(data)}
                className="margin-left-32 like-link-button"
                disabled={
                  data.state === 'close' ||
                  ['pending', 'reject'].includes(data.judge)
                }
              >
                极速曝光
              </Button>
            )} */}
          {data.state === 'valid' && (
            <Button
              className="margin-left-32 like-link-button"
              onClick={this.handleClose(data)}
            >
              关闭
            </Button>
          )}
          {data.state === 'close' && (
            <Button
              className="margin-left-32 like-link-button"
              onClick={this.handleOpen(data)}
            >
              恢复招聘
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
        >
          发布职位
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
          暂无职位
          <Button
            className="margin-left-8 font-size-16 color-blue like-link-button"
            onClick={this.handleRedirectCreate}
          >
            去发布
          </Button>
        </p>
      </div>
    )
  }

  render() {
    const { loading } = this.props
    const { data, remain } = this.state
    return (
      <Layout key="layout">
        <LogEvent eventList={this.eventList} className={styles.main}>
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
        </LogEvent>
      </Layout>
    )
  }
}
