import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Input, message } from 'antd'
import { debounce } from 'utils/index'
import { Button } from 'mm-ent-ui'
import * as styles from './index.less'

export interface Props {
  className: string
  urlPrefix: string
  bprofileUser: object
}

export interface State {
  keyWord: string
}

@connect((state) => ({
  urlPrefix: state.global.urlPrefix,
  bprofileUser: state.global.bprofileUser,
}))
export default class EmptyTip extends React.PureComponent<Props, State> {
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

  renderEmptyTip = () => {
    const { keyWord } = this.state
    const { description } = this.props
    return (
      <div className={styles.defaultTip}>
        <div className={styles.main}>
          <img
            className={styles.image}
            src={`${this.props.urlPrefix}/images/empty_subscription.png`}
            alt="empty"
          />
          {!!description && <p className={styles.desc}>{description}</p>}
        </div>
        <div className={styles.addKeyWord}>
          <Input
            placeholder="请输入10个字以内的关键词"
            onChange={this.handleKeyWordChange}
            onPressEnter={this.handlePressEnter}
            value={keyWord}
            style={{ width: 222, marginRight: 8 }}
          />
          <Button
            className={styles.addBtn}
            type="primary"
            disabled={keyWord.length === 0}
            onClick={this.handleAddKeyWordDebounce}
          >
            添加订阅
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={R.propOr('', 'className', this.props)}>
        {this.renderEmptyTip()}
      </div>
    )
  }
}
