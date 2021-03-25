import React from 'react'

import Used from 'components/Account/CompanyStat/Used'
import Right from 'components/Account/CompanyStat/Right'
import RightScenesUsed from 'components/Account/CompanyStat/RightScenesUsed'
import RightScenesRate from 'components/Account/CompanyStat/RightScenesRate'
import Detail from 'components/Account/CompanyStat/Detail'

import styles from './company.less'

export default function () {
  return (
    <div className={styles.main}>
      <div>
        <Detail className="margin-top-24" />
      </div>
      <div className={`${styles.flex11} margin-top-24`}>
        <div className="item1">
          <Used />
        </div>
        <div className="item2">
          <Right />
        </div>
      </div>
      <div className={`${styles.flex11} margin-top-24`}>
        <div className="item1">
          <RightScenesUsed />
        </div>
        <div className="item2">
          <RightScenesRate />
        </div>
      </div>
    </div>
  )
}
