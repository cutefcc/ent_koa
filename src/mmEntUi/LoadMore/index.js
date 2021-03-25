import React from 'react'
import Button from '../Button'
import styles from './index.less'

export default function LoadMore(data) {
  const { onloadMore, loading } = data
  return (
    <div style={{ textAlign: 'center', margin: '13px 0 0 0' }}>
      <Button
        type="button_s_exact_link_bgray"
        className={`${loading ? styles.loading : null}`}
        onClick={onloadMore}
      >
        <span className="font-size-13">查看更多</span>
      </Button>
    </div>
  )
}
