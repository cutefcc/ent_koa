import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tooltip, Modal } from 'antd'
import { InfoCircleFilled, QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Popover,
  Icon,
  Message,
  Checkbox,
  MUIModal,
  MUIButton,
  MUIAvatar,
  Tooltip as MUITooltip,
} from 'mm-ent-ui'
import * as R from 'ramda'
import styles from './index.less'

@connect((state) => ({
  loading: state.loading.effects['rights/aiCall'],
  currentUser: state.global.currentUser,
  advancedSearch: state.talentDiscover.advancedSearch,
  currCondition: state.subscribe.currCondition,
  urlPrefix: state.global.urlPrefix,
}))
export default class AiCallButton extends React.Component {
  static defaultProps = {
    onFinish: () => {},
  }

  buttonType = ''

  hadShowGrey = false

  state = {
    prompt: false,
    showLandline: false, // 是否显示hover 手机拨打 or 座机拨打
    showModal: false, // modal show
    areaCode: '', // 区号
    landlineCode: '', // 座机号码
    areaCodeFill: true, // 区号是否符合要求
    landlineCodeFill: true, // 座机号码是否符合要求
    isLandlineBind: true, // 是否绑定了座机
    landLineInfo: {}, // 获取座机号码的相关信息
    phoneProtection: false, // 是否开启号码保护
    madifyLandline: false, // 是否处于修改状态
    virPhoneValid: true, // 虚拟号码是否有效
    virPhoneLoading: false, // 获取座机号码的相关信息 是否 loading 中
    telephoneNo: '', // 绑定的座机号码
    isFirstLandline: false, // 是否第一次使用座机拨打功能
  }

  getModalConfig = () => {
    return {
      icon: <InfoCircleFilled style={{ color: '#FFA408', marginRight: 12 }} />,
      title: (
        <div className={styles.modalTitle} style={{ marginBottom: 30 }}>
          电话沟通券，当前剩余： <span className={styles.orange}>0</span>
        </div>
      ),
      content: (
        <div>
          <span className={styles.modalTips}>请联系管理员分配</span>
        </div>
      ),
      okText: '我知道了',
    }
  }

  getButtonConfig = () => {
    const {
      data: {
        call_state: callState = 3,
        call_state_new,
        call_tip,
        call_tip_new,
      },
    } = this.props
    const {
      currentUser: { reach },
    } = this.props
    const callTip = reach && reach.reach_type === 3 ? call_tip_new : call_tip

    const callStateMap = {
      1: {
        text: '请求中',
        disabled: true,
        toolTip: callTip,
      },
      2: {
        text: '拨打电话',
        disabled: false,
        onClick: () => {
          this.handleSendTipForConnectByTelphone()
        },
        type: 'dial',
      },
      3: {
        text: '索要电话', // 电话沟通
        disabled: false,
        onClick: this.handleSendAiCall,
        // reconfirmation is nessary when this call_tip is not empty
        ...(callTip ? { popConfirm: this.renderPopContent(callTip) } : {}),
      },
      4: {
        text: '索要电话', // 电话沟通
        disabled: true,
        toolTip: callTip,
      },
    }

    if (reach && reach.reach_type === 3 && call_state_new !== undefined) {
      this.appendReachType(callStateMap, reach.reach_nbr)
      return callStateMap[call_state_new]
    }

    return callStateMap[callState]
  }

