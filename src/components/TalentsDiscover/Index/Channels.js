import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ChannelCard from 'components/Common/ChannelCard'
import * as R from 'ramda'
import { LoadingOutlined } from '@ant-design/icons'
import { computeTimeRemain } from 'utils/date'

import styles from './channels.less'

@connect((state) => ({
  loading: state.loading.effects['channels/fetch'],
}))
@withRouter
export default class Channels extends React.PureComponent {
  state = {
    channels: [],
    timeRemain: '计算中...',
    hasFetchList: false,
  }

  componentDidMount() {
    this.fetchChannels()
    this.timer = window.setInterval(this.setTimeRemain, 1000)
  }

  setTimeRemain = () => {
    if (!this.state.hasFetchList) {
      return
    }
    const timeRemain = computeTimeRemain(
      R.path([0, 'end_time'], this.state.channels)
    )
    this.setState({
      timeRemain,
    })

    if (!timeRemain && this.timer) {
      window.clearInterval(this.timer)
    }
  }

  fetchChannels = () => {
    this.props
      .dispatch({
        type: 'channels/fetch',
        payload: {
          v: 2,
        },
      })
      .then(({ data }) => {
        this.setState({
          channels: data,
          hasFetchList: true,
        })
      })
  }

  handleRedirectToChannel = () => {
    this.props.history.push('/ent/talents/discover/channel')
  }

  renderItem = (item) => (
    <ChannelCard
      data={item}
      className={styles.channelCard}
      key={item.id}
      source="channel_brief_discover"
    />
  )

  render() {
    const { channels } = this.state
    const { loading } = this.props

    return (
      <div key="channels">
        <h3 className={styles.title} key="title">
          <span>
            人才专题{' '}
            <span className={styles.tip}>
              {this.state.timeRemain ? (
                `距离本场结束剩${this.state.timeRemain}`
              ) : (
                <span className="color-orange">
                  本场活动已结束[每周二上午 10:00 开始]
                </span>
              )}
            </span>
          </span>
          <span
            onClick={this.handleRedirectToChannel}
            className="font-size-14 color-dilution cursor-pointer"
          >
            更多专题
          </span>
        </h3>

        <div className={styles.content} key="items">
          {loading && (
            <p className={styles.loadingTip}>
              <LoadingOutlined />
              加载中...
            </p>
          )}
          <div className={styles.line}>
            {channels.slice(0, 2).map(this.renderItem)}
          </div>
          <div className={styles.line}>
            {channels.slice(2, 4).map(this.renderItem)}
          </div>
        </div>
      </div>
    )
  }
}
