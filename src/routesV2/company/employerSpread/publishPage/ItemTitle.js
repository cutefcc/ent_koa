import React from 'react'
import { Text } from 'mm-ent-ui'
import styles from './ItemTitle.less'

export default function ItemTitle(props) {
  const {
    str = '',
    style = {
      marginTop: '32px',
      marginBottom: '24px',
    },
    iconPaddingLeft = '40px',
  } = props

  return (
    <div className={styles.employerSpreadProcessingItemTitle} style={style}>
      <Text type="title" size={16} style={{ paddingLeft: iconPaddingLeft }}>
        <span
          className="leftSign"
          style={{
            display: 'inline-block',
            width: '4px',
            height: '16px',
            backgroundColor: '#2570FF',
            marginRight: '12px',
          }}
        />
        {str}
      </Text>
    </div>
  )
}
