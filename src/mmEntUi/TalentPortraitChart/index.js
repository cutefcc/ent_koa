import React, { useState } from 'react'
import * as R from 'ramda'
import styles from './index.less'

const calcPillarWidth = (data, maxData, chartWidth) => {
  return Math.ceil((chartWidth * data) / maxData)
}

const getShowData = (data, showMore) => {
  const sortedData = R.sortWith([R.descend(R.prop('count'))])(data)
  const topFiveData =
    sortedData.length >= 5 ? sortedData.slice(0, 5) : sortedData
  return showMore ? sortedData : topFiveData
}

export default function TalentPortraitChart(props) {
  const [showMore, setShowMore] = useState(0)
  const { data = [], title, className = '', chartWidth = 390 } = props

  if (data.length === 0) {
    return null
  }

  const showData = getShowData(data, showMore)
  const maxData = showData[0].count || 0

  const renderSpreadButton = () => (
    <div
      className={`${styles.moreText} font-size-12 cursor-pointer`}
      onClick={() => setShowMore(!showMore)}
    >
      {showMore ? '收起' : '更多'}
    </div>
  )

  const renderSinglePillar = (item) => {
    const width = calcPillarWidth(item.count || 0, maxData, chartWidth)
    return (
      <div className={styles.pillar} key={item.name}>
        <div className={styles.labelContainer} style={{ width: `${width}px` }}>
          <div className={styles.background} style={{ width: `${width}px` }} />
          <div className={styles.label}>{item.name}</div>
        </div>
        <div className={styles.count}>{item.count}</div>
      </div>
    )
  }
  return (
    <div className={`${styles.main} ${className}`}>
      <div className={styles.header}>
        <div className={`${styles.title} font-size-14`}>{title}</div>
        {data.length > 5 && renderSpreadButton()}
      </div>
      {showData.map(renderSinglePillar)}
    </div>
  )
}