  appendReachType(stateMap, reachNbr) {
    // since reach_type = 3, the type of AiCallButton will be primary
    this.buttonType = 'primary'
    const {
      data: { call_state_new, call_tip_new, verify_status },
    } = this.props
    const basicConfig = {
      text: '电话沟通',
      disabled: false,
      popConfirmConfig: {
        overlayClassName: styles.popConfirm,
        placement: 'top',
        icon: <InfoCircleFilled style={{ color: '#3B7AFF' }} />,
      },
    }
    const NotVerifiedEle = (
      <div className={styles.popConfirmTitle}>
        该用户未进行实名认证，建议仔细判断，谨防虚假信息。请确定是否进行电话沟通？
      </div>
    )

    stateMap[3] = stateMap[4] = stateMap[5] = stateMap[6] = basicConfig
    if (call_state_new === 4) {
      stateMap[call_state_new].text = '电话沟通'
      stateMap[call_state_new].disabled = true
      stateMap[call_state_new].toolTip = call_tip_new
    } else if (call_state_new === 1 && stateMap[call_state_new]) {
      stateMap[call_state_new].text = '索要中'
    }

    if (reachNbr === 0 && call_state_new !== 4 && call_state_new !== 2) {
      const config = this.getModalConfig()

      stateMap[call_state_new].onClick = () => Modal.info(config)
    } else {
      if (call_state_new === 3) {
        const title =
          verify_status && verify_status.identification_status === 3 ? (
            <div className={styles.popConfirmTitle}>
              对方未投递你的岗位，需要索要电话号码，索要成功即可拨打电话
            </div>
          ) : (
            NotVerifiedEle
          )

        stateMap[call_state_new].popConfirm = () => {
          return (
            <div style={{ width: '300px' }}>
              {title}
              <span className={styles.popConfirmTips}>
                本次将消耗1个电话沟通券
              </span>
            </div>
          )
        }
        stateMap[call_state_new].popConfirmClick = this.handleSendAiCall
      } else if (call_state_new === 5) {
        const title =
          reachNbr > 0 &&
          verify_status &&
          verify_status.identification_status !== 3
            ? NotVerifiedEle
            : null

        if (localStorage.getItem('no_prompt_for_reach_call') !== '1') {
          stateMap[
            call_state_new
          ].popConfirmClick = this.handleSendTipForConnectByTelphone
          stateMap[call_state_new].popConfirm = () => {
            return (
              <div style={{ width: '300px' }}>
                {title}
                <div className={styles.popConfirmTitle}>
                  本次将消耗1个电话沟通券
                </div>
                <Checkbox
                  style={{ marginLeft: '8px' }}
                  checked={this.state.prompt}
                  onChange={this.onCheckBoxChange.bind(this)}
                >
                  下次不再提示
                </Checkbox>
              </div>
            )
          }
        } else {
          stateMap[
            call_state_new
          ].onClick = this.handleSendTipForConnectByTelphone
        }
      } else if (call_state_new === 6) {
        stateMap[call_state_new].popConfirm = () => (
          <div style={{ width: '300px' }}>
            <div className={styles.popConfirmTitle}>
              对方半年不看机会，需索要电话号码，通过率很低，请确定是否索要？
            </div>
            <span className={styles.popConfirmTips}>
              本次将消耗1个电话沟通券
            </span>
          </div>
        )
        stateMap[call_state_new].popConfirmClick = this.handleSendAiCall
      }
    }
  }

  onCheckBoxChange = (e) => {
    this.setState({
      prompt: e.target.checked,
    })
  }

  static propsTypes = {
    data: PropTypes.object.isRequired,
    onFinish: PropTypes.func,
  }

