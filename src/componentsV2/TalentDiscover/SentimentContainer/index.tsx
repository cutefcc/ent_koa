import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Input, message } from 'antd'
import { debounce } from 'utils/index'
import { Button } from 'mm-ent-ui'
import Subscription from './Subscription'
import * as styles from './index.less'

export interface Props {
  urlPrefix?: string
  dispatch?: (obj: object) => any
  currentUser: string
  className: string
  bprofileUser: object
}

export interface State {
  keyWord: string
}

@connect((state: any) => ({
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  subscribeList: state.sentiment.subscribeList,
}))
export default class SentimentContainer extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
    this.handleAddKeyWordDebounce = debounce(this.handleAddKeyWord, 500)
    this.state = {
      keyWord: '',
    }
  }

  handleKeyWordChange = (e) => {
    this.setState({
      keyWord: e.target.value,
    })
  }
  handlePressEnter = () => {
    this.handleAddKeyWordDebounce()
  }
  handleAddKeyWord = () => {
    const { subscribeList = [], bprofileUser } = this.props
    const webcid = R.path(['company', 'webcid'], bprofileUser)
    if (subscribeList.length >= 20) {
      message.error('订阅条件不能超过20个!')
      return
    }
    const { keyWord } = this.state
    const words = R.trim(keyWord)
    if (words.length > 0) {
      this.props
        .dispatch({
          type: 'sentiment/addSentimentWord',
          payload: {
            words,
            webcid,
          },
        })
        .then(({ code, msg }) => {
          if (code === 0) {
            message.success('关键词添加成功!')
            this.props
              .dispatch({
                type: 'sentiment/fetchSentimentList',
              })
              .then(({ list }) => {
                // 添加成功默认选中该值
                const find = R.find(R.propEq('words', words))(list)
                this.props.dispatch({
                  type: 'sentiment/setCurrentSubscribe',
                  payload: find || {},
                })
                this.fetchSentimentData()
              })
            this.setState({
              keyWord: '',
            })
            return
          }

          message.error(msg || '关键词添加失败!')
        })
    }
  }

  fetchSentimentData = () => {
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }

  render() {
    const { keyWord } = this.state
    return (
      <div className={`${this.props.className} ${styles.sentimentWrapper}`}>
        <div className={styles.title}>订阅管理</div>
        <Input
          placeholder="请输入10个字以内的关键词"
          onChange={this.handleKeyWordChange}
          onPressEnter={this.handlePressEnter}
          value={keyWord}
          style={{ width: 222, marginLeft: 16 }}
        />
        <Button
          className={styles.addBtn}
          type="default"
          disabled={keyWord.length === 0}
          onClick={this.handleAddKeyWordDebounce}
        >
          添加
        </Button>
        <Subscription />
      </div>
    )
  }
}
