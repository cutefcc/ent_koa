import React from 'react'
import styles from './index.less'

export default function Tab(props) {
  const { tabs, activeKeys = [], type, onChange = () => {} } = props

  const validTypes = ['small', 'large']
  const realType = validTypes.includes(type) ? type : 'small'

  if (!tabs || !tabs.length) {
    return null
  }

  const renderItem = (conf) => {
    return (
      <span
        className={styles.tab}
        data-active={activeKeys.includes(conf.key)}
        onClick={() => onChange(conf)}
        key={conf.key}
      >
        {conf.title}
      </span>
    )
  }
  return (
    <div
      className={`${styles[`main_${realType}`]} ${props.className || ''}`}
      style={props.style || {}}
    >
      {tabs.map(renderItem)}
    </div>
  )
}
