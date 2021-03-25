import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { compact } from 'utils'
import emojiArray from './emojis.json'
import Dref from './Dref'
import styles from './index.less'

// const urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g

export default class RichText extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    emojiProps: PropTypes.object,
    closeJump: PropTypes.bool, //关闭富文本跳转的行为
  }

  static defaultProps = {
    emojiProps: {
      size: 14,
      className: '',
    },
  }

  parseEmoji = (text) => {
    if (text === '') {
      return text
    }

    const emojiPattern = /\[.+?\]/g
    const res = []

    let startIndex = 0
    let result = {}
    while (result !== null) {
      startIndex = emojiPattern.lastIndex || 0
      result = emojiPattern.exec(text)

      if (result === null) {
        const tempText = text.substring(startIndex)
        if (tempText) {
          res.push(tempText)
        }
        break
      }

      const subText = text.substring(startIndex, result.index)
      const resultText = `${result}`

      res.push(subText)
      res.push({
        text: resultText,
        type: 'emoji',
      })
    }

    return res
  }

  parseEmojis = (items) => {
    return items.reduce((res, item) => {
      if (typeof item === 'string') {
        return [...res, ...this.parseEmoji(item)]
      }
      return [...res, item]
    }, [])
  }

  parseEnter = (text) => {
    const list = text.split('\n')
    return R.intersperse({ type: 'sep', text: '' }, list)
  }

  parse = (text) => {
    return R.compose(this.parseEmojis, this.parseDrefs, this.parseEnter)(text)
  }

  parseDrefParams = (text) => {
    const param = {}
    let tempText = text
    let match = tempText.match('</dref>')

    if (match != null) {
      tempText = tempText.substring(0, match.index)
    }

    match = tempText.match('>')
    if (match != null) {
      param.text = tempText.substring(match.index + 1)
      tempText = tempText.substring(0, match.index)
    }

    match = tempText.match('<dref')
    if (match != null) {
      tempText = tempText.substring(match.index + 5)
    }

    param.tag = tempText

    const tags = tempText.split(' ')
    tags.map((item) => {
      const [key, value] = item.split('=')
      if (key !== undefined && value !== undefined) {
        param[key] = value
      }
      return item
    })

    return param
  }

  parseDref = (text) => {
    if (text === '') {
      return text
    }

    const emojiPattern = /<dref([^\f\n\r\t\v]+?)>([^\f\t\v]*?)<\/dref>/g
    const res = []

    let startIndex = 0
    let result = {}
    while (result !== null) {
      startIndex = emojiPattern.lastIndex || 0
      result = emojiPattern.exec(text)

      if (result === null) {
        const tempText = text.substring(startIndex)
        if (tempText) {
          res.push(tempText)
        }
        break
      }

      const subText = text.substring(startIndex, result.index)
      const resultText = `${result}`

      res.push(subText)
      res.push({
        text: resultText,
        params: this.parseDrefParams(resultText),
        type: 'dref',
      })
    }

    return res
  }

  parseDrefs = (items) => {
    return items.reduce((res, item) => {
      if (typeof item === 'string') {
        return [...res, ...this.parseDref(item)]
      }
      return [...res, item]
    }, [])
  }

  renderEmoji = (text, index) => {
    const { emojiProps } = this.props
    return emojiArray[text] ? (
      <img
        src={emojiArray[text]}
        style={{
          width: `${emojiProps.size || 14}px`,
          height: `${emojiProps.size || 14}px`,
        }}
        className={emojiProps.className || ''}
        key={`text${index}`}
        alt={text}
      />
    ) : (
      <span key={text}>{text}</span>
    )
  }

  renderItem = (item, index) => {
    const { linkStyle } = this.props
    if (item == null) {
      return null
    }

    if (typeof item === 'string') {
      // return Highlight.mark(this, item, highlight_cls)
      return <span key={`string_${index}`}>{item}</span>
    } else if (item.type === 'emoji') {
      return this.renderEmoji(item.text, index)
    } else if (item.type === 'dref') {
      return (
        <Dref
          linkStyle={linkStyle}
          closeJump={this.props.closeJump}
          params={item.params}
          emojiProps={this.props.emojiProps || {}}
          key={`dref_${index}`}
        />
      )
    } else if (item.type === 'sep') {
      return <br key={`br_${index}`} />
    }

    return item.text || item
  }

  render() {
    const { text = '' } = this.props
    if (!R.is(String, text)) {
      return text
    }

    const t = R.trim(text)
    if (!t) {
      return null
    }

    const arr = this.parse(t)
    return <span className={styles.main}>{arr.map(this.renderItem)}</span>
  }
}
