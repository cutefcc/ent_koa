import React from 'react'
import { Text, Icon, Button } from 'mm-ent-ui'
import { compact } from 'utils'
import * as R from 'ramda'

import styles from './index.less'

export default function (props) {
  const {
    data,
    auth: { isTalentBankStable },
  } = props
  const descKeys = [
    'province',
    'sdegree',
    'worktime',
    'age',
    'gender_str',
    isTalentBankStable ? '' : 'intention', // remove temporarily in v 3.0
    'salary',
  ]
  const format = {
    age: (value) => `${value}岁`,
  }
  const descValues = compact(
    descKeys.map((key) => {
      const v = data[key]
      if (R.isEmpty(v) || R.isNil(v)) {
        return ''
      }

      if (format[key]) {
        return format[key](v)
      }

      return v
    })
  )
  const descDoms = R.intersperse(
    <span className={styles.sep} />,
    descValues.map((v) => (
      <Text key={v} type="text_primary" size={13} className={styles.descItem}>
        {v}
      </Text>
    ))
  )

  const rank = R.path(['rank_order', 'rank'], data)
  const order = R.path(['rank_order', 'order'], data)

  return (
    <div className="margin-top-6">
      <Text type="text_primary" size={13}>
        {compact([data.profession, data.major]).join('·')}
        &nbsp;&nbsp;
        {!!rank && `影响力${Math.floor(rank)}`}
        {order > 0 && `（排名${order}）`}
      </Text>
      <div className="flex flex-align-center margin-top-6">
        <div className="flex-1 ellipsis">{descDoms}</div>
      </div>
    </div>
  )
}
