import React from 'react'
import { connect } from 'react-redux'
import qs from 'query-string'
import * as R from 'ramda'
// import {ActivityIndicator, Modal, List} from 'antd-mobile'
// import {getCookie} from 'tiny-cookie'
import { REJECT_REASON } from 'constants/position'

// import 'antd-mobile/lib/activity-indicator/style/index.css'
// import 'antd-mobile/lib/modal/style/index.css'
// import 'antd-mobile/lib/list/style/index.css'

import styles from './preview.less'

@connect((state) => ({
  loading: false, // state.loading.models.positions,
}))
export default class Preview extends React.Component {
  constructor(props) {
    super(props)
    const search = qs.parse(window.location.search.slice(1))

    this.state = {
      job: {},
      webuid: search.webuid,
      webjid: search.webjid,
      webrigid: search.webrigid,
      webrecid: search.webrecid,
      // search,
      showRejectModal: false,
      showAgreeModal: false,
      // tokenInfo: {},
    }
  }

  componentWillMount() {
    // window.auth_callback = res => {
    //   try {
    //     const {result, ...other} = JSON.parse(res)
    //     this.setState(
    //       {
    //         tokenInfo: {
    //           ...other,
    //           access_token:
    //             other.access_token ||
    //             other.oauth_token ||
    //             getCookie('access_token'),
    //           uid: other.uid || getCookie('u'),
    //         },
    //       },
    //       this.fetchJobDetail
    //     )
    //   } catch (e) {
    //     console.log('something is error')
    //   }
    // }

    // if (typeof MaiMai !== 'undefined' && window.MaiMai) {
    //   window.MaiMai.auth('0', 'auth_callback')
    // } else {
    //   const tokenInfo = {
    //     uid: getCookie('u'),
    //     access_token: getCookie('access_token'),
    //   }
    //   this.setState(
    //     {
    //       tokenInfo,
    //     },
    //     this.fetchJobDetail
    //   )
    // }
    this.fetchJobDetail()
  }

  getValue = (key) => {
    const data = R.propOr('', key, this.state.job)
    const format = {
      description: (v) =>
        v
          .split('\n')
          .map((des, index) => des && <li key={`item${index + 1}`}>{des}</li>),
    }
    return format[key] ? format[key](data) : data
  }

  close = (tips = '', flag = true) => () => {
    if (window.parent.MaiMai_Native) {
      window.parent.MaiMai_Native.close_native(tips, flag)
    }

    if (window.MaiMai_Native) {
      window.MaiMai_Native.close_native(tips, flag)
    }
  }

  disAgreeConnect = ({ key, label }) => () => {
    this.props
      .dispatch({
        type: 'positions/disAgreeConnect',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
          webrigid: this.state.webrigid,
          webrecid: this.state.webrecid,
          // ...this.state.search,
          reason: label,
          reason_id: key,
          // ...this.state.tokenInfo,
        },
      })
      .then(this.close())
  }

  agreeConnect = (state) => () =>
    this.props
      .dispatch({
        type: 'positions/agreeConnect',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
          webrigid: this.state.webrigid,
          webrecid: this.state.webrecid,
          // ...this.state.search,
          state,
          // ...this.state.tokenInfo,
        },
      })
      .then(this.close())

  fetchJobDetail = () => {
    return this.props
      .dispatch({
        type: 'positions/fetchDetail',
        payload: {
          webuid: this.state.webuid,
          webjid: this.state.webjid,
          // ...this.state.tokenInfo,
          // access_token: this.state.access_token,
          // ...this.state.search,
        },
      })
      .then(({ job }) => {
        this.setState({ job })
      })
  }

  handleShowRejectModal = (e) => {
    e.preventDefault()
    this.setState({ showRejectModal: true })
  }

  handleHideRejectModal = (e) => {
    e.preventDefault()
    this.setState({ showRejectModal: false })
  }

  handleShowAgreeModal = (e) => {
    e.preventDefault()
    // this.agreeConnect('iam')()
    this.setState({ showAgreeModal: true })
  }

  handleHideAgreeModal = (e) => {
    e.preventDefault()
    this.setState({ showAgreeModal: false })
  }

  renderJobTags = () => {
    const { stags = '' } = this.state.job
    const tagList = stags.split(',')
    const tag = (value, index) => (
      <span className={styles.positionDetailTag} key={`value${index + 1}`}>
        {value}
      </span>
    )
    return tagList.map(tag)
  }

  renderReasons = () => {
    return REJECT_REASON.map((item) => (
      <List.Item key={item.key} onClick={this.disAgreeConnect(item)}>
        {item.label}
      </List.Item>
    ))
  }

  render() {
    const { job, showRejectModal, showAgreeModal } = this.state
    const { loading } = this.props
    if (loading) {
      return (
        <div className="toast-example">
          {/* <ActivityIndicator toast text="Loading..." animating={loading} /> */}
        </div>
      )
    }
    return (
      <div className={styles.previewMain}>
        <header>
          <h3>{this.getValue('position')}</h3>
          <p className={styles.positionProfile}>
            <span>
              {`${this.getValue('province')} | ${this.getValue(
                'sdegree'
              )} | ${this.getValue('worktime')}`}
            </span>
            <span className={styles.positionProfileSalary}>
              {this.getValue('salary')}
            </span>
          </p>
        </header>

        <div className={styles.company}>
          <img className={styles.companyLogo} src={job.clogo} alt="logo" />
          <div className={styles.companyProfile}>
            <p>{this.getValue('company')}</p>
            <p>
              {`${this.getValue('domain')}   |  ${this.getValue(
                'stage'
              )}  |  ${this.getValue('people')}`}
            </p>
          </div>
        </div>

        <div className={styles.positionDetail}>
          <h3>职位描述</h3>
          <div className={styles.positionDetailTags}>
            {this.renderJobTags()}
          </div>
          <ul className={styles.positionDetailTxt}>
            {this.getValue('description')}
          </ul>
        </div>

        <div className={styles.tip}>
          <h4 className={styles.tipTitle}>温馨提示</h4>
          <p>以担保或任何理由索取财物，扣押证照，均涉嫌违法，请提高警惕！</p>
        </div>

        {!!job.is_show && (
          <div className={styles.opButtons}>
            <button
              className={styles.opButtonsReject}
              onClick={this.handleShowRejectModal}
            >
              不感兴趣
            </button>
            <button
              className={styles.opButtonsMai}
              onClick={this.agreeConnect('im')}
            >
              感兴趣
            </button>
            <button
              className={styles.opButtonsPhone}
              // onClick={this.agreeConnect('iam')}
              onClick={this.handleShowAgreeModal}
            >
              同意电话沟通
            </button>
          </div>
        )}
        {/* <Modal
          popup
          visible={showRejectModal}
          onClose={this.handleHideRejectModal}
          animationType="slide-up"
          className={styles.rejectModal}
        >
          <List
            renderHeader={() => <div>不感兴趣原因?</div>}
            className="popup-list"
          >
            {this.renderReasons()}
          </List>
        </Modal>

        <Modal
          visible={showAgreeModal}
          onClose={this.handleHideAgreeModal}
          animationType="slide-up"
          className={styles.agreeModal}
          transparent
          footer={[
            {
              text: '确定',
              onPress: this.agreeConnect('mobile'),
            },
          ]}
        >
          <p>亲爱的小伙伴:</p>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;HR 会尽快与您取得联系，请保持手机畅通~~~
          </p>
        </Modal> */}
      </div>
    )
  }
}
