import React from 'react'

// import Iframe from 'components/JobMan/Iframe'

import * as R from 'ramda'
import $ from 'jquery'
import { connect } from 'react-redux'

import styles from './create_v2.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class JobMan extends React.Component {
  constructor(props) {
    super(props)
    const { ejid } = props.match.params
    if (!ejid) {
      window.location.href = 'https://maimai.cn/ent/talents/recruit/positions'
    }
    this.state = {
      ejid,
    }
  }

  handleLoad = (e) => {
    const dom = R.path(['target', 'contentWindow', 'document'], e)
    if (dom) {
      $('.edit', dom).attr('target', '_self')
      $('.msaas_header', dom).css({
        display: 'none',
      })
      $(dom).css({
        background: '#f7f9f9',
      })
      // $('.exposure', dom).unbind('click')
      // $('.exposure', dom).on('click', this.handleExposure)
    }
  }

  // handleExposure = e => {
  //   console.log($(e.target))
  //   console.log($(e.target).attr('jid'))
  //   if (e && e.preventDefault) {
  //     console.log('preventDefault')
  //     e.preventDefault()
  //   }

  //   if (e && e.stopPropagation) {
  //     console.log('stopPropagation')
  //     e.stopPropagation()
  //   }
  // }

  handleRedirect = () => {
    this.props.history.push(
      R.path(['ucard', 'is_adm'], this.props.currentUser) === 1
        ? '/ent/asset/personal'
        : '/ent/asset'
    )
  }

  render() {
    return (
      <div className={styles.main}>
        {/* <div className={styles.top}>
          <div className={styles.content}>
            您当前「极速曝光」券余量:{}
            <span className={styles.num}>
              {R.pathOr(0, ['mem', 'exposure'], this.props.currentUser)}
            </span>，如您需要极速曝光，可以用点数{' '}
            <span onClick={this.handleRedirect} className={styles.button}>
              兑换
            </span>
          </div>
        </div> */}
        <div className={styles.iframe}>
          <iframe
            frameBorder="0"
            seamless
            src={`https://maimai.cn/add_job?ejid=${this.state.ejid}&from=business`}
            style={{ flex: 1 }}
            title="job_man"
            id="job_man"
            onLoad={this.handleLoad}
          />
        </div>
      </div>
    )
  }
}
