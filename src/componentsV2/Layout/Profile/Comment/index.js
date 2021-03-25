import React from 'react'
import { Text, FeedCard, Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { retreiveNewStacks } from 'utils/stacks'
import styles from './index.less'

@connect((state) => ({
  uids: state.profile.uids,
  currentIndex: state.profile.currentIndex,
}))
export default class Comment extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  handleToDetail = (uid) => () => {
    const { uids = [], currentIndex } = this.props
    const newUids = retreiveNewStacks(uids, currentIndex, uid)
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        currentUid: uid,
        uids: newUids,
        currentIndex: newUids.length - 1,
      },
    })
  }

  renderCard = (commentInfo) => {
    const { src_user: srcUser = {} } = commentInfo
    return (
      <FeedCard
        logoProps={{
          name: srcUser.name,
          src: srcUser.avatar,
          shape: 'circle',
          onClick: this.handleToDetail(srcUser.id),
        }}
        line1={[
          <Text type="title" key="name">
            {srcUser.name}
          </Text>,
          <Text type="text_common" key="position" className="margin-left-8">
            {srcUser.career}
          </Text>,
          srcUser.judge ? <Icon type="v" className="margin-left-4" /> : null,
        ]}
        line2={
          <div className="flex flex-justify-space-between">
            <Text type="text_week">{commentInfo.re}</Text>
            <Text type="text_week">{commentInfo.crtime}</Text>
          </div>
        }
        line3={commentInfo.text}
        className="margin-top-20"
      />
    )
  }

  renderCards = () => {
    const {
      data: { evaluation_list: list = [] },
    } = this.props
    return list.map(this.renderCard)
  }

  render() {
    const {
      data: { evaluation_list: list = [] },
    } = this.props
    if (list.length === 0) {
      return null
    }
    return (
      <div className={styles.main} id={this.props.id}>
        <Text type="title">好友评价{list.length}条</Text>
        {this.renderCards()}
      </div>
    )
  }
}
