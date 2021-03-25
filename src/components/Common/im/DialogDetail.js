import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import * as R from 'ramda'

import Dialogues from './Dialogues'
import styles from './dialogDetail.less'

export default class DialogDetail extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
    onMessageChange: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    canSend: PropTypes.bool.isRequired,
    dialogUser: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    authInfo: PropTypes.object.isRequired,
  }

  state = {
    dialoguesDom: '',
  }

  componentDidUpdate() {
    const dom = this.state.dialoguesDom
    if (dom) {
      if (dom.scrollTo) {
        dom.scrollTo(0, 100000)
      } else if (dom.scrollTop !== undefined) {
        dom.scrollTop = 100000
      }
    }
  }

  setDialoguesDom = (dialoguesDom) =>
    this.setState({
      dialoguesDom,
    })

  handleSendMessage = (e) => {
    e.preventDefault()
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      this.props.onMessageChange(`${this.props.message}\n`)
    } else {
      this.props.onSend()
    }
  }

  handleChangeMessage = (e) => {
    this.props.onMessageChange(e.target.value)
  }

  render() {
    const { canSend, dialogUser, data, message } = this.props
    return (
      <div className={styles.panel}>
        <div className={styles.title} key="title">
          {R.propOr('会话窗口', 'name', dialogUser)}
        </div>
        <div
          className={styles.content}
          ref={this.setDialoguesDom}
          key="content"
        >
          <Dialogues
            data={data}
            dialogUser={dialogUser}
            currentUser={this.props.currentUser}
            authInfo={this.props.authInfo}
          />
        </div>
        <Input.TextArea
          className={styles.input}
          placeholder="请输入需要发送的消息，回车发送"
          onPressEnter={this.handleSendMessage}
          onChange={this.handleChangeMessage}
          value={message}
          disabled={!canSend}
          key="input"
        />
      </div>
    )
  }
}
