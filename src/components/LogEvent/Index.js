import React from 'react'
import * as R from 'ramda'
import PropTypes from 'prop-types'

export default class LogEvent extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  /*
		eventList : {
			click: [
				{
					elattr: 'test1',
					eventname: 'test_for_log_data_1',
					params: {

					}
				},
				...
			],
			mouseenter: [
				...
			],
			mouseleave: [
				...
			]
		}
	*/

  state = {
    eventList: this.props.eventList || {},
  }

  componentWillMount() {}

  componentDidMount() {}

  // 有些需要初始化的时候就打点
  track = ({ eventName, trackParam }) => {
    this.addLog(eventName, trackParam)
  }

  // 打点事件
  addLog = (name = '', params = {}) => {
    if (name === '') {
      return
    }
    if (window.voyager) {
      const par = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...params,
      }
      window.voyager.trackEvent(name, name, par)
    }
  }

  // 点击事件，
  click(e) {
    const element = e.target
    let trackParam = {}
    try {
      trackParam = JSON.parse(element.getAttribute('trackparam'))
    } catch (error) {
      // empty
    }

    const trackParamLen = R.length(R.keys(trackParam))
    const list = this.state.eventList.click || []
    if (!element || !list || list.length === 0) {
      return
    }
    list.forEach((item) => {
      if (element.getAttribute('attr') === item.elattr) {
        const params =
          trackParamLen > 0
            ? { ...trackParam, ...e.data }
            : item.trackParam || {}
        this.addLog(item.eventname, params)
      }
    })
  }

  // 鼠标进入事件
  mouseenter() {}

  // 鼠标移出事件
  mouseleave() {}

  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { track: this.track })
    )
    return (
      <div
        className={`${this.props.className || ''}`}
        onClick={(e) => {
          this.click(e)
        }}
        onMouseEnter={(e) => {
          this.mouseenter(e)
        }}
        onMouseLeave={(e) => {
          this.mouseleave(e)
        }}
      >
        {/* {this.props.children} */}
        {childrenWithProps}
      </div>
    )
  }
}
