import { connect } from 'react-redux'
import React, { Component } from 'react'
import * as R from 'ramda'
import { Button } from 'mm-ent-ui'
import { LoadingOutlined } from '@ant-design/icons'
import Header from 'componentsV2/Position/Resume/Header'
import { GUID } from 'utils'
import urlParse from 'url'
import Table from 'componentsV2/Position/Resume/Table'
import LogEvent from 'componentsV2/LogEvent/Index'
import CLICK_EVENETS from 'constants/eventNameList'
import styles from './index.less'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
class JobMan extends Component {
  constructor(props) {
    super(props)
    const urlObj = urlParse.parse(props.location.search, true)
    const ejid = R.trim(R.pathOr('', ['query', 'ejid'], urlObj))
    this.state = {
      resumeData: [],
      query: {
        page: 0,
        count: 20,
        rtype: 1,
        ejid,
        is_return_total: true,
      },
      loading: true,
      showPopup: true,
      validData: [],
      trackParam: {
        type: 'recruit-resumes',
      },
      sid: 0,
      isFirstLoading: true,
      valid_joblist: [],
      resume_list: [],
      filterStatus: [],
    }

    this.eventList = {
      click: CLICK_EVENETS,
    }
  }

  componentDidMount() {
    hotPicPing()
    this.fetchPingAct()
    this.fetchResumeListData()
    const sid = GUID()
    this.updateSid(sid)
    this.trackEvent('jobs_pc_resume_handle', {
      eventType: 'show',
      sid,
    })
  }
  componentWillUnmount() {
    removeHotPicPing()
  }

  fetchReloadResumeList = () => {
    const { query } = this.state
    this.props
      .dispatch({
        type: 'resumes/reloadResumeList',
        payload: query,
      })
      .then((res) => {
        if (res.result === 'ok') {
          const { resume_list = {} } = res
          this.setState({
            resume_list,
            loading: false,
          })
        }
      })
  }

  fetchResumeListData = () => {
    const { query, isFirstLoading = true } = this.state
    this.setState({ resume_list: [], loading: true })
    if (!isFirstLoading) {
      this.fetchReloadResumeList()
      return
    }
    this.props
      .dispatch({
        type: 'resumes/resumeListData',
        payload: query,
      })
      .then((res) => {
        if (res.result === 'ok') {
          const { data = {} } = res
          const {
            filterStatus = [],
            resume_list = [],
            valid_joblist = [],
          } = data
          const arr = resume_list
            .filter((item) => {
              const { rstatus } = item || {}
              return rstatus === 0
            })
            .map((v) => {
              const { ejid, id } = v
              return { ejid, uid2: id }
            })
          const infos = JSON.stringify({
            data: arr,
          })
          if (arr.length > 0) {
            // 消除badge的接口
            this.props
              .dispatch({
                type: 'resumes/multiProcess',
                payload: {
                  viewed: 1,
                  infos,
                },
              })
              .then(() => {})
          }
          this.setState({
            filterStatus,
            resume_list,
            valid_joblist,
            isFirstLoading: false,
            loading: false,
          })
        }
      })
  }

  updateSid = (sid) => {
    this.setState({ sid })
  }

  fetchPingAct() {
    this.props
      .dispatch({
        type: 'resumes/getPingAct',
        payload: {
          act: 'resume_handle_popup',
          count: 1,
          page: 0,
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          if (res.data && res.data.length > 0) {
            this.setState({ showPopup: false })
          }
        }
      })
  }

  handlePingAct = () => {
    this.props
      .dispatch({
        type: 'resumes/pingAct',
        payload: {
          act: 'resume_handle_popup',
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          this.setState({ showPopup: false })
        }
      })
  }

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

  initQuery = (v) => {
    const { sid } = this.state
    const { has_oppo = '', ejid = '', rtype = '' } = v
    this.trackEvent('jobs_pc_resume_handle', {
      eventType: 'change',
      has_oppo,
      ejid,
      rtype,
      sid,
    })
    this.setState({ isFirstLoading: true }, () => {
      this.reloadList({
        ...v,
        page: 0,
      })
    })
  }

  reloadList = (obj) => {
    let { query } = this.state
    if (obj) {
      query = {
        ...query,
        ...obj,
      }
      this.setState({ query }, this.fetchResumeListData)
    }
  }

  // table callback事件
  tableCallBack = (data) => {
    if (data === 'pingAct') {
      this.handlePingAct()
    } else if (Array.isArray(data)) {
      this.setState({ resumeData: data })
    } else if (data && (data.page || data.page === 0)) {
      this.reloadList(data)
    } else {
      this.setState({ isFirstLoading: true }, this.fetchResumeListData)
    }
  }

  handleRecirectToAddPosition = () => {
    this.props.history.push('/ent/v2/job/positions/publish')
  }

  renderLoading = () => {
    return (
      <div className={styles.centerTip}>
        <LoadingOutlined /> 正在努力加载数据！
      </div>
    )
  }

  renderEmpty = (value) => {
    const { valid_joblist } = this.state
    return (
      <div>
        <div className={styles.notData}>
          <img
            src="https://i9.taou.com/maimai/p/20992/3299_103_7JKoKalheoNp3J"
            alt="empty"
          />
          <p>
            {valid_joblist.length === 0 ? (
              <p>
                <span style={{ paddingRight: '4px' }}>暂无职位</span>
                <Button onClick={this.handleRecirectToAddPosition} type="link">
                  去发布
                </Button>
              </p>
            ) : (
              <p>{value}</p>
            )}
          </p>
        </div>
      </div>
    )
  }

  render() {
    const {
      loading,
      query,
      showPopup,
      valid_joblist,
      sid,
      trackParam,
      filterStatus = [],
      resume_list = [],
    } = this.state
    const param = {
      sid,
      ...trackParam,
    }
    return (
      <LogEvent eventList={this.eventList} className={styles.main}>
        <div id={'resumeList'}>
          {Array.isArray(filterStatus) && filterStatus.length > 0 && (
            <Header
              clickCallback={(v) => {
                this.initQuery(v)
              }}
              validData={valid_joblist}
              trackParam={param}
              filterStatus={filterStatus}
            />
          )}
          {resume_list && resume_list.length > 0 ? (
            <div className={styles.listMain}>
              <Table
                clickCallback={this.tableCallBack}
                filterStatus={filterStatus}
                resumeData={resume_list}
                query={query}
                showPopup={showPopup}
                trackParam={param}
                {...this.props}
              />
            </div>
          ) : (
            <div
              style={{ background: 'white', height: '90vh', marginTop: '24px' }}
            >
              {loading ? this.renderLoading() : this.renderEmpty('暂无简历')}
            </div>
          )}
        </div>
      </LogEvent>
    )
  }
}

export default JobMan
