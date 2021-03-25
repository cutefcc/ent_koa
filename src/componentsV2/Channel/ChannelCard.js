import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Button } from 'mm-ent-ui'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { computeTimeRemain } from 'utils/date'
import ChannelBrief from './ChannelBrief'

import styles from './channelCard.less'

@connect()
@withRouter
export default class Channels extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  state = {
    isFinish: false,
  }

  componentDidMount() {
    this.timer = window.setInterval(this.setFinishState, 1000)
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  }

  setFinishState = () => {
    const endTime = R.propOr(0, 'end_time', this.props.data)
    const isFinish = !computeTimeRemain(endTime)
    this.setState({
      isFinish,
    })
    if (isFinish && this.timer) {
      window.clearInterval(this.timer)
    }
  }

  handleClick = () => {
    this.props.history.push(`/ent/v2/channels/${this.props.data.id}`)
  }

  render() {
    const { data } = this.props

    return (
      <div className={`${styles.card} ${this.props.className}`}>
        <div className={styles.title}>
          <div>
            <h5 className={styles.channelName}>{R.propOr('', 'name', data)}</h5>
            <span className={styles.description}>
              <span className="color-orange">
                {R.propOr('', 'total', data)}
              </span>
              位候选人 剩余
              <span className="color-orange">
                {R.propOr('', 'available', data)}
              </span>
              人可联系
            </span>
          </div>
          <div>
            <Button
              onClick={this.handleClick}
              // className={styles.button}
              disabled={this.state.isFinish}
              type="primary"
            >
              进入
            </Button>
          </div>
        </div>
        <div className={styles.content}>
          {R.propOr([], 'recommend', data)
            .slice(0, 2)
            .map((talent) => (
              <div className={styles.talentCard} key={talent.id}>
                <ChannelBrief
                  data={talent}
                  source={this.props.source}
                  isFinish={this.state.isFinish}
                />
              </div>
            ))}
        </div>
        <span className={styles.footer} onClick={this.handleClick}>
          查看更多人才
        </span>
      </div>
    )
  }
}
