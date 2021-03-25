import React from 'react'
import { Popover, Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as R from 'ramda'

@connect((state) => ({
  currentUser: state.global.currentUser,
  loading: state.loading.effects['talentPool/setUnSuitable'],
}))
export default class SetUnsuitableButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    onOpFinish: PropTypes.func,
    disabled: PropTypes.bool,
    trackParam: PropTypes.object,
    // showPop: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    onOpFinish: () => {},
    disabled: false,
    trackParam: {},
    // showPop: false,
    className: '',
    content: '',
  }

  handleUnSuitableClick = (e) => {
    e.stopPropagation()
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
      }
      const key = 'jobs_pc_talent_set_unsuitable_click'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleResult = (ids = []) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: ids.join(','),
      }
      const key = 'jobs_pc_talent_set_unsuitable_success'
      window.voyager.trackEvent(key, key, param)
    }
    return null
  }

  handleSetUnsuitable = (e) => {
    e.stopPropagation()
    const ids = this.props.talents.map(R.prop('id'))
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: this.props.talents.map(R.prop('id')).join(','),
      }
      const key = 'jobs_pc_talent_set_unsuitable_confirm'
      window.voyager.trackEvent(key, key, param)
    }
    this.props
      .dispatch({
        type: 'talentPool/setUnSuitable',
        payload: {
          to_uid: ids.join(','),
        },
      })
      .then(() => {
        this.handleResult(ids)
        this.props.onOpFinish(this.props.talents)
      })
  }

  render() {
    const button = (
      <Popover.Confirm
        trigger="click"
        onConfirm={this.handleSetUnsuitable}
        title={
          <div>
            <span className="flex flex-justify-center font-size-16">
              确定将{' '}
              <span className="ellipsis color-stress font-weight-bold">
                {' '}
                {R.pathOr('1个用户', [0, 'name'], this.props.talents)}{' '}
              </span>{' '}
              标记为不合适?
            </span>
            <span className="color-dilution width-p100 text-center margin-top-8 display-inline-block">
              标记后将进入不合适列表
            </span>
          </div>
        }
        placement="topRight"
        getPopupContainer={() => this.props.scrollDom || document.body}
      >
        <Button
          onClick={this.props.onClick || this.handleUnSuitableClick}
          disabled={this.props.disabled || this.props.loading}
          className={this.props.className}
          style={this.props.style}
        >
          {this.props.content || '不合适'}
        </Button>
      </Popover.Confirm>
    )
    return button
  }
}
