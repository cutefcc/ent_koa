import React from 'react'
import { Text } from 'mm-ent-ui'
import styles from './SpreadHeader.less'

export default function SpreadHeader() {
  return (
    <div className={styles.employerSpreadProcessingHeader}>
      <Text type="text_primary" size={14} style={{ color: 'rgba(0,0,0,0.45)' }}>
        雇主定向推广 /{' '}
        <span style={{ color: 'rgba(0,0,0,0.65)', fontWeight: 'bold' }}>
          发布编辑
        </span>
      </Text>
    </div>
  )
}
