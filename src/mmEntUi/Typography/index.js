import React from 'react'
import { Typography } from 'antd'
import * as R from 'ramda'
import styles from './index.less'

function MMTypography() {
  return null
}

/**
 * @param {*} props 参考 antd 的 Typography.Text 参数
 * @type: stress secondary blue
 */
MMTypography.Text = function Text(props) {
  const type = R.propOr('', 'type', props)
  const size = R.propOr('14px', 'size', props)
  return (
    <Typography.Text
      {...props}
      className={`${props.className} ${styles[`mm-text-${type}`]} ${
        styles['mm-text']
      }`}
      style={{ fontSize: size }}
    />
  )
}

MMTypography.Title = Typography.Title
MMTypography.Paragraph = Typography.Paragraph

export default MMTypography
