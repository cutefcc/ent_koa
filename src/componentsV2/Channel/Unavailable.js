import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import Avatar from 'componentsV2/Common/Avatar'
import { LoadingOutlined } from '@ant-design/icons'

import styles from './unavailable.less'

@connect((state) => ({
  loading:
    state.loading.effects['statCompany/channels/fetchUnavailableTalents'],
  currentChannel: state.channels.currentChannel,
}))
class Unavailable extends React.PureComponent {
  static propTypes = {
    channelId: PropTypes.number.isRequired,
  }

  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(newProps) {
    if (this.props.channelId !== newProps.channelId) {
      this.fetchData()
    }
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'channels/fetchUnavailableTalents',
        payload: {
          channel_id: this.props.channelId,
        },
      })
      .then(({ data = {} }) => {
        this.setState({
          data: R.propOr([], 'list', data),
        })
      })
  }

  renderAvatar = (item) => {
    const { avatar = '', name = '秘密' } = item
    const style = {
      width: '24px',
      height: '24px',
      fontSize: '14px',
      lineHeight: '24px',
      borderRadius: '12px',
    }

    return (
      <Avatar
        avatar={avatar}
        name={name}
        style={style}
        onClick={this.handleShowDetail}
        key="avatar"
      />
    )
  }

  renderCard = (item) => {
    const {
      position = '神秘之位',
      directed_num: directNum = 0,
      name = '姓名保密',
      worktime = '保密',
      company = '神秘公司',
      school = '神秘学校',
      sdegree = '保密学历',
    } = item
    return (
      <div className={styles.card}>
        <div className="line-height-1em flex space-between">
          <span className="color-stress font-size-14">
            {`${position} · ${worktime}`}
          </span>
          <span className="color-dilution">已被联系{directNum}次</span>
        </div>
        <div className="margin-top-8 line-height-1em color-common font-size-14">
          {`${company} / ${school}·${sdegree}`}
        </div>
        <div className="margin-top-8 line-height-1em flex space-between">
          <span>
            {this.renderAvatar(item)}
            <span className="margin-left-8 color-common">{name}</span>
          </span>
          <span className={styles.button}>不可联系</span>
        </div>
      </div>
    )
  }

  render() {
    const { data } = this.state
    return data.length > 0 ? (
      <div className={styles.main}>
        <h5 className={styles.title}>
          已有<span className="color-orange">{data.length}</span>
          位人才被抢完 剩余
          <span className="color-orange">
            {R.propOr(0, 'remain_num', this.props.currentChannel)}
          </span>
          位可联系
        </h5>
        <div className={styles.content}>
          {this.props.loading ? (
            <LoadingOutlined style={{ marginTop: 30 }} />
          ) : (
            data.slice(0, 3).map(this.renderCard)
          )}
        </div>
      </div>
    ) : null
  }
}

export default Unavailable
