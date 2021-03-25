import React from 'react'

import MyContent from './Content'
import styles from './index.less'

const MyLayout = () => (
  <div className={styles.main}>
    <MyContent />
  </div>
)

export default MyLayout
