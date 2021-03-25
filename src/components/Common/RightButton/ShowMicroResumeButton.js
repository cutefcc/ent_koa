import React from 'react'
import { Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'

@connect((state) => ({
  currentUser: state.global.currentUser,
  loading: state.loading.effects['personalAsset/addFriend'],
}))
export default class ShowMicroResumeButton extends React.PureComponent {
  static propTypes = {
    talent: PropTypes.object,
    disabled: PropTypes.bool,
    trackParam: PropTypes.object,
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    talent: {},
    disabled: false,
    trackParam: {},
    className: '',
    content: '',
  }

  handleShowMicroResume = (e) => {
    e.stopPropagation()
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: R.pathOr(0, ['talent', 'id'], this.props),
      }
      const key = 'jobs_pc_talent_micro_resume_click'
      window.voyager.trackEvent(key, key, param)
    }
  }

  render() {
    const microUrl =
      window.location.hostname === 'maimai.cn'
        ? R.propOr('', 'micro_url', this.props.talent)
        : R.propOr('', 'micro_url', this.props.talent).replace(
            'https://maimai.cn',
            `http://${window.location.hostname}`
          )
    return (
      <Button
        onClick={this.props.onClick || this.handleShowMicroResume}
        disabled={this.props.disabled || this.props.loading}
        className={this.props.className}
        type={this.props.type || 'button_s_exact_link_bgray'}
        key="showMicroResumeButton"
      >
        <a
          // eslint-disable-next-line no-script-url
          href="javascript:void(0);"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
          // eslint-disable-next-line consistent-return
          onClick={async (e) => {
            e.preventDefault()
            const result = await this.props.onGetUserLimit([this.props.talent])
            if (result) {
              return false
            }
            window.open(microUrl)
          }}
        >
          {this.props.content || '微简历'}
        </a>
      </Button>
    )
  }
}