  handleSendAiCall = () => {
    const { data, advancedSearch, currCondition } = this.props
    this.trackClickEvent('jobs_pcv2_askfor_phone_confirm', {
      u2: data.id,
      // fr: R.pathOr('', ['props', 'fr'], this),
      search: advancedSearch,
      subscribe_id: currCondition.id,
    })
    this.props
      .dispatch({
        type: 'rights/askForPhoneV2',
        payload: {
          to_uid: data.id,
          fr: R.pathOr('', ['props', 'fr'], this),
        },
      })
      .then(({ data: res = {} }) => {
        if (res.tips) {
          Message.success(res.tips)
        }
        // 重新获取电话沟通劵
        this.refreshCurrentUser()
        window.broadcast.send('askForPhoneSuccess', data.id)
        if (this.props.onFinish) {
          this.props.onFinish(data)
        }
      })
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  popoverClick = () => {
    const { data, advancedSearch, currCondition } = this.props
    this.trackClickEvent('jobs_pcv2_askfor_phone_click', {
      u2: data.id,
      search: advancedSearch,
      subscribe_id: currCondition.id,
    })
  }

  handleSendTipForConnectByTelphone = () => {
    const { data = {}, advancedSearch, currCondition } = this.props
    // app client will receive a push message about this reach_id, so the reach_id is necessary
    if (!data.reach_id) {
      return
    }

    // add a pingback named jobs_pcv2_askfor_phone_confirm
    // add a property type = 'makephonecall' in params for making this event different from the normal one
    this.trackClickEvent('jobs_pcv2_askfor_phone_confirm', {
      u2: data.id,
      // fr: R.pathOr('', ['props', 'fr'], this),
      search: advancedSearch,
      subscribe_id: currCondition.id,
      type: 'makephonecall',
    })

    if (this.state.prompt) {
      localStorage.setItem('no_prompt_for_reach_call', '1')
    }

    this.props
      .dispatch({
        type: 'rights/sendTipForConnectByTelphone',
        payload: {
          reach_id: data.reach_id,
          to_uid: data.id,
          fr: R.pathOr('', ['props', 'fr'], this),
        },
      })
      .then(({ data: res = {} }) => {
        if (res.tips) {
          Message.success(res.tips)
        }
        window.broadcast.send('connectForPhoneSuccess', data.id)
        if (this.props.onFinishWithConnect) {
          this.props.onFinishWithConnect(data)
        }
      })
  }

  trackClickEvent = (eventName, param) => {
    if (window.voyager) {
      const params = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        ...param,
      }
      window.voyager.trackEvent(eventName, eventName, params)
    }
  }

  renderPopContent = (tip) => {
    return (
      <div>
        <span className="flex flex-justify-center font-size-16">{tip}</span>
        {/* <span className="color-dilution width-p100 text-center margin-top-8 display-inline-block">
        </span> */}
      </div>
    )
  }

  buttonDisableTrack = () => {
    // 防止按钮多次渲染，重复打点
    if (this.hadShowGrey) return
    this.hadShowGrey = true

    const { data = {}, advancedSearch, currCondition } = this.props
    this.trackClickEvent('jobs_pcv2_askfor_phone_disable', {
      u2: data.id,
      // fr: R.pathOr('', ['props', 'fr'], this),
      search: advancedSearch,
      subscribe_id: currCondition.id,
    })
  }

  handleBtnMouseOver = () => {
    const notFirst =
      window.localStorage.getItem(`isFirstLandline-${window.uid}`) === '1'
    this.setState({
      showLandline: true,
      isFirstLandline: !notFirst,
    })
  }

  handleBtnMouseLeave = () => {
    this.setState({
      showLandline: false,
    })
  }

  handleAreaInputChange = (e) => {
    if (/^[0]\d{0,4}$/.test(e.target.value)) {
      const isValid = /^[0][1-9]\d{1,3}$/.test(e.target.value)
      this.setState({
        areaCode: e.target.value,
        areaCodeFill: isValid,
      })
    }
  }

  handleAreaInputBlur = () => {
    this.setState({
      areaCodeFill: /^[0][1-9]\d{1,3}$/.test(this.state.areaCode),
    })
  }

  handleLandlineInputBlur = (e) => {
    this.setState({
      landlineCodeFill: /^\d{7,8}$/.test(e.target.value),
    })
  }

  handleLandlineChange = (e) => {
    if (/^\d{0,8}$/.test(e.target.value)) {
      this.setState({
        landlineCode: e.target.value,
        landlineCodeFill: /^\d{7,8}$/.test(e.target.value),
      })
    }
  }

