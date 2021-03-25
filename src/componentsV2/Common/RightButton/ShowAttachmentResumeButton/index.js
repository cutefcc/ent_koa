import React from 'react'
import { Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'

@connect((state) => ({
  currentUser: state.global.currentUser,
  loading: state.loading.effects['personalAsset/addFriend'],
}))
export default class ShowAttachmentResumeButton extends React.PureComponent {
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

  handleMicroResumeClick = () => {
    if (window.voyager) {
      const key = 'jobs_pc_talent_download_resume'
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: R.pathOr(0, ['talent', 'id'], this.props),
      }
      window.voyager.trackEvent(key, key, param)
    }
    const attachmentResume = R.propOr(
      '',
      'attachment_resume_url',
      this.props.talent
    )
    window.open(attachmentResume)
  }

  render() {
    return (
      <Button
        onClick={this.handleMicroResumeClick}
        disabled={this.props.disabled || this.props.loading}
        className={this.props.className}
        type={this.props.type || 'button_s_exact_link_bgray'}
        key="showAttachmentResumeButton"
      >
        {/* <a
          href={attachmentResume}
          target="_blank"
          rel="noopener noreferrer"
          key="attachmentResume"
          style={{textDecoration: 'none'}}
        >
          {this.props.content || '附件简历'}
        </a> */}
        {this.props.content || '附件简历'}
      </Button>
    )
  }
}
