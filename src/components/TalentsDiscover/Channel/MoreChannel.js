import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import styles from './moreChannel.less'

@connect((state) => ({
  loading: state.loading.effects['channels/fetch'],
}))
@withRouter
export default class MoreChannel extends React.PureComponent {
  static propTypes = {
    channelId: PropTypes.number.isRequired,
    onChannelIdChange: PropTypes.func.isRequired,
  }

  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'channels/fetch',
        payload: {
          channel_id: this.props.channelId,
        },
      })
      .then(({ data = [] }) => {
        this.setState({
          data,
        })
      })
  }

  handleRedirectChannel = (id) => () => {
    this.props.history.push(`/ent/talents/discover/channel/${id}`)
    this.props.onChannelIdChange(id)
  }

  renderCard = (item) => {
    const { name, total, available } = item
    return (
      <div className={styles.card}>
        <div>
          <h5 className="font-size-18 color-stress font-weight-bold">{name}</h5>
          <span className="margin-top-8 font-size-16 color-common display-iinline-block">
            <span className="color-orange">{total}</span>位候选人 剩余
            <span className="color-orange">{available}</span>位可联系
          </span>
        </div>
        <div>
          <Button
            onClick={this.handleRedirectChannel(item.id)}
            className={styles.button}
          >
            <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { data } = this.state
    return (
      <div className={styles.main}>
        <h5 className="font-size-20 color-stress">更多专题</h5>
        <div className={styles.content}>
          {this.props.loading ? (
            <LoadingOutlined style={{ marginTop: 30 }} />
          ) : (
            data.map(this.renderCard)
          )}
        </div>
      </div>
    )
  }
}
