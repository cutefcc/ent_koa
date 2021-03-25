import React from 'react'
import * as R from 'ramda'
import { Affix } from 'antd'
import PropTypes from 'prop-types'
import TalentCard from 'componentsV2/Common/TalentCard/CommonCard'
import $ from 'jquery'
import { connect } from 'react-redux'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class CommonCardWithTrack extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onOpFinish: PropTypes.func,
    onSelect: PropTypes.func,
    checked: PropTypes.bool,
    trackParam: PropTypes.object,
    showCheckbox: PropTypes.bool,
    scrollDom: PropTypes.object,
  }

  static defaultProps = {
    onOpFinish: () => {},
    checked: false,
    trackParam: {},
    onSelect: () => {},
    showCheckbox: true,
    scrollDom: document.body,
  }

  constructor(props) {
    super(props)
    this.state = {
      itemShowMap: {},
    }
  }

  componentWillUnmount() {
    const timers = Object.values(this.timer)
    timers.map((timer) => {
      if (timer) {
        clearTimeout(timer)
      }
      return ''
    })
  }

  timer = {}

  clickHandler = (item, buttons) => () => {
    const u2 = item.id

    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        u2,
        can_addfr: buttons.includes('addFriend') && !item.friend_state,
        has_micro_resume: !!item.micro_url,
        can_uh: buttons.includes('directIm') && !item.is_direct_im,
        can_dc: buttons.includes('directContact'),
        is_high_growth: !!item.is_high_growth,
        is_high_quality: !!item.is_high_quality,
        is_company_fans: !!item.is_company_fans,
        has_intention: !!item.has_intention,
        ...this.props.trackParam,
      }
      const key = 'jobs_pc_talent_show'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleCardExposure = (item, buttons) => (show) => {
    // console.log('iiiiiii+++: ', item, buttons, show)
    const u2 = item.id
    if (this.timer[`timer${u2}`]) {
      clearTimeout(this.timer[`timer${u2}`])
    }
    if (this.timer[`show-${u2}`]) {
      clearTimeout(this.timer[`show-${u2}`])
    }
    if (show) {
      this.timer[`timer${u2}`] = setTimeout(
        this.clickHandler(item, buttons),
        300
      )

      if (R.isNil(this.state.itemShowMap[u2])) {
        this.setState({
          itemShowMap: {
            ...this.state.itemShowMap,
            [u2]: true,
          },
        })
      }

      this.timer[`show-${u2}`] = setTimeout(() => {
        this.setState({
          itemShowMap: {
            ...this.state.itemShowMap,
            [u2]: false,
          },
        })
      }, 3000)
    }
  }

  handleCardHide = (item, buttons) => (show) => {
    const u2 = item.id
    if (this.timer[`timer${u2}`]) {
      clearTimeout(this.timer[`timer${u2}`])
    }
    if (!show) {
      this.timer[`timer${u2}`] = setTimeout(
        this.clickHandler(item, buttons),
        300
      )
    }
  }

  render() {
    const { data, scrollDom, opButtons, footerButtons, cardKey } = this.props
    const dom = $(scrollDom)

    return (
      <div
        key={cardKey}
        className="talent-common-card"
        style={{ margin: '0 16px' }}
      >
        <TalentCard {...this.props} itemShowMap={this.state.itemShowMap} />
        <Affix
          offsetTop={0}
          onChange={this.handleCardHide(data, [...opButtons, ...footerButtons])}
          target={() => this.props.scrollDom}
        />
        <Affix
          offsetTop={dom.height()}
          onChange={this.handleCardExposure(data, [
            ...opButtons,
            ...footerButtons,
          ])}
          target={() => this.props.scrollDom}
        />
      </div>
    )
  }
}
