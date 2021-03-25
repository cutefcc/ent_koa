/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable react/no-find-dom-node */
import React from 'react'
import { findDOMNode } from 'react-dom'
// import {height} from 'window-size'
import { Affix } from 'antd'
// import {subscribe} from 'subscribe-ui-event'

let isGlobalListenersRegistered = false
let lastUserEvent = 'pointer'

function handleClickEvents() {
  lastUserEvent = 'pointer'
}

function handleWheelEvents() {
  lastUserEvent = 'wheel'
}

function registerGlobalListeners() {
  if (!isGlobalListenersRegistered) {
    window.addEventListener('click', handleClickEvents)
    window.addEventListener('wheel', handleWheelEvents, {
      passive: true,
    })
    window.addEventListener('mousewheel', handleWheelEvents, {
      passive: true,
    })
    window.addEventListener('touchmove', handleWheelEvents, {
      passive: true,
    })
    isGlobalListenersRegistered = true
  }
}

class ScrollObserver extends React.Component {
  static defaultProps = {
    threshold: 1,
    useRAF: true,
    emitOnce: true,
    affixed: false,
  }

  state = { bottom: 0 }

  componentDidMount() {
    this.node = findDOMNode(this)

    registerGlobalListeners()
    // const {throttleRate, useRAF} = this.props
    // const position = window.pageYOffset

    // this.startPosition = position
    // this.previousPosition = position

    // this.subscription = subscribe('scroll', this.handleScroll, {
    //   throttleRate,
    //   useRAF,
    // })
  }

  componentWillUnmount() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe()
    // }
  }

  currentDirection = null
  lastEmitDirection = null
  startPosition = 0
  previousPosition = 0

  handleScroll = () => {
    const position = window.pageYOffset
    /**
     * safari 下（-webkit-overflow-scrolling: touch）
     * window.pageYOffset 有负值，屏蔽事件
     * */

    if (position < 0) {
      return
    }

    const direction = position < this.previousPosition ? 'up' : 'down'

    if (direction !== this.currentDirection) {
      this.currentDirection = direction
      this.startPosition = this.previousPosition
    }

    this.previousPosition = position

    const {
      threshold,
      emitOnce,
      onScrollUp,
      onScrollDown,
      onScrollToBottom,
      onScrollToTop,
    } = this.props

    if (Math.abs(this.startPosition - position) >= threshold) {
      const { bottom } = this.node.getBoundingClientRect()

      if (
        direction === 'down' &&
        this.state.bottom > window.innerHeight &&
        bottom <= window.innerHeight &&
        onScrollToBottom
      ) {
        onScrollToBottom()
      }

      if (
        direction === 'up' &&
        this.state.bottom < window.innerHeight &&
        bottom >= window.innerHeight &&
        onScrollToTop
      ) {
        onScrollToTop()
      }

      this.setState({ bottom })

      if (
        lastUserEvent === 'wheel' &&
        (!emitOnce || this.lastEmitDirection !== direction)
      ) {
        if (direction === 'up') {
          if (onScrollUp) {
            onScrollUp()
          }
        }

        if (direction === 'down') {
          if (onScrollDown) {
            onScrollDown()
          }
        }
      }

      this.lastEmitDirection = direction
      this.startPosition = position
    }
  }

  handleOnBottom = (affixed) => {
    const { dom } = this.state
    if (dom && dom.scrollTop > 10 && !affixed && this.state.affixed === true) {
      if (this.props.onScrollToBottom) {
        this.props.onScrollToBottom()
      }
    }

    this.setState({
      affixed,
    })
  }

  hanldeSetDom = (dom) => {
    this.setState({
      dom,
    })
    if (this.props.setScrollDom) {
      this.props.setScrollDom(dom)
    }
  }

  render() {
    return (
      <div style={{ height: '100%', overflow: 'auto' }} ref={this.hanldeSetDom}>
        <div style={{ minHeight: '100%' }}>{this.props.children || null}</div>
        <Affix
          offsetBottom={0}
          target={() => this.props.scrollDom || this.state.dom || window}
          onChange={this.handleOnBottom}
          style={{ marginBottom: '40px' }}
        />
      </div>
    )
  }
}

export default ScrollObserver
