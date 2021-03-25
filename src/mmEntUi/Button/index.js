import React from 'react'
import { Button } from 'antd'
import classnames from 'classnames'
import styles from './index.less'

function MMButton(props) {
  const type = props.type || 'common'
  const fontSize = props.fontSize || '14'

  // 新的按钮规范
  if (/^button_/.test(type)) {
    return (
      <button
        {...props}
        className={`${styles[type] || styles.button_m_fixed_blue450} ${
          props.className || ''
        }`}
      >
        {props.children}
      </button>
    )
  }

  return (
    <Button
      {...props}
      className={classnames({
        // 针对旧的规范
        [styles['mm-ghost-button']]: type === 'ghost',
        [styles['mm-ghost-2-button']]: type === 'ghost-2',
        [styles['mm-primary-button']]: type === 'primary',
        [styles['mm-primary-2-button']]: type === 'primary-2',
        [styles['mm-common-button']]: type === 'common',
        [styles['mm-likeLink-button']]: type === 'likeLink',
        [styles['mm-link-button']]: type === 'link',
        [styles['mm-dilution-button']]: type === 'dilution',
        [styles['mm-roundCorner']]: props.roundCorner,
        [styles['mm-disabled-button']]: type === 'disabled',
        [props.className]: true,
        [styles[`mm-button-font-${fontSize}`]]: true,
      })}
    />
  )
}

export default MMButton
