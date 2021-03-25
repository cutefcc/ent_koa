import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'

@connect()
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error) {
    // Display fallback UI
    this.setState({
      hasError: true,
    })

    this.props.dispatch({
      type: 'global/feedback',
      payload: {
        content: `${R.propOr('', 'message', error)} ${R.propOr(
          '',
          'stack',
          error
        )}`.slice(0, 244),
      },
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return !window.uid ? (
        <p>正在获取用户信息...</p>
      ) : (
        <p>出了点小毛病,您可以反馈给脉脉客服，非常感谢！</p>
      )
    }
    return this.props.children
  }
}
