import React from 'react'
import PropTypes from 'prop-types'
import { Popover, Button } from 'antd'
import { redirectToIm } from 'utils'
import Avatar from 'components/Common/Avatar'
import * as R from 'ramda'
import { connect } from 'react-redux'
import $ from 'jquery'

import styles from './commonFriends.less'

@connect()
export default class CommonFriends extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      remain: 0,
      commonFrineds: [],
    }

    // this.fetchCommonFriends()
  }

  setCurrentDom = (dom) => {
    this.dom = dom
  }

  smallAvatarStyle = {
    width: '24px',
    height: '24px',
    fontSize: '14px',
    lineHeight: '24px',
    borderRadius: '13px',
    cursor: 'pointer',
  }

  bigAvatarStyle = {
    width: '40px',
    height: '40px',
    fontSize: '22px',
    lineHeight: '40px',
    borderRadius: '20px',
    cursor: 'pointer',
  }

  fetchCommonFriends = () => {
    this.props
      .dispatch({
        type: 'global/fetchCommonFriends',
        payload: {
          page: this.state.page,
          size: 10,
          to_uid: this.props.data.id,
        },
      })
      .then(({ data }) => {
        this.setState({
          commonFrineds: R.propOr([], 'list', data),
          remain: R.propOr(0, 'remain', data),
        })
      })
  }

  handleToPrePage = () => {
    if (this.state.page > 0) {
      this.setState(
        {
          page: this.state.page - 1,
        },
        this.fetchCommonFriends
      )
    }
  }

  handleToNextPage = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.fetchCommonFriends
    )
  }

  handleVisibleChange = (visible) => {
    // 由于人才卡片的 opacity 会影响弹框的效果，所以当弹框出现时候，强制设置卡片不透明
    const dom = $(this.dom)
    if (dom) {
      const parents = dom.parents('div[class*=card][class*=disabled]')
      parents.css('opacity', visible ? 1 : 0.5)
    }

    if (visible) {
      this.fetchCommonFriends()
    }
  }

  renderSmallAvatar = (v) => (
    <a
      href={v.detail_url}
      target="_blank"
      rel="noopener noreferrer"
      key={v.avatar}
      className="margin-right-5"
    >
      <Avatar
        avatar={v.avatar}
        name={R.propOr('保密', 'name', v)}
        style={this.smallAvatarStyle}
        key="avatar"
      />
    </a>
  )

  renderTalent = (item) => {
    return (
      <span className={`flex ${styles.talentItem}`}>
        <a
          href={item.detail_url}
          target="_blank"
          rel="noopener noreferrer"
          key={item.avatar}
        >
          <Avatar
            avatar={item.avatar}
            name={R.propOr('保密', 'name', item)}
            style={this.bigAvatarStyle}
            key="avatar"
          />
        </a>
        <span className="flex-column space-between margin-left-16 flex-1">
          <span className="color-common">{item.name}</span>
          <span className="color-dilution">
            {`${item.company} ${item.position}`}
          </span>
        </span>
        <span>
          <Button
            className="ghost-button margin-right-5"
            onClick={() => redirectToIm(item.id)}
          >
            沟通
          </Button>
        </span>
      </span>
    )
  }

  renderPopover = () => {
    const { commonFrineds } = this.state
    const { data } = this.props

    return (
      <div className={styles.popover}>
        <h5 className={styles.title}>
          {`你们之间有${data.friends_cnt}个共同好友`}
        </h5>
        {commonFrineds.map(this.renderTalent)}
        {(this.state.remain === 1 || this.state.page > 0) && (
          <div className={styles.footer}>
            {this.state.page > 0 && (
              <Button
                onClick={this.handleToPrePage}
                className="like-link-button"
                style={{ paddingRight: '10px' }}
              >
                上一页
              </Button>
            )}
            {this.state.remain === 1 && (
              <Button
                onClick={this.handleToNextPage}
                className="like-link-button"
              >
                下一页
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  render() {
    const { data } = this.props
    const friends = R.propOr([], 'friends', data)
    const friendsLength = R.propOr(0, 'length', friends)
    const friendsNum = R.propOr(0, 'friends_cnt', data)

    if (!friendsLength) {
      return <div />
    }
    return (
      <div
        ref={this.setCurrentDom}
        style={{ position: 'relative' }}
        className={this.props.className}
      >
        <Popover
          content={this.renderPopover()}
          placement="bottom"
          getPopupContainer={() => this.dom}
          onVisibleChange={this.handleVisibleChange}
        >
          <span>
            {/* {friends.slice(0, 10).map(this.renderSmallAvatar)} */}
            <span className="color-card-footer ">
              {`共同好友·${friendsNum}`}
            </span>
          </span>
        </Popover>
      </div>
    )
  }
}