  handleBindLandline = () => {
    if (
      /^[0][1-9]\d{1,3}$/.test(this.state.areaCode) &&
      /^\d{7,8}$/.test(this.state.landlineCode)
    ) {
      this.props
        .dispatch({
          type: 'talentDiscover/fetchVirPhoneTelBind',
          payload: {
            uid: window.uid,
            telephone_no: `${this.state.areaCode}-${this.state.landlineCode}`,
          },
        })
        .then(({ code }) => {
          if (code === 0) {
            this.handleLandlineClick()
            this.setState({ isLandlineBind: true })
          }
        })
    } else {
      Message.warning('请填写完整信息')
    }
  }

  handleVirtualTelValidation = () => {
    const { data, dispatch } = this.props
    const {
      landLineInfo,
      landLineInfo: { secret_no },
    } = this.state
    dispatch({
      type: 'talentDiscover/fetchVirtualTelValidation',
      payload: {
        to_uid: data.id,
        uid: window.uid,
        secret_no,
      },
    }).then(({ code, data: res }) => {
      if (code === 0) {
        this.setState({
          landLineInfo: { ...landLineInfo, ttl: res.ttl },
          virPhoneValid: res.ttl > 0,
        })
        // 如果号码过期了，就不要去轮询了
        if (res.ttl <= 0 && this.virVirtualTelValidation) {
          clearInterval(this.virVirtualTelValidation)
        }
      }
    })
  }

  handleLandlineClick = () => {
    const { data, dispatch } = this.props
    dispatch({
      type: 'rights/sendTipForConnectByTelphone',
      payload: {
        reach_id: data.reach_id,
        to_uid: data.id,
        fr: R.pathOr('', ['props', 'fr'], this),
        call_source: 2,
      },
    }).then(({ code, data: { reach_id } }) => {
      if (code === 0) {
        this.handLandlineClick(reach_id)
      }
    })
  }

  handLandlineClick = (reach_id) => {
    window.localStorage.setItem(`isFirstLandline-${window.uid}`, 1)
    const { data, dispatch } = this.props
    const { phoneProtection } = this.state
    dispatch({
      type: 'talentDiscover/fetchTelBindCheck',
      payload: {
        to_uid: data.id,
        uid: window.uid,
      },
    }).then((res) => {
      const { code, is_bound } = res
      if (code === 0) {
        const isBound = is_bound === 1
        if (isBound) {
          this.handleFetchGetVirtualTel(phoneProtection ? 1 : 3, reach_id)
          this.handleFetchLandline()
          this.handleCheckValidation()
        }
        this.setState({ showModal: true, isLandlineBind: isBound })
      }
    })
  }

  handleCheckValidation = () => {
    if (this.virVirtualTelValidation) {
      clearInterval(this.virVirtualTelValidation)
    }

    this.virVirtualTelValidation = setInterval(() => {
      this.handleVirtualTelValidation()
    }, 10000)
  }

