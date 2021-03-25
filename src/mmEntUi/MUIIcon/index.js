import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_954613_y9kphbuw8o9.js',
    '//at.alicdn.com/t/font_2072458_qud8zjsh73e.js',
  ],
})

const MMIcon = function MMIconFont(props) {
  return (
    <span>
      <IconFont
        {...props}
        type={`${props.type}`}
        className={`${props.className}`}
      />
    </span>
  )
}

export default MMIcon
