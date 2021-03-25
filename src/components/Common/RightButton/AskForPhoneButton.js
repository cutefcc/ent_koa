import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import { Popover, Button, message /* , Radio */ } from 'antd'
// import {Modal, Typography} from 'mm-ent-ui'
// import {withRouter} from 'react-router-dom'
import * as R from 'ramda'

@connect((state) => ({
  personalAsset: state.global.personalAsset,
}))
export default class AskForPhone extends React.Component {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    // onOpFinish: PropTypes.func,
    disabled: PropTypes.bool,
    trackParam: PropTypes.object,
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    // onOpFinish: () => {},
    disabled: false,
    trackParam: {},
    className: '',
    content: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      talents: props.talents,
      opFinish: false,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.talents !== this.props.talents) {
      this.setState({
        talents: newProps.talents,
      })
    }
  }

  refreshPersonalAsset = () => {
    return this.props.dispatch({
      type: 'global/fetchPersonalAsset',
      payload: {},
    })
  }

  handleSubmit = () => {
    const expiryTime = moment(new Date('2019/12/09 00:00:00')).unix()
    const currentTime = moment().unix()
    if (currentTime > expiryTime) {
      message.info(
        '体验升级中，我们会在12月12日重新开放升级后的新功能，敬请期待！'
      )
      return
    }

    const onSuccess = () => {
      const { personalAsset } = this.props
      const talentName = R.pathOr('候选人', [0, 'name'], this.state.talents)
      message.success(
        `已向${talentName}的好友发起索要电话请求，今日剩余次数${personalAsset.reach}!`
      )

      this.setState({
        opFinish: true,
      })
    }
    const param = {
      to_uid: R.path([0, 'id'], this.state.talents) || this.state.talents.id,
      frm: R.propOr('ent_pc', 'source', this.props.trackParam),
      message: this.state.message,
    }

    this.props
      .dispatch({
        type: 'rights/askForPhone',
        payload: param,
      })
      .then(this.refreshPersonalAsset)
      .then(onSuccess)
  }

  handleStateChange = (field) => (value) => {
    this.setState({
      [field]: value,
    })
  }

  handleShowConfirm = () => {
    this.handleSubmit()
    // Modal.confirm({
    //   title: '联系的原因',
    //   content: (
    //     <div>
    //       <Typography.Text type="secondary" size="14">
    //         请选择电话沟通的原因，对方更容易接受邀请
    //       </Typography.Text>
    //       <Radio.Group
    //         onChange={this.handleStateChange('message')}
    //         value={this.state.message}
    //         className="margin-top-16"
    //       >
    //         <Radio value={1}>沟通职位</Radio>
    //         <Radio value={2}>商务合作</Radio>
    //         <Radio value={3}>保持联系</Radio>
    //       </Radio.Group>
    //     </div>
    //   ),
    //   onOk: this.handleSubmit,
    //   okText: '完成',
    //   cancelText: '取消',
    //   type: 'stress',
    // })
    if (window.voyager) {
      const talentIds = this.props.talents.map(R.prop('id'))
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: talentIds.join(','),
      }
      const key = 'jobs_pc_talent_askfor_phone'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleSendTipForConnectByTelphone = () => {
    const { talents = {} } = this.state
    const talent = R.propOr(talents, 0, talents)
    if (!talent.reach_id) {
      return
    }
    this.props.dispatch({
      type: 'rights/sendTipForConnectByTelphone',
      payload: {
        reach_id: talent.reach_id,
        to_uid: talent.id,
      },
    })
  }

  messageInfo = (msg) => () => {
    message.info(msg)
  }

  render() {
    // const {personalAsset} = this.props
    const { talents = {}, opFinish } = this.state
    const talent = R.propOr(talents, 0, talents)
    const state = opFinish ? 1 : R.propOr(0, 'reach_process_state', talent)

    const stateMap = {
      0: {
        label: '索要电话',
        onClick: this.handleShowConfirm,
      },
      1: {
        label: '已索要电话',
      },
      2: {
        label: '电话联系',
        onClick: () => {
          this.messageInfo('请前往脉脉手机端拨打电话！')()
          this.handleSendTipForConnectByTelphone()
        },
      },
      3: {
        label: '电话联系',
        onClick: () => {
          this.messageInfo('请前往脉脉手机端拨打电话！')()
          this.handleSendTipForConnectByTelphone()
        },
      },
      '-1': {
        label: '索要电话',
        onClick: this.messageInfo(
          '索要电话失败，今日免费体验次数剩余0，请明天再体验！'
        ),
      },
    }
    // const conf =
    //   personalAsset.reach <= 0 ? stateMap['-1'] : stateMap[state] || stateMap[0]
    const conf = stateMap[state] || stateMap[0]
    const button = (
      <Button
        onClick={this.props.onClick || conf.onClick}
        disabled={this.props.disabled || this.props.loading || !conf.onClick}
        className={this.props.className}
        style={this.props.style}
      >
        {this.props.content || conf.label}
      </Button>
    )

    return this.props.showPop ? (
      <Popover placement="topLeft" content="索要电话" trigger="hover">
        {button}
      </Popover>
    ) : (
      button
    )
  }
}