  handleFetchLandline = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'talentDiscover/fetchVirtualGetLandline',
      payload: {
        uid: window.uid,
      },
    }).then(({ code, telephone_no }) => {
      if (code === 0) {
        this.setState({
          telephoneNo: telephone_no,
        })
      }
    })
  }

  handleFetchGetVirtualTel = (call_display_type = 3, reach_id) => {
    const { dispatch, data } = this.props
    this.setState({
      virPhoneLoading: true,
    })
    dispatch({
      type: 'talentDiscover/fetchGetVirtualTel',
      payload: {
        uid: window.uid,
        call_display_type,
        call_source: 2,
        reach_id: reach_id || data.reach_id,
      },
    }).then(({ code, data: landLineInfo }) => {
      if (code === 0) {
        this.setState({ landLineInfo, virPhoneValid: landLineInfo.ttl > 0 })
        // 如果号码过期了，就不要去轮询了
        if (landLineInfo.ttl <= 0 && this.virVirtualTelValidation) {
          clearInterval(this.virVirtualTelValidation)
        }
      }
      this.setState({
        virPhoneLoading: false,
      })
    })
  }

  renderButton = () => {
    const buttonConfig = this.getButtonConfig()
    const identity = R.pathOr(0, ['props', 'currentUser', 'identity'], this)
    const type = R.pathOr(undefined, ['type'], buttonConfig)
    const { showLandline } = this.state

    if (buttonConfig.disabled) {
      this.buttonDisableTrack()
    }
    /**
     * because the onClick event is forbidden when the button is disabled
     * in fact, this button should trigger click event (for the tip to notice user the cause of disabled)， even if the button is disabled
     * so, we use style represent disabled status instead of real disabled
     * since 'ask for telephone' is replace with 'making a call', so primary-2 will be replaced with primary except top bar in profile
     */
    const button = (
      <Button
        type={
          buttonConfig.disabled ? 'disabled' : this.props.type || 'primary-2'
        }
        className={this.props.className || ''}
        style={this.props.style}
        onClick={buttonConfig.popConfirm ? null : buttonConfig.onClick}
      >
        {this.props.content || (
          <Fragment>
            <Icon
              type="icon_call"
              className="margin-right-8"
              style={{
                transform: 'matrix(1, 0, 0, 1, 1, 2)',
              }}
            />
            {buttonConfig.text}
          </Fragment>
        )}
      </Button>
    )
    if (identity === 6 && type === 'dial') {
      return (
        <div
          className={styles.landlineCon}
          onMouseOver={this.handleBtnMouseOver}
          onMouseLeave={this.handleBtnMouseLeave}
        >
          {button}
          {showLandline && (
            <div className={styles.landline}>
              <div className={styles.topBlank}></div>
              <div className={styles.bottomContent}>
                <div
                  className={styles.bottomContentPhone}
                  onClick={buttonConfig.onClick}
                >
                  <img
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '2px',
                    }}
                    src={`${this.props.urlPrefix}/images/call_mobile.png`}
                  />
                  手机拨打
                </div>
                <div
                  className={styles.bottomContentLandline}
                  onClick={this.handleLandlineClick}
                >
                  <img
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '2px',
                      position: 'relative',
                      top: '8px',
                    }}
                    src={`${this.props.urlPrefix}/images/call_landline.png`}
                  />
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: this.state.isFirstLandline
                        ? '#FF4D3C'
                        : '#fff',
                      position: 'relative',
                      top: '6px',
                      left: '-8px',
                    }}
                  />
                  <span style={{ position: 'relative', left: '-8px' }}>
                    座机拨打
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    } else if (buttonConfig.toolTip) {
      return (
        <Tooltip
          placement="top"
          title={buttonConfig.toolTip}
          trigger="hover"
          getPopupContainer={() => this.props.wrapperDom || document.body}
        >
          <span>{button}</span>
        </Tooltip>
      )
    } else if (buttonConfig.popConfirm) {
      return (
        <Popover.Confirm
          {...buttonConfig.popConfirmConfig}
          trigger="click"
          onConfirm={buttonConfig.popConfirmClick || buttonConfig.onClick}
          onClick={this.popoverClick}
          title={buttonConfig.popConfirm}
          placement="topRight"
          getPopupContainer={() => this.props.wrapperDom || document.body}
        >
          {button}
        </Popover.Confirm>
      )
    }

    return button
  }

  renderFirstBandContent = () => {
    const {
      areaCode,
      landlineCode,
      areaCodeFill,
      landlineCodeFill,
    } = this.state
    return (
      <div style={{ padding: '0 32px 0 56px' }}>
        <p style={{ fontSize: '20px', color: '#15161F' }}>
          初次使用，请绑定您的座机号码
        </p>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '56px', marginRight: '8px' }}>
            <input
              onChange={this.handleAreaInputChange}
              onBlur={this.handleAreaInputBlur}
              value={areaCode}
              placeholder="区号"
              className={styles.areaInput}
              style={{
                border: areaCodeFill
                  ? '1px solid #D1D3DE'
                  : '1px solid #FF4D3C',
              }}
            />
          </div>
          <div style={{ width: '384px' }}>
            <input
              onChange={this.handleLandlineChange}
              onBlur={this.handleLandlineInputBlur}
              value={landlineCode}
              placeholder="座机号码"
              className={styles.landLineInput}
              style={{
                border: landlineCodeFill
                  ? '1px solid #D1D3DE'
                  : '1px solid #FF4D3C',
                width: '384px',
              }}
            />
          </div>
        </div>
        {(!areaCodeFill || !landlineCodeFill) && (
          <div
            style={{
              fontSize: '12px',
              color: '#FF4D3C',
              height: '18px',
              marginTop: '6px',
            }}
          >
            号码格式错误，请检查重新输入
          </div>
        )}
        <div
          className={styles.bindLandline}
          style={{
            marginTop: !areaCodeFill || !landlineCodeFill ? '6px' : '30px',
            marginBottom: '56px',
          }}
        >
          <div className={styles.left}>
            绑定后将出现候选人的虚拟号码，后续可变更号码
          </div>
          <div className={styles.rightBtn}>
            <MUIButton
              type="mbutton_m_fixed_blue450_l1"
              onClick={this.handleBindLandline}
            >
              立即绑定
            </MUIButton>
          </div>
        </div>
      </div>
    )
  }

  renderAlreadyBandContent = () => {
    const {
      landLineInfo: { avatar = '', name = '', secret_no = 0, ttl = 0 },
      telephoneNo: telephone_no,
      phoneProtection,
      areaCode,
      areaCodeFill,
      landlineCode,
      landlineCodeFill,
      virPhoneValid,
      virPhoneLoading,
    } = this.state
    return (
      <div className={styles.alreadyBandContent}>
        <div className={styles.bandContentName}>
          <MUIAvatar shape="circle" size="32px" src={avatar} />
          <div style={{ marginLeft: '8px' }}>{name}</div>
        </div>
        {virPhoneValid && !virPhoneLoading && (
          <div className={styles.bandContentPhone}>{secret_no}</div>
        )}
        {!virPhoneValid && !virPhoneLoading && (
          <div
            className={styles.bandContentPhone}
            style={{ color: '#AFB1BC', textDecoration: 'line-through' }}
          >
            {secret_no}
          </div>
        )}
        {virPhoneLoading && (
          <div className={styles.bandContentPhone} style={{ color: '#AFB1BC' }}>
            ——— ———— ————
          </div>
        )}
        {virPhoneValid && (
          <div className={styles.bandContentTime}>有效时间为{ttl}分钟</div>
        )}
        {!virPhoneValid && !virPhoneLoading && (
          <div
            className={styles.bandContentTime}
            style={{ width: '160px', cursor: 'pointer' }}
          >
            号码已过期，
            <span
              style={{ color: '#3B7AFF' }}
              onClick={this.handleLandlineClick}
            >
              点击重新获取
            </span>
          </div>
        )}
        <div className={styles.bandContentDesc}>
          请在有效时间内，使用您绑定的座机号拨打
        </div>
        <div className={styles.bandContentBottom}>
          <div className={styles.bandContentBottomLeft}>
            {!phoneProtection && (
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '1px solid #D1D3DE',
                  borderRadius: '8px',
                  marginRight: '8px',
                  marginTop: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  this.setState(
                    {
                      phoneProtection: !phoneProtection,
                    },
                    () => {
                      this.handleLandlineClick()
                    }
                  )
                }}
              />
            )}
            {phoneProtection && (
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  border: '4px solid #3B7AFF',
                  borderRadius: '8px',
                  marginRight: '8px',
                  marginTop: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  this.setState(
                    {
                      phoneProtection: !phoneProtection,
                    },
                    () => {
                      this.handleLandlineClick()
                    }
                  )
                }}
              />
            )}

            <span
              style={{ marginRight: '5px', color: '#15161F', fontSize: '14px' }}
            >
              号码保护
            </span>
            <MUITooltip
              placement="top"
              title={`${
                phoneProtection ? '已开启' : '开启后'
              }，本次通话将对候选人隐藏您的真实号码`}
            >
              <QuestionCircleOutlined
                style={{ color: '#b1b6c1', marginTop: '8px' }}
              />
            </MUITooltip>
          </div>
          {!this.state.madifyLandline && (
            <div className={styles.bandContentBottomRight}>
              <span
                style={{
                  fontSize: '12px',
                  color: '#AFB1BC',
                  marginRight: '8px',
                }}
              >
                绑定的座机号：
                <span style={{ fontSize: '14px', color: '#6E727A' }}>
                  {telephone_no}
                </span>
              </span>
              <span
                style={{
                  fontSize: '14px',
                  color: '#3B7AFF',
                  cursor: 'pointer',
                  height: '32px',
                  lineHeight: '32px',
                }}
                onClick={() => {
                  this.setState({
                    madifyLandline: !this.state.madifyLandline,
                    areaCode: telephone_no.split('-')[0],
                    landlineCode: telephone_no.split('-')[1],
                    areaCodeFill: true,
                    landlineCodeFill: true,
                  })
                }}
              >
                修改
              </span>
            </div>
          )}
          {this.state.madifyLandline && (
            <div className={styles.bandContentBottomRight}>
              <div>
                <span style={{ width: '56px', marginRight: '8px' }}>
                  <input
                    onChange={this.handleAreaInputChange}
                    onBlur={this.handleAreaInputBlur}
                    value={areaCode}
                    placeholder="区号"
                    className={styles.areaInput}
                    style={{
                      border: areaCodeFill
                        ? '1px solid #D1D3DE'
                        : '1px solid #FF4D3C',
                    }}
                  />
                </span>
                <span style={{ width: '160px' }}>
                  <input
                    onChange={this.handleLandlineChange}
                    onBlur={this.handleLandlineInputBlur}
                    value={landlineCode}
                    placeholder="座机号码"
                    className={styles.landLineInput}
                    style={{
                      border: landlineCodeFill
                        ? '1px solid #D1D3DE'
                        : '1px solid #FF4D3C',
                    }}
                  />
                </span>
                {this.state.madifyLandline &&
                  (!areaCodeFill || !landlineCodeFill) && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#FF4D3C',
                        height: '18px',
                        lineHeight: '18px',
                        marginTop: '6px',
                      }}
                    >
                      号码格式错误，请检查重新输入
                    </div>
                  )}
              </div>
              <span
                style={{
                  fontSize: '14px',
                  color: '#3B7AFF',
                  cursor: 'pointer',
                  height: '32px',
                  lineHeight: '32px',
                  marginLeft: '8px',
                }}
                onClick={() => {
                  if (areaCodeFill && landlineCodeFill) {
                    this.handleBindLandline()
                  } else {
                    this.setState({
                      areaCode: telephone_no.split('-')[0],
                      landlineCode: telephone_no.split('-')[1],
                    })
                  }
                  this.setState({ madifyLandline: false })
                }}
              >
                {areaCodeFill && landlineCodeFill ? '确定' : '取消'}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { isLandlineBind } = this.state
    if (!this.props.currentUser.show_calls) {
      return null
    }

    return (
      <div>
        {this.renderButton()}
        <MUIModal
          key="Modal1"
          maskClosable={false}
          noHeaderBorder
          title={<div />}
          visible={this.state.showModal}
          onOk={() => {
            this.setState({ showModal: false })
          }}
          onCancel={() => {
            if (this.virVirtualTelValidation) {
              clearInterval(this.virVirtualTelValidation)
            }
            this.setState({
              showModal: false,
              areaCode: '',
              landlineCode: '',
              areaCodeFill: true,
              landlineCodeFill: true,
              isLandlineBind: true,
              landLineInfo: {},
              phoneProtection: false,
              madifyLandline: false,
            })
          }}
          width={560}
          footer={null}
        >
          {!isLandlineBind && this.renderFirstBandContent()}
          {isLandlineBind && this.renderAlreadyBandContent()}
        </MUIModal>
      </div>
    )
  }
}
