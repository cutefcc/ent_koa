import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'mm-ent-ui'
import { Popover } from 'antd'
import * as R from 'ramda'

export default class ShowPhoneButton extends React.Component {
  static propTypes = {
    talent: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    disabled: false,
    className: '',
    content: '',
  }

  handleShowPhone = (e) => {
    e.stopPropagation()
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: R.pathOr(0, ['talent', 'id'], this.props),
      }
      const key = 'jobs_pc_talent_view_phone'
      window.voyager.trackEvent(key, key, param)
    }
  }

  render() {
    const { talent } = this.props
    return (
      <span
        className={this.props.className}
        ref={(dom) => {
          this.mobilePopDom = dom
        }}
      >
        <Popover
          content={talent.mobile}
          title={`查看${talent.name}的手机号`}
          trigger="click"
          getPopupContainer={() => this.mobilePopDom}
        >
          <Button
            onClick={this.props.onClick || this.handleShowPhone}
            disabled={this.props.disabled || this.props.loading}
            type={this.props.type || 'button_s_exact_link_bgray'}
            style={this.props.style || {}}
          >
            {this.props.content || '查看手机号'}
          </Button>
        </Popover>
      </span>
    )
  }
}
