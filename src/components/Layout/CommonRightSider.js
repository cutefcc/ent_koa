import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Modal, Input, Button, message } from 'antd'

import styles from './commonRightSider.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class Sider extends React.PureComponent {
  state = {
    showFeedbackModal: false,
    feedbackContent: '',
  }

  handleSetFeedbackContent = (e) => {
    this.setState({
      feedbackContent: e.target.value,
    })
  }

  handleHideFeedbackModal = () => {
    this.setState({
      feedbackContent: '',
      showFeedbackModal: false,
    })
  }

  handleShowFeedbackModal = () => {
    this.setState({
      showFeedbackModal: true,
    })
  }

  handleSendFeedbackMessage = () => {
    this.props
      .dispatch({
        type: 'global/feedback',
        payload: {
          content: this.state.feedbackContent,
        },
      })
      .then(() => {
        this.handleHideFeedbackModal()
        message.success('反馈成功，谢谢~')
      })
  }

  render() {
    return (
      <div>
        <div className={styles.siderHeader}>
          {/* <Icon type="pay-circle-o" className={styles.siderHeaderIcon} /> */}
          <span>
            剩余点数：
            {R.pathOr(0, ['license', 'balance'], this.props.currentUser)}
          </span>
          <div className={styles.feedbackPanel}>
            <Button onClick={this.handleShowFeedbackModal}>意见反馈</Button>
          </div>
        </div>
        <div className={styles.siderContent}>{this.props.children}</div>
        <Modal
          title="用户意见反馈"
          visible={this.state.showFeedbackModal}
          onOk={this.handleSendFeedbackMessage}
          onCancel={this.handleHideFeedbackModal}
          cancelText="取消"
          okText="确定反馈建意见"
          className={styles.feedbackModal}
        >
          <Input.TextArea
            autosize={{
              minRows: 5,
              maxRows: 10,
            }}
            onChange={this.handleSetFeedbackContent}
            value={this.state.feedbackContent}
            placeholder="支持最多 255 个字符"
            maxLength={255}
          />
          <p>
            还可输入{255 - this.state.feedbackContent.length} / 255
            个字符。非常感谢您的反馈!
          </p>
        </Modal>
      </div>
    )
  }
}
