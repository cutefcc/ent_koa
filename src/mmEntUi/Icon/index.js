import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'
import styles from './index.less'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_954613_y9kphbuw8o9.js',
})

const MMIcon = function MMIconFont(props) {
  // return <IconFont {...props} type={`anticon-${props.type}`} />
  return (
    // <i
    //   className={`${styles.anticon} ${styles[`anticon-${props.type}`]} ${
    //     props.className
    //   } anticon anticon-${props.type}`}
    // />
    <span className={styles.mmicon}>
      <IconFont
        {...props}
        type={`anticon-${props.type}`}
        className={`${props.className} ${styles.mmicon}`}
      />
    </span>
  )
}

export default MMIcon
