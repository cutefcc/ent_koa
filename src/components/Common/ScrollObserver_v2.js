import React from 'react'
import { Affix } from 'antd'
import PropTypes from 'prop-types'

class ScrollObserver extends React.Component {
  static propTypes = {
    onScrollToBottom: PropTypes.func,
    // onScrollToTop: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    onScrollToBottom: () => {},
    // onScrollToTop: () => {},
    className: '',
  }

  handleOnBottom = (affixed) => {
    const { scrollDom } = this.state
    if (
      scrollDom &&
      scrollDom.scrollTop > 10 &&
      !affixed &&
      this.state.affixed === true
    ) {
      if (this.props.onScrollToBottom) {
        this.props.onScrollToBottom()
      }
    }

    this.setState({
      affixed,
    })
  }

  hanldeSetDom = (scrollDom) => {
    this.setState({
      scrollDom,
    })
    if (this.props.setScrollDom) {
      this.props.setScrollDom(scrollDom)
    }
  }

  render() {
    return (
      <div
        style={{ minHeight: '100%', overflow: 'scroll' }}
        ref={this.hanldeSetDom}
        className={this.props.className}
      >
        {this.props.children || null}
        <Affix
          offsetBottom={0}
          target={() => this.state.scrollDom}
          onChange={this.handleOnBottom}
          // style={{height: '40px'}}
          key="affix_bottom"
        />
      </div>
    )
  }
}

export default ScrollObserver
