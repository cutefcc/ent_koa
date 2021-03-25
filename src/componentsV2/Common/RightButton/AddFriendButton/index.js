import React from 'react'
import { message, Popover, Modal } from 'antd'
import { Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Avatar from 'componentsV2/Common/Avatar'

import * as R from 'ramda'

import styles from './../button.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  loading: state.loading.effects['personalAsset/addFriend'],
}))
export default class AddFriendButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    onAddFinish: PropTypes.func,
    disabled: PropTypes.bool,
    trackParam: PropTypes.object,
    showPop: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    // iconType: 'user-add',
    onAddFinish: () => {},
    disabled: false,
    trackParam: {},
    showPop: false,
    className: '',
    content: '',
  }

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  handleResult = (data = []) => {
    const successItems = data.filter(R.propEq('errorcode', 0))
    const failItems = data.filter(R.compose(R.not, R.propEq('errorcode', 0)))

    window.broadcast.send(
      'addFriendSuccess',
      successItems.map(R.prop('to_uid'))
    )
    window.broadcast.send('addFriendFail', failItems.map(R.prop('to_uid')))

    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        // cr_id: successItems.map(R.prop('equity_id')).join(','),
        u2: R.zipObj(
          successItems.map(R.prop('to_uid')),
          successItems.map(R.prop('equity_id'))
        ),
      }
      const key = 'jobs_pc_talent_addf_success'
      window.voyager.trackEvent(key, key, param)
    }
    if (failItems.length === 0) {
      message.success('已发送加好友申请')
      return ''
    }
    Modal.error({
      title: `${failItems.length}位人才添加失败`,
      content: this.renderFailItems(failItems),
      className: styles.failTip,
      okText: '我知道了',
    })

    return null
  }

  handleAddFriend = (e) => {
    e.stopPropagation()
    const ids = this.props.talents.map(R.prop('id'))
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: ids.join(','),
      }
      const key = 'jobs_pc_talent_addf_click'
      window.voyager.trackEvent(key, key, param)
    }
    this.props
      .dispatch({
        type: 'personalAsset/addFriend',
        payload: {
          to_uids: ids.join(','),
          source: this.props.type,
        },
      })
      .then(({ data } = []) => {
        this.handleResult(data)
        this.refreshCurrentUser()
        this.props.onAddFinish(ids, data)
      })
  }

  renderAvatar = (item) => {
    const { avatar = '', name = '' } = item
    const style = {
      width: '40px',
      height: '40px',
      fontSize: '24px',
      lineHeight: '40px',
      borderRadius: '20px',
    }

    return <Avatar avatar={avatar} name={name} style={style} />
  }

  renderFailItems = (items) => {
    return items.map((item) => (
      <div key={item.name} className="margin-top-16 flex">
        {this.renderAvatar(item)}
        <span className="flex-column space-between margin-left-16">
          <span>
            <span className="font-size-16 color=-common">{item.name}</span>
            <span className="color-dilution font-size-14 margin-left-16">
              {`${item.company}·${item.position}`}
            </span>
          </span>
          <span className="color-diution font-size-12 color-red">
            {item.msg}
          </span>
        </span>
      </div>
    ))
  }

  render() {
    const button = (
      <Button
        onClick={this.props.onClick || this.handleAddFriend}
        disabled={this.props.disabled || this.props.loading}
        className={this.props.className}
        style={this.props.style}
        type={this.props.type || 'link'}
      >
        <span>{this.props.content || '加好友'}</span>
      </Button>
    )
    return this.props.showPop ? (
      <Popover placement="topLeft" content="加好友" trigger="hover">
        {button}
      </Popover>
    ) : (
      button
    )
  }
}
