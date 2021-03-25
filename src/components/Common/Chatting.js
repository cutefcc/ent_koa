import React from 'react'
import { Modal, Avatar, Button, Popover, Select, Input } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import styles from './chatting.less'

class ChattingDirect extends React.Component {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    show: PropTypes.bool,
    allJobs: PropTypes.array,
    jid: PropTypes.number,
    showMessage: PropTypes.bool,
    onSelectJob: PropTypes.func,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    show: false,
    // showPosition: false,
    allJobs: [],
    jid: undefined,
    showMessage: true,
    onSelectJob: () => {},
    loading: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      jid: props.jid,
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
    if (this.props.onSelectJob) {
      this.props.onSelectJob(job)
    }
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value })
  }

  handleSubmit = () => {
    const message = this.props.showMessage ? this.state.message : ''
    this.props.onSubmit(message, this.state.jid, '')
  }

  handleCancel = (e) => {
    this.setState({ message: '' })
    this.props.onCancel(e)
  }

  renderSingleTalent = (talent) => {
    const { avatar } = talent
    return (
      <p className="flex">
        <Avatar src={avatar} className={styles.singleAvatar} />
        <span className="flex-column margin-left-8 space-between ">
          <span className="font-size-16 font-weight-bold color-stress">
            {talent.name}
          </span>
          <span className="font-size-14">
            {`${talent.company}·${talent.position}`}
          </span>
        </span>
      </p>
    )
  }

  renderMultiAvatar = (item) => (
    <Popover content={item.name} trigger="hover" key={item.name}>
      <Avatar
        src={item.avatar}
        className={`${styles.multiAvatar} ${item.className}`}
        key={item.name}
      />
    </Popover>
  )

  renderMultiTalent = (talents) => (
    <p className="flex space-between">
      <div>
        {talents.slice(0, 5).map(this.renderMultiAvatar)}
        {talents.length > 7 &&
          this.renderMultiAvatar({
            avatar: '',
            name: '···',
            className: styles.multiAvatarEllipsis,
          })}
      </div>
      <div
        className="font-size-14 color-common display-inline-block"
        style={{ lineHeight: '40px' }}
      >
        {`共${talents.length}位人才`}
      </div>
    </p>
  )

  render() {
    const { talents, title = '极速联系' } = this.props

    const renderOption = (item) => (
      <Select.Option value={item.jid} key={item.jid}>
        {`${item.position} - ${item.city}`}
      </Select.Option>
    )

    const footer = (
      <div className={styles.footer}>
        <Button
          key="cancel"
          onClick={this.props.onCancel}
          className={styles.cancelButton}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={this.handleSubmit}
          disabled={
            (this.state.showMessage && !this.state.message) ||
            this.props.loading
          }
          className={styles.submitButton}
          loading={this.props.loading}
          key="im"
        >
          提交
        </Button>
      </div>
    )

    return (
      <Modal
        title={title}
        visible={this.props.show}
        onCancel={this.handleCancel}
        footer={footer}
        width={360}
        className={styles.main}
        maskClosable={false}
      >
        <div>
          {talents.length === 1 && this.renderSingleTalent(talents[0])}
          {talents.length > 1 && this.renderMultiTalent(talents)}
        </div>

        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="请选择职位"
          optionFilterProp="children"
          onChange={this.handleJidChange}
          className={styles.positionSelect}
          value={this.state.jid || undefined}
        >
          {this.props.allJobs.map(renderOption)}
        </Select>
        {this.props.showMessage && (
          <Input.TextArea
            onChange={this.handleMessageChange}
            value={this.state.message}
            placeholder="请输入信息"
            style={{ width: '100%', minHeight: '150px' }}
            className={styles.messageInput}
          />
        )}
      </Modal>
    )
  }
}

export default ChattingDirect
