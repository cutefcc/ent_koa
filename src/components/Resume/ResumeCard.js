/* eslint-disable max-lines */
import React from 'react'
import { connect } from 'react-redux'
import { redirectToIm } from 'utils'
import { Drawer } from 'mm-ent-ui'
import * as R from 'ramda'
import { Button, message, Modal, Checkbox, Radio } from 'antd'
import { WITHDRAWMAP, TRACKEVENTNAMEMAP } from 'constants/resume'

import styles from './Table.less'

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
      redioType: '',
      data: this.props.value,
      index: this.props.index,
      rtypeStr: this.props.value.rtype_str,
      imgErr: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.value })
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

  handleRadioOnChange = (e) => {
    const { actionValue } = this.state
    const val = e.target.value
    // 回撤状态选择打点
    const { uid, ejid } = actionValue
    this.trackEvent('jobs_pc_talent_withdraw_resume_status', {
      ejid,
      u2: uid,
      value: +val,
      label: WITHDRAWMAP[val],
    })
    this.setState({
      redioType: val,
    })
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
    const { redioType, actionValue } = this.state
    if (!redioType) {
      message.error('请选择撤回选项')
      return
    }
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
    this.handleResume(redioType, actionValue, 'withdraw')
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

  // 查看简历详情
  handleOpenResumePopup = (value) => {
    // 查看在线简历打点
    const { uid, ejid, webuid } = value
    this.trackEvent('jobs_pc_talent_view_online_resume', {
      ejid,
      u2: uid,
    })
    const { rtypeStr } = this.state
    if (rtypeStr === '未读') {
      this.setState({ rtypeStr: '未处理' })
    }
    const url = `https://maimai.cn/resume_detail?webuid=${webuid}&ejid=${ejid}&fr=webResume`
    Drawer.show({
      dom: (
        <div className={styles.popupMain}>
          <iframe seamless title="简历详情" src={url} />
        </div>
      ),
    })
  }

  /** 简历处理* */
  handleResume = (ptype, value, type) => {
    const { showPopup } = this.state
    const { ejid, uid, webuid } = value
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
            u2: uid,
          },
        ]
        this.trackEvent(`${key}click`, {
          param,
        })
      }
    }

    if (ptype === 'im') {
      redirectToIm(webuid)
      return
    }
    if (ptype === 2 && type !== 'inappropriate' && showPopup) {
      this.setState({ actionValue: value, visible: true })
      return
    }
    const query = {
      ejid,
      uid2: uid,
      ptype,
    }
    if (type === 'withdraw') {
      query.withdraw = true
    }
    this.props
      .dispatch({
        type: 'resumes/handleResume',
        payload: query,
      })
      .then((res) => {
        if (res.result === 'ok') {
          const param = [
            {
              ejid,
              u2: uid,
            },
          ]
          const key = R.propOr('', 'event', TRACKEVENTNAMEMAP[ptype])
          const label = R.propOr('', 'label', TRACKEVENTNAMEMAP[ptype])
          if (key && label) {
            message.success(`已标记为“${label}”`)
            this.trackEvent(`${key}success`, {
              param,
            })
          } else if (type === 'withdraw') {
            this.trackEvent('jobs_pc_talent_withdraw_resume_success', {
              param,
            })
          }
          this.props.clickCallback()
        }
      })
  }

  // 撤回简历处理
  handleWithdrawResume = (value) => {
    if (value.can_withdraw === 1) {
      // 撤回简历点击打点
      const { ejid, uid } = value
      const param = [
        {
          ejid,
          u2: uid,
        },
      ]
      this.trackEvent('jobs_pc_talent_withdraw_resume_click', {
        param,
      })
      this.setState({ withdrawVisible: true, actionValue: value })
    } else {
      message.error('只能撤回一次')
    }
  }
  handleGoProfile = () => {
    const { data } = this.state
    // 查看候选人profile打点
    this.trackEvent('jobs_pc_talent_profile_click', {
      u2: data.uid,
    })
    window.open(`https://maimai.cn/contact/detail/${data.uid}`)
  }

  handleGoJobDetail = (value) => {
    // 查看投递职位打点
    const { uid, ejid, job_position } = value
    this.trackEvent('jobs_pc_talent_view_delivery_position', {
      ejid,
      u2: uid,
      position: job_position,
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
    const { rtypeStr, imgErr } = this.state
    const isSelectRadio = this.checkIsSelectRadio()
    return (
      <div className={styles.main}>
        <div className={styles.resumeInfo}>
          {value.tp !== 2 && (
            <div
              onClick={() => {
                this.handleChangeRadio(value)
              }}
            >
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
          <div onClick={this.handleGoProfile}>
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
          </div>
          <div className={styles.resumeCardInfo}>
            <div className={styles.line1}>
              <span className={styles.line1Name} onClick={this.handleGoProfile}>
                {value.name}
              </span>
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
                {value.location} {value.gender_str && value.location && '/'}{' '}
                {value.gender_str} {value.work_year_str && '/'}{' '}
                {value.work_year_str} {value.degree_str && '/'}{' '}
                {value.degree_str} {value.salary_name && '/'}{' '}
                {value.salary_name}
              </p>
            </div>
            <p className={styles.line2}>
              <span>现任</span>
              {value.company && (
                <span className={styles.company} style={{ maxWidth: '40%' }}>
                  {value.company}
                </span>
              )}
              {value.position && (
                <span className={styles.company} style={{ maxWidth: '40%' }}>
                  ·{value.position}
                </span>
              )}
              {!value.company && !value.position && '-'}
            </p>
            <p className={styles.line3}>
              <span>学历</span>
              {value.education ? (
                <span className={styles.company} style={{ maxWidth: '80%' }}>
                  {value.education.school}·{value.education.department}
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
            <p>{value.job_position}</p>
          </div>
          <div>{value.resume_time}</div>
        </div>
        <div className={styles.position}>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.handleOpenResumePopup(value)
            }}
          >
            <p>查看在线简历{value.has_attach === 2 && '(含附件)'}</p>
          </div>
          <div>{rtypeStr}</div>
        </div>
        <div className={styles.handle}>
          {(value.tp === 0 || value.tp === 1 || value.tp === 3) && (
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume(2, value)
              }}
            >
              不合适
            </div>
          )}

          {(value.tp === 1 || value.tp === 3) && (
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume('im', value)
              }}
            >
              聊一聊
            </div>
          )}

          {value.tp === 0 && (
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume(9, value)
              }}
            >
              储备人才
            </div>
          )}

          {(value.tp === 0 || value.tp === 3) && (
            <div
              className={isSelectRadio ? styles.display : ''}
              onClick={() => {
                this.handleResume(1, value)
              }}
            >
              待沟通
            </div>
          )}
        </div>
        {value.tp === 2 && (
          <div className={styles.handle}>
            <div
              onClick={() => {
                this.handleWithdrawResume(value)
              }}
              style={{
                color: value.can_withdraw === 0 ? '#A1A7B3' : '',
                cursor: value.can_withdraw === 0 ? 'auto' : '',
              }}
            >
              撤回
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { data, visible, withdrawVisible } = this.state
    return (
      <div>
        {this.renderMain(data)}
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
          <p style={{ padding: '30px 0 0 0' }}>确定将该候选人标为不合适?</p>
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
          <p style={{ padding: '30px 0 0 0' }}>请选择撤回到的状态</p>
          <p>只有一次撤回机会</p>
          <Radio.Group onChange={this.handleRadioOnChange}>
            <Radio value={1}>待沟通</Radio>
            <Radio value={9}>储备人才</Radio>
          </Radio.Group>
        </Modal>
      </div>
    )
  }
}
