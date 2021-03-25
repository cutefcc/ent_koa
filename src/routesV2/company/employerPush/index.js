import React, { PureComponent } from 'react'
import { injectUnmount, trackEvent } from 'utils'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { TimePicker, DatePicker, Input, AutoComplete, message } from 'antd'
import { Button, Empty } from 'mm-ent-ui'
import styles from './style.less'

const statusColor = {
  0: '#B1B6C1',
  1: '#FFA408',
  2: '#FFA408',
  3: '#222222',
  4: '#FF4D3C',
}

@connect((state) => ({
  loading: false, // state.loading.effects,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  auth: state.global.auth,
}))
@injectUnmount
export default class EmployerPush extends PureComponent {
  state = {
    data: {},
    sendDate: '',
    sendTime: '',
    sendPeople: 0,
    topicTitle: '',
  }

  componentDidMount() {
    trackEvent('bprofile_company_manage_employerpush_enter')
    this.getPageData()
  }

  getPageData() {
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      this.props.currentUser
    )
    if (!webcid) {
      return
    }
    // 权限验证
    if (!this.props.auth.isCompanyPayUser) {
      this.props.history.push('/ent/v2/company/home')
      return
    }
    this.props
      .dispatch({
        type: 'company/fetchPushData',
        payload: {
          webcid,
        },
      })
      .then((res) => {
        this.setState({
          data: res,
        })
      })
      .catch(() => {})
  }

  getQuestionList = () => {
    const questionList = []
    const { predefined_topic: predefinedTopic = [] } = this.state.data
    predefinedTopic.forEach((item) => {
      item.topics.forEach((topic) => {
        questionList.push(topic.topic_title)
      })
    })
    return questionList
  }

  pushHandle = () => {
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      this.props.currentUser
    )

    if (!webcid) {
      return
    }

    const {
      sendDate = '',
      sendTime = '',
      sendPeople = 0,
      topicTitle = '',
    } = this.state

    if (!sendDate) {
      message.error('请填写推送日期～')
      return
    }

    if (!sendTime) {
      message.error('请填写推送时间必填～')
      return
    }

    const nowDateTime = new Date().getTime()
    const sendDateTime = new Date(`${sendDate} ${sendTime}`).getTime()
    if (sendDateTime < nowDateTime) {
      message.error('推送时间必须大于当前时间～')
      return
    }

    if (!topicTitle || topicTitle.length < 8 || topicTitle.length > 40) {
      message.error('推送问题内容限制8到40个字～')
      return
    }

    this.props
      .dispatch({
        type: 'company/sendTopicPush',
        payload: {
          webcid,
          send_time: `${sendDate} ${sendTime}`,
          sent_people: sendPeople,
          topic_title: topicTitle,
        },
      })
      .then(() => {
        message.success('推送任务创建完成～')
        this.getPageData()
      })
  }

  removeHandle = (taskId, e) => {
    e.stopPropagation()
    const webcid = R.pathOr(
      '',
      ['bprofileCompanyUser', 'company', 'webcid'],
      this.props.currentUser
    )

    if (!webcid) {
      return
    }
    this.props
      .dispatch({
        type: 'company/removeTopicPush',
        payload: {
          webcid,
          task_id: taskId,
        },
      })
      .then(() => {
        message.success('撤销成功～')
        this.getPageData()
      })
  }

  goQuestionDetail = (target) => {
    window.open(target)
  }

  renderHistory() {
    const { invite_history: inviteHistory = [] } = this.state.data
    if (inviteHistory.length > 0) {
      return (
        <div>
          {inviteHistory.map((history) => (
            <div
              key={history.task_id}
              onClick={() => this.goQuestionDetail(history.target)}
              className={styles.row}
            >
              <div className={styles.row__label}>
                <div>{history.send_time}</div>
                <div
                  className={styles.row__status}
                  style={{
                    color: statusColor[history.task_status],
                  }}
                >
                  {history.task_show_text}
                </div>
              </div>
              <div className={styles.row__content}>
                <div>{history.topic_title}</div>
                <div>
                  <Button
                    type="button_m_exact_link_blue"
                    onClick={(e) => this.removeHandle(history.task_id, e)}
                    disabled={history.task_status !== 1}
                  >
                    撤销推送
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <Empty
        image={`${this.props.urlPrefix}/images/empty_position.png`}
        description="暂无推送历史"
      />
    )
  }

  render() {
    const questionList = this.getQuestionList()
    const { invite_info: inviteInfo = {} } = this.state.data
    const { left_times: leftTimes = 0, show_text: showText = '' } = inviteInfo
    return (
      <div className={styles.page}>
        <Title text="选择问题推送给员工" />
        <div className={styles.itemRow}>
          <div className={styles.itemRow__label}>设置推送时间 </div>
          <div className={styles.itemRow__content}>
            <DatePicker
              placeholder="请选择推送日期"
              onChange={(value, timeString) => {
                this.setState({
                  sendDate: timeString,
                })
              }}
              format="YYYY-MM-DD"
              style={{ width: 224 }}
            />
            <div
              style={{
                marginLeft: '16px',
                display: 'inline-block',
              }}
            >
              <TimePicker
                onChange={(value, timeString) => {
                  this.setState({
                    sendTime: timeString,
                  })
                }}
                format="HH:mm"
                placeholder="请选择推送时间"
                style={{ width: 224 }}
              />
            </div>
          </div>
        </div>
        <div className={styles.itemRow}>
          <div className={styles.itemRow__label}>选择问题 </div>
          <div className={styles.itemRow__content}>
            <QuestionSelect
              options={questionList}
              onKeyPress={(value) => {
                this.setState({
                  topicTitle: value,
                })
              }}
            />
          </div>
        </div>
        <div className={styles.sumbit}>
          <Button
            type="primary"
            onClick={this.pushHandle}
            disabled={leftTimes < 1}
          >
            确认推送
          </Button>
          <div className={styles.sumbit__tips}>{showText} </div>
        </div>
        <div className={styles.history}>
          <Title text="已推送问题" />
          {this.renderHistory()}
        </div>
      </div>
    )
  }
}

const Title = (props) => {
  const { helpUrl } = props
  return (
    <div className={styles.title}>
      {props.text}
      {helpUrl && (
        <img
          className={styles.help}
          src="https://i9.taou.com/maimai/p/23803/2184_53_6GO2qUfl2RuHkl"
          alt="帮助文档"
        />
      )}
    </div>
  )
}

const QuestionSelect = (props) => {
  const { options, onKeyPress } = props

  return (
    <AutoComplete
      onChange={onKeyPress}
      style={{
        width: 464,
      }}
      dataSource={options}
      filterOption={(inputValue, option) =>
        option.props.children
          .toUpperCase()
          .indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      <Input.Search placeholder="选择或者输入推送的问题" />
    </AutoComplete>
  )
}
