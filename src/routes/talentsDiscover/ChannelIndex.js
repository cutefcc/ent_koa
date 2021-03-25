import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ChannelCard from 'components/Common/ChannelCard'
import * as R from 'ramda'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './channelIndex.less'

@connect((state) => ({
  loading: state.loading.effects['channels/fetch'],
}))
@withRouter
export default class Talents extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchChannels()
    this.fetchJobs()
  }

  fetchChannels = () => {
    this.props
      .dispatch({
        type: 'channels/fetch',
      })
      .then(({ data }) => {
        this.setState({
          data,
        })
      })
  }

  fetchJobs = () => this.props.dispatch({ type: 'global/fetchJobs' })

  renderItem = (item) => (
    <div className={styles.item}>
      {R.isEmpty(item) ? null : (
        <ChannelCard
          data={item}
          className={styles.channelCard}
          key={item.id}
          source="channel_brief"
        />
      )}
    </div>
  )

  render() {
    const { data } = this.state
    const suffixNum = 3 - (data.length % 3)
    const formatData = [...data, ...R.range(0, suffixNum).map(() => ({}))]
    return (
      <div className={styles.main}>
        {this.props.loading ? (
          <p className={styles.loadingTip}>
            <LoadingOutlined />
            加载中...
          </p>
        ) : (
          formatData.map(this.renderItem)
        )}
      </div>
    )
  }
}
