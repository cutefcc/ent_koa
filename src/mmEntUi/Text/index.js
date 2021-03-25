import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styles from './index.less'

class Text extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'title',
      'common',
      'text_week',
      'text_common',
      'text_primary',
      'text_secondary',
    ]),
    size: PropTypes.number,
  }

  static defaultProps = {
    type: 'common',
    size: 14,
  }

  constructor(props) {
    super(props)

    this.state = {
      spread: false,
      showSpreadButton: false, // 是否展示”展开“按钮
    }
  }

  isEllipsis = (dom) => {
    if (!dom) {
      return false
    }
    return dom.scrollHeight > dom.offsetHeight
    // const checkDom = dom.cloneNode()
    // checkDom.style.width = `${dom.offsetWidth}px`
    // checkDom.style.height = `${dom.offsetHeight}px`
    // checkDom.style.overflow = 'auto'
    // checkDom.style.position = 'absolute'
    // checkDom.style.zIndex = -1
    // checkDom.style.opacity = 0
    // checkDom.style.whiteSpace = 'nowrap'
    // checkDom.innerHTML = dom.innerHTML

    // const parent = dom.parentNode
    // parent.appendChild(checkDom)
    // const flag = checkDom.scrollWidth > checkDom.offsetWidth
    // parent.removeChild(checkDom)
    // return flag
  }

  handleSpread = () => {
    this.setState({
      spread: true,
      showSpreadButton: false,
    })
  }

  handleSetDom = (dom) => {
    const { spreadProps = null } = this.props
    if (spreadProps && !this.state.spread && this.isEllipsis(dom)) {
      this.setState({
        showSpreadButton: true,
      })
    }
  }

  render() {
    const {
      type,
      size = 14,
      spreadProps = null,
      className = '',
      style,
      ...restProp
    } = this.props
    const fontClass = classnames({
      [styles[`font_${type}`]]: true,
      mm_font: true,
      [styles.mm_font]: true,
      [className]: true,
    })

    const fontStyle = {
      fontSize: `${size}px`,
      ...style,
    }

    if (!spreadProps) {
      return (
        <span className={fontClass} style={fontStyle} {...restProp}>
          {this.props.children}
        </span>
      )
    }

    const { lineHeight = 21, maxLine = 0 } = spreadProps

    return (
      <span
        className={fontClass}
        style={{
          ...fontStyle,
          ...(!this.state.spread
            ? {
                display: 'inline-block',
                maxHeight: `${lineHeight * maxLine}px`,
              }
            : {}),
        }}
        {...restProp}
      >
        <span
          // className={classnames({
          //   [styles.ellipsis]: maxLine > 0 && !this.state.spread,
          //   [styles[`ellipsis_${maxLine}`]]: maxLine > 0 && !this.state.spread,
          // })}
          ref={this.handleSetDom}
          style={
            !this.state.spread
              ? {
                  display: 'inline-block',
                  maxHeight: `${lineHeight * maxLine}px`,
                  lineHeight: `${lineHeight}px`,
                  overflowY: 'hidden',
                  width: '100%',
                }
              : {}
          }
        >
          {this.props.children}
        </span>
        {this.state.showSpreadButton && spreadProps && (
          <span onClick={this.handleSpread} className={styles.spread_container}>
            <span className={styles.spread_button}>展开</span>
          </span>
        )}
      </span>
    )
  }
}

export default Text
