/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { redirectToIm } from 'utils'
import { Button, message, Modal, Checkbox } from 'antd'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import { TRACKEVENTNAMEMAP } from 'constants/resume'
import GroupButton from 'componentsV2/Common/RightButton/GroupButton_v2'
import styles from './Table.less'
import urlParse from 'url'
import { Drawer } from 'antd'

@connect((state) => ({
  jobs: state.global.jobs,
}))
export default class ResumeCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: this.props.showPopup,
      visible: false,
      actionValue: {},
      checked: false,
      withdrawVisible: false,
      data: this.props.value,
      index: this.props.index,
      imgErr: false,
      showPop: false,
      visibleDrawer: false,
      query: this.props.query,
    }
  }

  static tagConfig = {
    0: { text: '未读' },
    3: { text: '不合适' }, // 不合适
  }

  messageCallBack = (e) => {
    if (e.data) {
      const itemInfo = e.data
      const { type, uid2, jid } = itemInfo
      const { value = {} } = this.props
      const { id } = value
      if (!!jid && !!type && !!uid2 && uid2 === id && jid === value.jid) {
        if (type === 9) {
          this.child.handleShowModal()
          return
        }
        this.handleResume(type, value, 'message')
      }
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.messageCallBack)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageCallBack)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.value, query: nextProps.query })
  }

  // 不合适单选框
  handleChangeCheckbox = (e) => {
    this.setState({ checked: e.target.checked })
  }

  /** 改版单选状态* */
  handleChangeRadio = () => {
    const { data, index } = this.state
    data.type = !data.type
    this.props.clickCallback(data, index)
  }

  // 隐藏不合适弹窗
  handleHideModal = () => {
    this.setState({ visible: false })
  }

  handleHideRadioModal = () => {
    this.setState({ withdrawVisible: false })
  }

  // 不合适弹窗确认
  handleOk = () => {
    const { actionValue, checked } = this.state
    this.handleResume(2, actionValue, 'inappropriate')
    const { uid, ejid } = actionValue
    this.trackEvent('jobs_pc_talent_resume_unsuitable_confirm', {
      ejid,
      u2: uid,
    })
    this.setState({ visible: false })
    if (checked) {
      this.props.clickCallback('pingAct')
      this.setState({ showPopup: false })
    }
  }

  handleRadioOk = () => {
    const { actionValue } = this.state
    // 撤回简历确认打点
    const { uid, ejid } = actionValue
    const param = [
      {
        ejid,
        u2: uid,
      },
    ]
    this.trackEvent('jobs_pc_talent_withdraw_resume_confirm', {
      param,
    })
    this.setState({ withdrawVisible: false })
    this.handleResume(3, actionValue, 'withdraw')
  }

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  initResumeUrl = () => {
    const { data = {} } = this.state
    const { ejid = '', web_uid = '' } = data
    if (ejid && web_uid) {
      return `https://maimai.cn/jobs/jobs_resume?webuid=${web_uid}&ejid=${ejid}&fr=webResume&mobile=1&is_from_pc=true`
    }
    return null
  }

  renderDrawer = () => {
    const resumeUrl = this.initResumeUrl()
    if (resumeUrl) {
      return (
        <div className={styles.popupMain}>
          <iframe seamless title="简历详情" src={resumeUrl} />
        </div>
      )
    }
    return null
  }

  // 打开im
  chat = () => {
    const { data = {} } = this.state
    const { url = '' } = data
    const query = R.pathOr('', ['query'], urlParse.parse(url, true))
    const webuid = R.pathOr('', ['webuid'], query)
    redirectToIm(webuid)
  }

  directChat = () => {
    const { data = {} } = this.state
    const {
      has_direct_oppo = false,
      ejid = '',
      encode_mmid = '',
      key = '',
    } = data
    if (has_direct_oppo) {
      this.chat()
      return
    }
    const params = {
      ejid,
      candidate: encode_mmid,
      fr: 'resume_list_pc', // resume_detail
      resume_badge_id: key,
    }

    this.props
      .dispatch({
        type: 'resumes/getDirectChat',
        payload: params,
      })
      .then((res) => {
        if (res.result === 'ok') {
          if (!has_direct_oppo) {
            data.has_direct_oppo = true
            this.setState({ data })
            this.setPostMessage()
          }
          this.chat()
        }
      })
  }

  initParams = (type) => {
    const parmas = {}
    // 不合适
    if (type === 2) {
      parmas.mark_not_fit = 1
    } else if (type === 1) {
      // 通过初筛
      parmas.pass_primary_filter = 1
    } else if (type === 3) {
      // 恢复初筛
      parmas.recover_pass_filter = 1
    } else if (type === 4) {
      // 查看简历
      parmas.viewed = 1
    }
    return parmas
  }

  /** 简历处理* */
  handleResume = (ptype, value, type) => {
    const { ejid, id, has_direct_oppo = false } = value
    const isSelectRadio = this.checkIsSelectRadio()
    if (isSelectRadio || value.type) {
      return
    }
    // 点击事件
    if (!type) {
      const key = R.propOr('', 'event', TRACKEVENTNAMEMAP[ptype])
      if (key) {
        const param = [
          {
            ejid,
            u2: id,
            eventType: `${key}click`,
          },
        ]
        if (ptype === 5) {
          param.has_direct_oppo = has_direct_oppo
        }
        this.trackEvent(`jobs_pc_resume_handle`, {
          param,
        })
      }
    }

    if (ptype === 5) {
      this.directChat()
      return
    }

    const query = {
      ejid,
      uid2: id,
      ...this.initParams(ptype),
    }

    this.props
      .dispatch({
        type: 'resumes/multiProcess',
        payload: query,
      })
      .then((res) => {
        if (res.result === 'ok') {
          const key = R.propOr('', 'event', TRACKEVENTNAMEMAP[ptype])
          const label = R.propOr('', 'label', TRACKEVENTNAMEMAP[ptype])
          const param = [
            {
              ejid,
              u2: id,
              eventType: `${key}success`,
            },
          ]
          if (key && label) {
            message.success(`已标记为“${label}”`)
            this.trackEvent(`jobs_pc_resume_handle`, {
              param,
            })
          }
          const newValue = value
          if (ptype === 2) {
            newValue.rstatus = 3
          } else if (ptype === 1 || ptype === 3) {
            newValue.rstatus = 2
          }
          this.setPostMessage()
          this.setState({ data: newValue })
        }
      })
  }

  handleGoJobDetail = (value) => {
    // 查看投递职位打点
    const { uid, ejid, job_position } = value
    this.trackEvent('jobs_pc_talent_view_delivery_position', {
      ejid,
      u2: uid,
      position: job_position,
      from: 'resume_handle',
    })
    const { data } = this.state
    window.open(`https://maimai.cn/job_detail?ejid=${data.ejid}`)
  }

  checkIsSelectRadio = () => {
    const { resumeData } = this.props
    let type = false
    resumeData.map((v) => {
      if (v.type) {
        type = true
      }
      return v
    })
    return type
  }

  imgOnerrοr = () => {
    this.setState({ imgErr: true })
  }
  // render table
  renderMain = (value) => {
    const {
      province = '',
      gender_str = '',
      work_year = 0,
      target_salary = '',
      degree_str = '',
      company = '',
      position = '',
      edu = {},
      position_job = '',
      has_attach = false,
      rstatus = 0,
      has_direct_oppo = false,
      can_withdraw = 1,
      send_time = '',
      has_oppo_all_time = false,
    } = value || {}

    const { school = '', department = '' } = edu
    const { imgErr, query } = this.state
    const { rtype } = query
    let { text = '' } = ResumeCard.tagConfig[rstatus] || {}
    if (!text) {
      if (has_oppo_all_time) {
        text = '已沟通'
      } else {
        text = '未沟通'
      }
    }
    const isSelectRadio = this.checkIsSelectRadio()
    return (
      <div className={styles.main}>
        <div className={styles.resumeInfo}>
          <div
            onClick={() => {
              if (rtype !== 3) {
                this.handleChangeRadio(value)
              }
            }}
          >
            {rtype === 3 ? null : (
              <div>
                <img
                  className={styles.radio}
                  alt="empty"
                  src={
                    value.type
                      ? 'https://i9.taou.com/maimai/p/20614/6933_103_22Bmk5aXa7iHKjPl'
                      : 'https://i9.taou.com/maimai/p/20614/6750_103_91bJLtIbPdQ097Fp'
                  }
                />
              </div>
            )}
          </div>

          <PreviewButton
            data={value}
            trackParam={{ from: 'resume_handle', ...this.props.trackParam }}
            iconType="preview"
          >
            {!imgErr ? (
              <img
                className={styles.headPortrait}
                alt="emptyImage"
                onError={this.imgOnerrοr}
                src={value.avatar}
              />
            ) : (
              <div className={styles.errorImg} />
            )}
          </PreviewButton>
          <div className={styles.resumeCardInfo}>
            <div className={styles.line1}>
              <PreviewButton
                trackParam={this.props.trackParam}
                data={value}
                iconType="preview"
              >
                <span className={styles.line1Name}>{value.name}</span>
              </PreviewButton>
              {value.judge === 1 && (
                <img
                  className={styles.v_judged}
                  alt="empty"
                  src="https://i9.taou.com/maimai/p/17522/6821_103_D1AJuOo7Uiqwzr"
                />
              )}
              <p
                className={styles.company}
                style={{ maxWidth: '100%', height: '30px', top: 0 }}
              >
                {province} {gender_str && province && '/'} {gender_str}{' '}
                {work_year > 0 && `/  ${work_year}年`} {degree_str && '/'}{' '}
                {degree_str} {target_salary && '/'} {target_salary}
              </p>
            </div>
            <p className={styles.line2}>
              <span>现任</span>
              {company && (
                <span className={styles.company} style={{ maxWidth: '40%' }}>
                  {company}
                </span>
              )}
              {position && (
                <span className={styles.company} style={{ maxWidth: '40%' }}>
                  ·{position}
                </span>
              )}
              {!company && !position && '-'}
            </p>
            <p className={styles.line3}>
              <span>学历</span>
              {school ? (
                <span className={styles.company} style={{ maxWidth: '80%' }}>
                  {school}
                  {school && department && '·'}
                  {department}
                </span>
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>
        <div className={styles.position}>
          <div
            className={styles.jobPosition}
            onClick={() => this.handleGoJobDetail(value)}
          >
            <p
              className={styles.line1Name}
              style={{ maxWidth: 200, fontWeight: 400 }}
            >
              {position_job}
            </p>
          </div>
          <div>{send_time}</div>
        </div>
        <div className={styles.position}>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.showDrawer()
            }}
          >
            <p>查看在线简历{has_attach && '(含附件)'}</p>
          </div>
          <div>{text}</div>
        </div>
        {rstatus === 3 ? (
          <div className={styles.handle}>
            <div
              onClick={() => {
                this.handleResume(3, value)
              }}
            >
              恢复初筛
            </div>
          </div>
        ) : (
          <div className={styles.handle}>
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume(2, value)
              }}
            >
              不合适
            </div>
            {rstatus !== 2 && (
              <div
                className={rstatus === 2 || isSelectRadio ? styles.display : ''}
                onClick={() => {
                  if (rstatus === 2) {
                    return
                  }
                  this.handleResume(1, value)
                }}
              >
                {rstatus === 2 ? '已通过' : '通过初筛'}
              </div>
            )}
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume(5, value)
              }}
            >
              立即沟通
            </div>
          </div>
        )}
      </div>
    )
  }

  showDrawer = () => {
    this.trackEvent(`jobs_pc_resume_handle`, {
      eventType: 'viewOnlineResume',
    })

    this.setState({
      visibleDrawer: true,
    })
  }

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    })
  }

  setPostMessage = () => {
    const resumeUrl = this.initResumeUrl()
    if (resumeUrl) {
      if (window.frames[0]) {
        window.frames[0].postMessage({}, resumeUrl)
      }
    }
  }

  render() {
    const { data, visible, withdrawVisible } = this.state
    const groupButton = (
      <GroupButton
        key="editGroupButton"
        talents={[data]}
        onOk={() => {
          this.setPostMessage()
        }}
        {...this.props}
        style={{ display: 'flex' }}
        className="like-link-button font-size-12 margin-left-16"
        onRef={(ref) => {
          this.child = ref
        }}
      >
        <span></span>
      </GroupButton>
    )

    return (
      <div>
        {groupButton}
        {this.renderMain(data)}
        <div>
          {this.state.visibleDrawer && (
            <div>
              <Drawer
                style={{ background: 'none' }}
                width={750}
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={true}
              >
                {this.renderDrawer()}
              </Drawer>
            </div>
          )}
        </div>

        <Modal
          visible={visible}
          onOk={this.handleHideModal}
          onCancel={this.handleHideModal}
          footer={[
            <Button key="back" onClick={this.handleHideModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <p style={{ padding: '30px 0 0 0' }}>确定将简历标为不合适吗？</p>
          <Checkbox onChange={this.handleChangeCheckbox}>不再提醒</Checkbox>
        </Modal>
        <Modal
          visible={withdrawVisible}
          onOk={this.handleHideRadioModal}
          onCancel={this.handleHideRadioModal}
          footer={[
            <Button key="back" onClick={this.handleHideRadioModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleRadioOk}>
              确定
            </Button>,
          ]}
        >
          <p>确定将不合适撤回吗？</p>
          <p>每个简历只有一次被撤回的机会</p>
        </Modal>
      </div>
    )
  }
}
