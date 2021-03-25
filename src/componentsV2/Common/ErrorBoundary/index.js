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
      return <h1>出了点小毛病，错误已经上报，我们会及时处理，感谢！</h1>
    }
    return this.props.children
  }
}
