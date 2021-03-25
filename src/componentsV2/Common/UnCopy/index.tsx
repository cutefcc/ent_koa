import * as React from 'react'
import * as $ from 'jquery'

export interface Props {
  className: string
}

export default class UnCopy extends React.PureComponent<Props, State> {
  componentDidMount() {
    $(this.unCopy).unbind('keydown').bind('keydown', this.unCopyHackHandle)
    $(this.unCopy).unbind('copy').bind('copy', this.unCopyHandle)
  }

  unCopyHandle = (e) => {
    e.preventDefault()
    return false
  }

  unCopyHackHandle = (e) => {
    if (e.ctrlKey && e.keyCode === 67) {
      return false
    }
    return true
  }

  componentWillUnmount() {
    $(this.unCopy).unbind('keydown', this.unCopyHackHandle)
    $(this.unCopy).unbind('copy', this.unCopyHandle)
  }

  setUnCopyDom = (node) => (this.unCopy = node)

  render() {
    return (
      <div className={`${this.props.className || ''}`} ref={this.setUnCopyDom}>
        {this.props.children}
      </div>
    )
  }
}
