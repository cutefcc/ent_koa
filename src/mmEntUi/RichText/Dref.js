import React from 'react'
import emojiArray from './emojis.json'
import styles from './dref.less'

export default function (props) {
  const {
    params: { t, url, v, ev, text } = {},
    emojiProps = {},
    key,
    linkStyle,
    closeJump = true,
  } = props
  const handleOpenUrl = (tempUrl) => () => {
    if (closeJump) {
      window.open(tempUrl)
    } else {
      return
    }
  }

  const handleOpenProfile = (uid) => () => {
    window.open(`https://maimai.cn/contact/detail/${uid}`)
  }

  const renderEmoji = (emojiText) => {
    return emojiArray[emojiText] ? (
      <img
        src={emojiArray[emojiText]}
        style={{
          width: `${emojiProps.size || 14}px`,
          height: `${emojiProps.size || 14}px`,
        }}
        className={emojiProps.className || ''}
        key={key}
        alt={emojiText}
      />
    ) : (
      <span key={key}>{emojiText}</span>
    )
  }

  if ((t === '1' && url) || (t === '11' && url)) {
    return (
      <span
        onClick={handleOpenUrl(url)}
        style={linkStyle}
        className={styles.link}
      >
        {text}
      </span>
    )
  } else if (t === '1' && !url) {
    return (
      <span
        style={linkStyle}
        onClick={handleOpenProfile(ev || v)}
        className={styles.link}
      >
        {text}
      </span>
    )
  } else if (t === '12') {
    return renderEmoji(v)
  }

  return text
}
