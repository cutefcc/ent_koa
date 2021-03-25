import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as $ from 'jquery'
import { Modal, message } from 'antd'
import { Icon } from 'mm-ent-ui'
import * as styles from './index.less'

export interface Props {
  dispatch?: (obj: object) => any
  currentSubscribe: object
  subscribeList: object[]
  bprofileUser: object
}

export interface State {}

@connect((state: any) => ({
  subscribeList: state.sentiment.subscribeList,
  currentSubscribe: state.sentiment.currentSubscribe,
  bprofileUser: state.global.bprofileUser,
}))
export default class Banner extends React.PureComponent<Props, State> {
  handleSwitchCurrentSubscribe = (e, item, isActive) => {
    e.stopPropagation()
    if (isActive) {
      // this.handleDeleteWord(e, item.id)
      return
    }
    this.props.dispatch({
      type: 'sentiment/setCurrentSubscribe',
      payload: item,
    })

    this.fetchSentimentData()
  }

  fetchSentimentData = () => {
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }

  handleDeleteWord = (e, id) => {
    const { subscribeList, bprofileUser } = this.props
    const webcid = R.path(['company', 'webcid'], bprofileUser)
    e.stopPropagation()
    Modal.confirm({
      title: '删除订阅',
      content: '确定删除该订阅吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props
          .dispatch({
            type: 'sentiment/deleteSentimentWord',
            payload: {
              words_id: id,
              webcid,
            },
          })
          .then(({ code, msg }) => {
            if (code === 0) {
              message.success('关键词删除成功!')
              let payload = {}
              const len = subscribeList.length
              if (len && len > 1) {
                const find = R.findIndex(R.propEq('id', id))(subscribeList)
                if (find > -1) {
                  const index = find + 1 >= len ? 0 : find + 1
                  payload = subscribeList[index] || {}
                }
              }
              this.props.dispatch({
                type: 'sentiment/setCurrentSubscribe',
                payload,
              })
              this.props
                .dispatch({
                  type: 'sentiment/fetchSentimentList',
                })
                .then(this.fetchSentimentData)
              return
            }
            message.error(msg || '关键词删除失败!')
          })
      },
    })
  }

  renderSubscribeList = () => {
    const { subscribeList = [], currentSubscribe } = this.props

    return (
      <div className={`${styles.listWrapper} flex-column`}>
        {subscribeList.map((v) => {
          const { id, words } = v
          const isActive = R.equals(v, currentSubscribe)
          return (
            <p
              key={id}
              className={`${styles.subscribeItem} ${
                isActive ? styles.active : ''
              } flex flex-justify-space-between`}
              onClick={(e) => this.handleSwitchCurrentSubscribe(e, v, isActive)}
            >
              {words}
              {isActive && (
                <Icon
                  type="close-outline"
                  className={styles.icon}
                  onClick={(e) => this.handleDeleteWord(e, id)}
                />
              )}
            </p>
          )
        })}
      </div>
    )
  }

  render() {
    const { length: subscribeListLength } = this.props.subscribeList
    if (subscribeListLength <= 0) {
      return null
    }
    return (
      <div className={styles.subscriptionWrapper}>
        {this.renderSubscribeList()}
      </div>
    )
  }
}
