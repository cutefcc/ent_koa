import React from 'react'
import { Modal, Avatar, Popover, Select } from 'antd'
import { Icon, Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './chattingDirect.less'

class ChattingDirect extends React.Component {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    show: PropTypes.bool,
    initMessage: PropTypes.string.isRequired,
    showPosition: PropTypes.bool,
    allJobs: PropTypes.array,
    mode: PropTypes.string.isRequired,
    jid: PropTypes.number,
  }

  static defaultProps = {
    show: false,
    showPosition: false,
    allJobs: [],
    jid: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      jid: props.jid,
      /* msgTemplates: [
      {
        name: '询问意愿',
        content: `您好。我看了您的个人主页，觉得很赞。公司目前有相关岗位计划，不知道您近期是否考虑？如果您感兴趣，我们可以详细沟通下。期待您的回应。`,
      },
      {
        name: '社交破冰',
        content: `您好。看到您的脉脉的个人主页，对您的经历很感兴趣。请问您是否愿意交个朋友，我们在线交流下或者改天一起喝个咖啡？期待您的回应。`,
      },
    ], */
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.jid !== this.props.jid) {
      this.setState({
        jid: newProps.jid,
      })
    }
  }

  handleJidChange = (jid) => {
    const job = this.props.allJobs.find(R.propEq('jid', jid))
    this.setState({
      jid,
      message: `请问您对我发布的 "${R.propOr(
        '',
        'position',
        job
      )}" 职位感兴趣吗？`,
    })
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value })
  }

  handleSend = (communication) => () => {
    // const {jid} = this.state
    const send = () => {
      this.setState({ message: '', jid: '' })
      this.props.onSend(this.state.message, this.state.jid, communication)
    }
    send()
  }

  handleCancel = (e) => {
    this.setState({ message: '', jid: '' })
    this.props.onCancel(e)
  }

  handleTplClick = (value) => {
    this.setState({ message: value })
  }

  renderSingleMessage = (talent) => {
    const { avatar } = talent
    return (
      <p className={styles.initMessagePanel}>
        <Avatar src={avatar} className={styles.avatar} />
        <span className={styles.initMessage}>
          <span>{this.props.initMessage}</span>
        </span>
      </p>
    )
  }

  renderMultiMessage = (talents) =>
    talents.slice(0, 12).map((item) => (
      <Popover content={item.name} trigger="hover" key={item.name}>
        <Avatar src={item.avatar} className={styles.avatar} key={item.name} />
      </Popover>
    ))

  render() {
    const { talents, mode } = this.props
    const { length } = talents

    const renderOption = (item) => (
      <Select.Option value={item.jid} key={item.jid}>
        {item.position}
      </Select.Option>
    )

    // const calSumPrice = key =>
    //   R.sum(
    //     talents.map(
    //       item =>
    //         Number.isNaN(parseInt(item[key], 10)) ? 0 : parseInt(item[key], 10)
    //     )
    //   )

    // const imSumPrice = calSumPrice('direct_im_price')

    const title = `极速联系（${length}人）`
    const buttons = {
      connect: [
        <Button
          type={this.props.type || 'primary'}
          onClick={this.handleSend('direct_im')}
          disabled={!this.state.message}
          // className={styles.sendButton}
          key="im"
        >
          <Icon type="message" /> 极速联系
        </Button>,
      ],
    }

    /* const msgTemplate = this.state.msgTemplates.map((item, index) => {
      return (
        <Button
          type="primary"
          onClick={() => this.handleTplClick(item.content)}
          key={`tpl${item.name}`}
        >
          {item.name}
        </Button>
      )
    }) */

    return (
      <Modal
        title={title}
        visible={this.props.show}
        onCancel={this.handleCancel}
        footer={buttons[mode]}
      >
        <div>
          {talents.length === 1 && this.renderSingleMessage(talents[0])}
          {talents.length > 1 && this.renderMultiMessage(talents)}
        </div>
        {this.props.showPosition && (
          <div className={styles.positionSelection}>
            <h4 className={styles.itemTitle}>职位:</h4>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="选择邀请的职位"
              optionFilterProp="children"
              onChange={this.handleJidChange}
              value={this.state.jid}
            >
              {this.props.allJobs.map(renderOption)}
            </Select>
          </div>
        )}
        {/* <div className={styles.msgTemplate}>
            {msgTemplate}
        </div> */}
        <p className={styles.messagePanel}>
          <h4 className={styles.itemTitle}>消息：</h4>
          <textarea
            onChange={this.handleMessageChange}
            value={this.state.message}
            className={styles.messageInput}
            placeholder="请输入信息"
          />
        </p>
        {/* this.props.showPosition && (
          <p className={styles.tip}>提示：请选择职位后，填写邀请消息！</p>
        ) */}
      </Modal>
    )
  }
}

export default ChattingDirect
